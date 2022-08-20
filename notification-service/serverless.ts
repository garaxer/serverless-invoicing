import type { AWS } from "@serverless/typescript";
import { sendMail, sendMailHttp } from "@functions/index";
import SendMailIAM from "./iam/SendMailIAM";
import SendTextIAM from "./iam/SendTextIAM";
import MailQueueIAM from "./iam/MailQueueIAM";
import MailQueue, { MailQueueOutputs } from "./resources/MailQueue";

const serverlessConfiguration: AWS = {
  service: "notification-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    stage: "${opt:stage, 'dev'}",
    region: "ap-southeast-2",
    iamRoleStatements: [SendMailIAM, MailQueueIAM, SendTextIAM],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  resources: {
    Resources: {
      MailQueue,
    },
    Outputs: {
      ...MailQueueOutputs,
    },
  },
  // import the function via paths
  functions: { sendMail, sendMailHttp },
  package: { individually: true },
  custom: {
    mailQueue: {
      name: "MailQueue-${self:provider.stage}",
      arn: { "Fn::GetAtt": ["MailQueue", "Arn"] },
      url: { Ref: "MailQueue" },
    },
    authorizer: {
      name: "serverless-auth0-authorizer-${self:provider.stage}-auth",
      arn: {
        "Fn::Sub":
          "arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:serverless-auth0-authorizer-${self:provider.stage}-auth",
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
