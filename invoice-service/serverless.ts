import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import BookingsTableIAM from "./iam/TableIAM";
import MailQueueIAM from "./iam/MailQueueIAM";
import DynamoTables from "./resources/DynamoTables";
import addBooking from "@functions/addBooking";
import createService from "@functions/createService";
import getBookings from "@functions/getBookings";
import handlers from "@handlers/handlers";
import deleteBooking from "@functions/deleteBooking";
import { createInvoice, payInvoice, editInvoice } from "@handlers/index";

// TODO use these as the imports
export const custom = {
  authorizer: {
    name: "serverless-auth0-authorizer-${self:provider.stage}-auth",
    arn: {
      "Fn::Sub":
        "arn:aws:lambda:${AWS::Region}:${AWS::AccountId}:function:serverless-auth0-authorizer-${self:provider.stage}-auth",
    },
  },
  Foo: { "Fn::If": ["isDev", 9, 12] },
  BookingsTable: {
    name: { Ref: "BookingsTable" },
    arn: { "Fn::GetAtt": ["BookingsTable", "Arn"] },
  },
  InvoicesTable: {
    name: { Ref: "InvociesTable" },
    arn: { "Fn::GetAtt": ["InvociesTable", "Arn"] },
  },
  MailQueue: {
    arn: "${cf:notification-service-${self:provider.stage}.MailQueueArn}",
    url: "${cf:notification-service-${self:provider.stage}.MailQueueUrl}",
  },
};

const serverlessConfiguration: AWS = {
  service: "psych-service",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-dynamodb-local",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    memorySize: 256,
    stage: "${opt:stage, 'dev'}",
    region: "ap-southeast-2",
    iamRoleStatements: [BookingsTableIAM, MailQueueIAM],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      BOOKINGS_TABLE_NAME: "BookingsTable-${self:provider.stage}",
      INVOICES_TABLE_NAME: "InvoicesTable-${self:provider.stage}",
      MAIL_QUEUE_URL: "${self:custom.MailQueue.url}",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  resources: {
    Resources: {
      ...DynamoTables,
    },
    Conditions: {
      isDev: {
        "Fn::Equals": ["${self:provider.stage}", "dev"],
      },
    },
  },
  // import the function via paths
  functions: {
    hello,
    getBookings,
    addBooking,
    createService,
    deleteBooking,
    ...handlers,
    createInvoice,
    payInvoice,
    editInvoice,
  },
  package: { individually: true },
  custom: {
    ...custom,
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
