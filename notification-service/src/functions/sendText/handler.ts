import { middyfy } from "@libs/lambda";
import { SNSEvent } from "aws-lambda";
import { SNS } from "aws-sdk";
// Can contain html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
const sns = new SNS({ region: "ap-southeast-2" });

const hello = async (event: SNSEvent) => {
  const record = event.Records[0];
  console.log(record);

  const smsText: { [key: string]: string } = JSON.parse(
    (record as unknown as { body: string }).body
  );
  const { PhoneNumber, Message } = smsText;

  const params = { PhoneNumber, Message };

  try {
    const result = await sns.publish(params).promise();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const main = middyfy(hello);
