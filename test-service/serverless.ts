import type { AWS } from "@serverless/typescript";
import { testFn, testFnKey } from "@functions/index";

const serverlessConfiguration: AWS = {
  service: "test-service",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    profile: "personal",
    stage: "${opt:stage, 'dev'}",
    region: "ap-southeast-2",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      apiKeys: [
        {
          free: [
            {
              name: "${self:provider.stage}-myFreeKey",
              value: "testtesttesttesttesttest",
              description: "foo",
              customerId: "bar",
            },
          ],
        },
        {
          paid: [
            {
              name: '${self:provider.stage}-myPaidKey',
              value: 'paidpaidpaidpaidpaidpaid',
              description: 'foo',
              customerId: 'bar',
            },
          ],
        },
      ],
      usagePlan: [
        {
          free: {
            quota: {
              limit: 10,
              offset: 0,
              period: "DAY",
            },
            throttle: {
              burstLimit: 20,
              rateLimit: 10,
            },
          },
        },
        {
          paid: {
            quota: {
              limit: 50000,
              offset: 1,
              period: "MONTH",
            },
            throttle: {
              burstLimit: 2000,
              rateLimit: 1000,
            },
          },
        },
      ],
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
  },
  // import the function via paths
  functions: { testFn, testFnKey },
  package: { individually: true },
  custom: {
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
