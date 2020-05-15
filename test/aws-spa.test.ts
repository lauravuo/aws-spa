import { SynthUtils } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as AwsSpa from "../lib/aws-spa-stack";

test("Default Stack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsSpa.AwsSpaStack(app, "MyTestStack", {
    domainName: "example.com",
    siteSubDomain: "",
  });
  // THEN
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
