// Example auth

//Role is unknown
export type Authorizer = {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: string;
  iss: string;
  sub: string;
  aud: string;
  iat: string;
  exp: string;
};

const context = {
  "https://api.craigscounselling.com/roles": "psych-admin",
  nickname: "gary",
  name: "gary@example.com",
  picture:
    "https://s.gravatar.com/avatar/ca31d722799de29fec0eae7ca77b044b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fga.png",
  updated_at: "2022-08-10T04:57:20.199Z",
  email: "gary@example.com",
  email_verified: "false",
  iss: "https://dev-craig.au.auth0.com/",
  sub: "auth0|62dd58886b621f5dcd004b07",
  aud: "Rzbq2zq5KUzVbT8OGL4jRHKg1iNmfU7N",
  iat: "1660107440",
  exp: "1660143440",
};

const auth = {
  message: "alive",
  event: {
    resource: "/private",
    path: "/private",
    httpMethod: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Authorization:
        "Bearer {the token}",
      "CloudFront-Forwarded-Proto": "https",
      "CloudFront-Is-Desktop-Viewer": "true",
      "CloudFront-Is-Mobile-Viewer": "false",
      "CloudFront-Is-SmartTV-Viewer": "false",
      "CloudFront-Is-Tablet-Viewer": "false",
      "CloudFront-Viewer-ASN": "4804",
      "CloudFront-Viewer-Country": "AU",
      "Content-Type": "application/json",
      Host: "cx5zqxd3v7.execute-api.ap-southeast-2.amazonaws.com",
      "Postman-Token": "0d2105c9-a8fd-49a1-b5a9-0e811727f82b",
      "User-Agent": "PostmanRuntime/7.29.2",
      Via: "1.1 3437ef72cec711eb0ebed9222a22cf66.cloudfront.net (CloudFront)",
      "X-Amz-Cf-Id": "G5gR7HwMOabamJOJOx_1lbxWviaFxMfPJ6tNoIjUOdhM4MeNDQt9qw==",
      "X-Amzn-Trace-Id": "Root=1-62f3b31b-3e7705d52cd7ba10618cee52",
      "X-Forwarded-For": "58.104.185.204, 130.176.212.20",
      "X-Forwarded-Port": "443",
      "X-Forwarded-Proto": "https",
    },
    multiValueHeaders: {
      Accept: ["*/*"],
      "Accept-Encoding": ["gzip, deflate, br"],
      Authorization: [
        "Bearer {the token}",
      ],
      "CloudFront-Forwarded-Proto": ["https"],
      "CloudFront-Is-Desktop-Viewer": ["true"],
      "CloudFront-Is-Mobile-Viewer": ["false"],
      "CloudFront-Is-SmartTV-Viewer": ["false"],
      "CloudFront-Is-Tablet-Viewer": ["false"],
      "CloudFront-Viewer-ASN": ["4804"],
      "CloudFront-Viewer-Country": ["AU"],
      "Content-Type": ["application/json"],
      Host: ["cx5zqxd3v7.execute-api.ap-southeast-2.amazonaws.com"],
      "Postman-Token": ["0d2105c9-a8fd-49a1-b5a9-0e811727f82b"],
      "User-Agent": ["PostmanRuntime/7.29.2"],
      Via: ["1.1 3437ef72cec711eb0ebed9222a22cf66.cloudfront.net (CloudFront)"],
      "X-Amz-Cf-Id": [
        "G5gR7HwMOabamJOJOx_1lbxWviaFxMfPJ6tNoIjUOdhM4MeNDQt9qw==",
      ],
      "X-Amzn-Trace-Id": ["Root=1-62f3b31b-3e7705d52cd7ba10618cee52"],
      "X-Forwarded-For": ["58.104.185.204, 130.176.212.20"],
      "X-Forwarded-Port": ["443"],
      "X-Forwarded-Proto": ["https"],
    },
    queryStringParameters: null,
    multiValueQueryStringParameters: null,
    pathParameters: null,
    stageVariables: null,
    requestContext: {
      resourceId: "iyojw3",
      authorizer: {
        sub: "auth0|62dd58886b621f5dcd004b07",
        email_verified: "false",
        iss: "https://dev-craig.au.auth0.com/",
        principalId: "auth0|62dd58886b621f5dcd004b07",
        integrationLatency: 400,
        picture:
          "https://s.gravatar.com/avatar/ca31d722799de29fec0eae7ca77b044b?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fga.png",
        aud: "Rzbq2zq5KUzVbT8OGL4jRHKg1iNmfU7N",
        updated_at: "2022-08-10T04:57:20.199Z",
        "https://api.craigscounselling.com/roles": "psych-admin",
        nickname: "gary",
        name: "gary@example.com",
        exp: "1660143440",
        iat: "1660107440",
        email: "gary@example.com",
      },
      resourcePath: "/private",
      httpMethod: "POST",
      extendedRequestId: "WpjsQG1IywMF8IQ=",
      requestTime: "10/Aug/2022:13:31:07 +0000",
      path: "/dev/private",
      accountId: "447259991240",
      protocol: "HTTP/1.1",
      stage: "dev",
      domainPrefix: "cx5zqxd3v7",
      requestTimeEpoch: 1660138267090,
      requestId: "bcaba5f4-90ea-4d34-9a51-3457e885705f",
      identity: {
        cognitoIdentityPoolId: null,
        accountId: null,
        cognitoIdentityId: null,
        caller: null,
        sourceIp: "58.104.185.204",
        principalOrgId: null,
        accessKey: null,
        cognitoAuthenticationType: null,
        cognitoAuthenticationProvider: null,
        userArn: null,
        userAgent: "PostmanRuntime/7.29.2",
        user: null,
      },
      domainName: "cx5zqxd3v7.execute-api.ap-southeast-2.amazonaws.com",
      apiId: "cx5zqxd3v7",
    },
    body: {
      name: "ss",
    },
    isBase64Encoded: false,
    rawBody: '{\n    "name": "ss"\n}',
  },
  context: {
    callbackWaitsForEmptyEventLoop: true,
    functionVersion: "$LATEST",
    functionName: "serverless-auth0-authorizer-dev-privateEndpoint",
    memoryLimitInMB: "128",
    logGroupName: "/aws/lambda/serverless-auth0-authorizer-dev-privateEndpoint",
    logStreamName: "2022/08/10/[$LATEST]b0c0f50719414612becb1800b92f5d0c",
    invokedFunctionArn:
      "arn:aws:lambda:ap-southeast-2:447259991240:function:serverless-auth0-authorizer-dev-privateEndpoint",
    awsRequestId: "5ee2f32c-0b59-4199-9663-541c6136cb4c",
  },
};
