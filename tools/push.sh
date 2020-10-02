#!/bin/bash

VERSION=$(node -p "require('./package.json').version")

echo $VERSION

docker tag aws-spa lauravuo/aws-spa:$VERSION
docker push lauravuo/aws-spa:$VERSION

docker tag aws-spa lauravuo/aws-spa:latest
docker push lauravuo/aws-spa:latest

