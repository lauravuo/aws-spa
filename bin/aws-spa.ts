#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { AwsSpaStack } from "../lib/aws-spa-stack";

import * as AWS from "aws-sdk";

const domainName = "lauravuo.me";
const app = new cdk.App();
new AwsSpaStack(app, "AwsSpaStack", {
  domainName: domainName,
  siteSubDomain: "",
});
