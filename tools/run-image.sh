#!/bin/bash

docker run -it --rm \
  -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
  -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
  -e AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} \
  -e CDK_DEFAULT_ACCOUNT=${CDK_DEFAULT_ACCOUNT} \
  -v $(PWD)/cdk.context.json:/aws-spa/cdk.context.json \
  -v $(PWD)/cdk.out:/aws-spa/cdk.out \
  aws-spa