import { DynamoDB, SQS, SNS } from "aws-sdk";
import { Service } from "src/typings/booking";

const dynamodb = new DynamoDB.DocumentClient();
const sqs = new SQS();
const sns = new SNS({ region: "ap-southeast-2" });
export async function serviceMailer(service: Service, sendOverride = false) {
  const now = new Date();

  const {
    title,
    timeSlots,
    id,
    bookingStatus,
    startDateTime,
    reminderSentDate,
    description,
    sendText,
    sendEmail,
  } = service;

  const isAfter = new Date(startDateTime) > now;
  const isClosed = bookingStatus.includes("CLOSED");

  // Has it been a bit since last reminder email and it is overdue and unpaid
  if (reminderSentDate && !sendOverride) {
    const REMINDER_INTERVAL = 86400000 * 1; //1 day * 1
    const lastSent = new Date(reminderSentDate);
    const followingDay = new Date(lastSent.getTime() + REMINDER_INTERVAL); // + 1 day in ms

    console.log({ isAfter, isClosed, now, followingDay });

    if (isAfter || isClosed || now < followingDay) {
      return;
    }
  }

  const params = {
    TableName: process.env.BOOKINGS_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set reminderSentDate = :reminderSentDate",
    ExpressionAttributeValues: {
      ":reminderSentDate": now.toISOString(),
    },
  };

  await dynamodb.update(params).promise();

  console.log("Sending invoice");

  const notifyBookees = sendEmail
    ? timeSlots.flatMap((t) =>
        t.attendees.map((a) =>
          sqs
            .sendMessage({
              QueueUrl: process.env.MAIL_QUEUE_URL,
              MessageBody: JSON.stringify({
                subject: `${title.replace("{name}", a.name)}`,
                recipient: a.email,
                body: `${description.replace(
                  "{startDateTime}",
                  new Date(startDateTime)
                    .toLocaleDateString("en-AU")
                    .replace("{name}", a.name)
                )}`,
              }),
            })
            .promise()
        )
      )
    : [];

  const notifyBookeesText = sendText
    ? timeSlots.flatMap((t) =>
        t.attendees.flatMap((a) =>
          a.phoneNumber
            ? [
                sns
                  .publish({
                    PhoneNumber: a.phoneNumber,
                    Message: `${title.replace("{name}", a.name)}`,
                  })
                  .promise(),
              ]
            : []
        )
      )
    : [];

  return Promise.all([notifyBookeesText, notifyBookees]);
}
