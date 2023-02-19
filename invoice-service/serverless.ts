import type { AWS } from "@serverless/typescript";

import BookingsTableIAM from "./iam/TableIAM";
import MailQueueIAM from "./iam/MailQueueIAM";
import SendTextIAM from "./iam/SendTextIAM";
import InvoicesBucketIAM from "./iam/InvoicesBucketIAM";
import ServicesBucketIAM from "./iam/ServicesBucketIAM";
import DynamoTables from "./resources/DynamoTables";
import InvoicesBucket from "./resources/InvoicesBucket";
import ServicesBucket from "./resources/ServicesBucket";
import addBooking from "@functions/addBooking";
import createService from "@functions/createService";
import getBookings from "@functions/getBookings";
// import remindService from "@functions/remindService";
import handlers from "@handlers/handlers";
import deleteBooking from "@functions/deleteBooking";
import {
  createInvoice,
  payInvoice,
  editInvoice,
  uploadInvoicePicture,
} from "@handlers/index";

export const custom = {
  InvoicesBucket: {
    name: "gnb-invoices-bucket-${self:provider.stage}",
  },
  ServicesBucket: {
    name: "gnb-services-bucket-${self:provider.stage}",
  },
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
    profile: 'personal',
    memorySize: 256,
    stage: "${opt:stage, 'dev'}",
    region: "ap-southeast-2",
    iamRoleStatements: [
      BookingsTableIAM,
      MailQueueIAM,
      ...SendTextIAM,
      InvoicesBucketIAM,
      ServicesBucketIAM,
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      BOOKINGS_TABLE_NAME: "BookingsTable-${self:provider.stage}",
      INVOICES_TABLE_NAME: "InvoicesTable-${self:provider.stage}",
      INVOICES_BUCKET_NAME: "${self:custom.InvoicesBucket.name}",
      SERVICES_BUCKET_NAME: "${self:custom.ServicesBucket.name}",
      MAIL_QUEUE_URL: "${self:custom.MailQueue.url}",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  resources: {
    Resources: {
      ...DynamoTables,
      ...InvoicesBucket,
      ...ServicesBucket,
    },
    Conditions: {
      isDev: {
        "Fn::Equals": ["${self:provider.stage}", "dev"],
      },
    },
  },
  // import the function via paths
  functions: {
    getBookings,
    addBooking,
    createService,
    deleteBooking,
    uploadInvoicePicture,
    ...handlers,
    createInvoice,
    payInvoice,
    editInvoice,
    // remindService, // convert from text to email, just use the sqs code.
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
