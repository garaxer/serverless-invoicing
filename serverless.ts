import type { AWS } from "@serverless/typescript";

import hello from "@functions/hello";
import BookingsTableIAM from "./iam/TableIAM";
import DynamoTables from "./resources/DynamoTables";
import createBooking from "@functions/createBooking";
import getBookings from "@functions/getBookings";
import handlers from "@handlers/handlers";
import deleteBooking from "@functions/deleteBooking";
import { createInvoice } from "@handlers/index";
import payInvoice from "@handlers/payInvoice";

// TODO use these in the imports
export const custom = {
  BookingsTable: {
    name: { Ref: "BookingsTable" },
    arn: { "Fn::GetAtt": ["BookingsTable", "Arn"] },
  },
  InvoicesTable: {
    name: { Ref: "InvociesTable" },
    arn: { "Fn::GetAtt": ["InvociesTable", "Arn"] },
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
    iamRoleStatements: [BookingsTableIAM],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      BOOKINGS_TABLE_NAME: 'BookingsTable-${self:provider.stage}',
      INVOICES_TABLE_NAME: 'InvoicesTable-${self:provider.stage}',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  resources: {
    Resources: {
      ...DynamoTables,
    },
  },
  // import the function via paths
  functions: { hello, getBookings, createBooking, deleteBooking, ...handlers, createInvoice, payInvoice },
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
