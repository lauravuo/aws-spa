import { User, PolicyStatement, Policy, CfnAccessKey } from "@aws-cdk/aws-iam";
import * as s3 from "@aws-cdk/aws-s3";
import * as cdk from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as acm from "@aws-cdk/aws-certificatemanager";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets/lib";
import { BucketAccessControl } from "@aws-cdk/aws-s3";

export interface SpaProps extends cdk.StackProps {
  domainName: string;
  siteSubDomain: string;
}

export class AwsSpaStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: SpaProps) {
    super(scope, id, {
      ...props,
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    });

    const { domainName, siteSubDomain } = props!;
    const zone = route53.HostedZone.fromLookup(this, "SiteZone", {
      domainName,
    });

    const siteDomain = siteSubDomain
      ? siteSubDomain + "." + domainName
      : domainName;

    const siteBucketOriginAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "SiteOriginAccessIdentity",
      {
        comment: "Access " + domainName + " bucket only from CloudFront",
      }
    );

    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: siteDomain,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      accessControl: BucketAccessControl.PUBLIC_READ,

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    const policyStatement = new PolicyStatement();
    policyStatement.addActions("s3:GetObject*");
    policyStatement.addResources(`${siteBucket.bucketArn}/*`);
    policyStatement.addCanonicalUserPrincipal(
      siteBucketOriginAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
    );
    siteBucket.addToResourcePolicy(policyStatement);

    // The code that defines your stack goes here
    // TODO: allow put and delete to bucket only
    const user = new User(this, "SiteUpdater");
    const userPolicyStatement = new PolicyStatement();
    userPolicyStatement.addActions("s3:PutObject*");
    userPolicyStatement.addActions("s3:DeleteObject*");
    userPolicyStatement.addResources(`${siteBucket.bucketArn}/*`);
    const userPolicy = new Policy(this, "SiteUpdaterPolicy", {
      statements: [userPolicyStatement],
    });
    userPolicy.attachToUser(user);

    // TLS cert
    const certificateArn = new acm.DnsValidatedCertificate(
      this,
      "SiteCertificate",
      {
        domainName: siteDomain,
        hostedZone: zone,
        region: "us-east-1",
      }
    ).certificateArn;

    // Cloudfront
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "SiteDistribution",
      {
        aliasConfiguration: {
          acmCertRef: certificateArn,
          names: [siteDomain],
          sslMethod: cloudfront.SSLMethod.SNI,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
        },
        errorConfigurations: [
          {
            errorCode: 404,
            responsePagePath: "/index.html",
            responseCode: 200,
            errorCachingMinTtl: 0,
          },
        ],
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: siteBucket,
              originAccessIdentity: siteBucketOriginAccessIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
              },
            ],
          },
        ],
      }
    );

    new route53.ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone,
    });

    new cdk.CfnOutput(this, "Site", { value: "https://" + siteDomain });

    const accessKey = new CfnAccessKey(this, "UpdaterAccessKey", {
      userName: user.userName,
    });
    new cdk.CfnOutput(this, "accessKeyId", { value: accessKey.ref });
    new cdk.CfnOutput(this, "secretAccessKey", {
      value: accessKey.attrSecretAccessKey,
    });
  }
}
