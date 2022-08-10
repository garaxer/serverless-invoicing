import type { AWS } from "@serverless/typescript";
import * as fs from "fs";
import hello from "@functions/hello";
import auth from "@functions/auth";
import privateEndpoint from "@functions/privateEndpoint";
import publicEndpoint from "@functions/publicEndPoint";

const serverlessConfiguration: AWS = {
  service: "serverless-auth0-authorizer",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    memorySize: 128,
    region: "ap-southeast-2",
    environment: {
      AUTH0_PUBLIC_KEY: fs.readFileSync("./secret.pem", "utf8"), // From auth0 application settings
    },
  },
  // import the function via paths
  functions: { hello, auth, privateEndpoint, publicEndpoint },
  resources: {
    Resources: {
      // This response is needed for custom authorizer failures cors support
      GatewayResponse: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
          },
          ResponseType: "EXPIRED_TOKEN",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
          StatusCode: "401",
        },
      },
      AuthFailureGatewayResponse: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'",
          },
          ResponseType: "UNAUTHORIZED",
          RestApiId: { Ref: "ApiGatewayRestApi" },
          StatusCode: "401",
        },
      },
    },
  },
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
      concurrency: 2,
    },
  },
};

module.exports = serverlessConfiguration;
