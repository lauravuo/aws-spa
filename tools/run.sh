#!/bin/sh

if [ -z "$AWS_ACCESS_KEY_ID" ]; then
  echo "ERROR: AWS_ACCESS_KEY_ID is required"
  exit 0
fi

if [ -z "$AWS_SECRET_ACCESS_KEY" ]; then
  echo "ERROR: AWS_SECRET_ACCESS_KEY is required"
  exit 0
fi

if [ -z "$AWS_DEFAULT_REGION" ]; then
  echo "ERROR: AWS_DEFAULT_REGION is required"
  exit 0
fi

if [ -z "$CDK_DEFAULT_ACCOUNT" ]; then
  echo "ERROR: CDK_DEFAULT_ACCOUNT is required"
  exit 0
fi

if [ -z "$CDK_DEFAULT_REGION" ]; then
  # TODO: use aws_default_region
  echo "WARNING: using AWS_DEFAULT_REGION for CDK_DEFAULT_REGION"
  CDK_DEFAULT_REGION=$AWS_DEFAULT_REGION
fi

cdk bootstrap

cdk deploy