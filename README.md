# SPA deployment to AWS

Instructions with CDK script for deploying single-page-app to S3.
After executing manual steps from section **prerequisities** you can run the CDK script. The script will create

- S3 bucket for storing the files
- TLS certificate to region "us-east-1" via ACM
- Cloudfront distribution with the TLS certificate for the S3 bucket
- Route53 record in a pre-existing hosted zone for the cloudfront distribution
- IAM user with S3 bucket update permissions for CI use

## Prerequisities

1. Make sure you have installed node.js, AWS CDK and Typescript:

   ```bash
   # node
   nvm install

   # aws cdk
   npm install -g aws-cdk

   # typescript
   npm install -g typescript
   ```

1. You need AWS Account. [Create IAM user and AWS Access keys via console](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) if you don't have one already.

1. [Create a public hosted zone to AWS Route53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingHostedZone.html) for your domain. If your domain registrar is different from AWS Route53, you need to store the AWS nameservers to your domain settings (via the domain registrar UI).

1. Declare following environment variables:

   ```bash
   # default region for AWS e.g. eu-north-1
   export AWS_DEFAULT_REGION=<xxx>

   # IAM user access key ID
   export AWS_ACCESS_KEY_ID=<xxx>

   # IAM user secret access key
   export AWS_SECRET_ACCESS_KEY=<xxx>

   # default region for AWS e.g. eu-north-1
   export CDK_DEFAULT_REGION=<xxx>

   # AWS account number
   export CDK_DEFAULT_ACCOUNT=<xxx>
   ```

## Steps

```bash
# install deps
npm install

# bootstrap CDK
cdk bootstrap

# deploy CDK
# TODO: pass domain name as argument
# TODO: set creating CI user as optional
# TODO: example how to sync files to S3
cdk deploy
```


