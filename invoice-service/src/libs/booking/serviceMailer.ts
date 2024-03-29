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

  // Has it been a bit since last reminder email and it is not after service end and unpaid
  if (reminderSentDate && !sendOverride) {
    const REMINDER_INTERVAL = 86400000 * 1; //1 day * 1
    const lastSent = new Date(reminderSentDate);
    const followingDay = new Date(lastSent.getTime() + REMINDER_INTERVAL); // + 1 day in ms
    // equivalent to now - reminderSentDate > 1 day
    console.log({
      isAfter,
      isClosed,
      now,
      followingDay,
      "now < followingDay": now < followingDay,
    });

    if (!isAfter || isClosed || now < followingDay) {
      console.log("already sent recently");
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

  console.log("Sending reminder");

  const notifyBookees = sendEmail
    ? timeSlots.flatMap((t) =>
        t.attendees.flatMap((a) => {
          const params = {
            subject: `${title.replace("{name}", a.name)}`,
            recipient: a.email,
            body: `s ${description?.replace(
              "{startDateTime}",
              new Date(startDateTime)
                .toLocaleDateString("en-AU")
                .replace("{name}", a.name)
            )}`,
          };
          return sqs
            .sendMessage({
              QueueUrl: process.env.MAIL_QUEUE_URL,
              MessageBody: JSON.stringify(params),
            })
            .promise();
        })
      )
    : [];

  const notifyBookeesText = sendText
    ? timeSlots.flatMap((t) =>
        t.attendees.flatMap((a) =>
          a.phone
            ? [
                sns
                  .publish({
                    PhoneNumber: a.phone,
                    Message: `${title.replace("{name}", a.name)}`,
                  })
                  .promise(),
              ]
            : []
        )
      )
    : [];
  console.log([...notifyBookeesText, ...notifyBookees]);
  return Promise.all([...notifyBookeesText, ...notifyBookees]);
}
