import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent } from "aws-lambda";
import { SES } from "aws-sdk";
// Can contain html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
const ses = new SES({ region: "ap-southeast-2" });

const hello = async (_event: APIGatewayProxyEvent) => {
  const params = {
    Source: "gbagnall8@gmail.com",
    Destination: {
      ToAddresses: ["gbagnall8@gmail.com"],
    },
    Message: {
      Body: {
        Text: {
          Data: "Hello from BBQ boat!",
        },
      },
      Subject: {
        Data: "Test Mail",
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const main = middyfy(hello);
