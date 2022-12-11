import { middyfy } from "@libs/lambda";
import { SNSEvent } from "aws-lambda";
import { SES } from "aws-sdk";
// Can contain html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
const ses = new SES({ region: "ap-southeast-2" });

const hello = async (event: SNSEvent) => {
  const record = event.Records[0];
  console.log(record);

  const email: { [key: string]: string } = JSON.parse(
    (record as unknown as { body: string }).body
  );
  const { subject, body, recipients = [] } = email;

  const params = {
    Source: "gbagnall8@gmail.com",
    Destination: {
      ToAddresses: ["gbagnall8@gmail.com", ...recipients],
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

export const main = middyfy(hello);
