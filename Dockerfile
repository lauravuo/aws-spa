FROM node:12.18.2-alpine3.12

WORKDIR /aws-spa

ADD package* ./

RUN npm install -g aws-cdk && \
  npm install -g typescript && \
  npm install

ADD . .

ENTRYPOINT ["./tools/run.sh"]
