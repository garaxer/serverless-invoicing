import { formatJSONResponse, ValidatedAPIGatewayProxyEvent } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { SES } from "aws-sdk";
import schema from "./schema";
// Can contain html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
const ses = new SES({ region: "ap-southeast-2" });

const handler = async (
  event: ValidatedAPIGatewayProxyEvent<typeof schema>,
  _context
) => {
  const { subject, body, recipients = [] } = event.body;

  const params = {
    Source: "gbagnall8@gmail.com",
    Destination: {
      ToAddresses: ["gbagnall8@gmail.com", ...(recipients as string[])],
    },
    Message: {
      Body: {
        Text: {
          Data: body,
        },
      },
      Subject: {
        Data: subject,
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error,
      }),
    };
  }
};

export const main = middyfy(handler);
