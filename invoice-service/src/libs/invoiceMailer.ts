import { DynamoDB, SQS } from "aws-sdk";
import { Invoice, PAIDSTATUS } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();
const sqs = new SQS();

export async function invoiceMailer(invoice: Invoice, sendOverride = false) {
  const now = new Date();

  const {
    title,
    amount,
    paidBy,
    recipientEmail,
    id,
    paidStatus,
    reminderSentDate,
    dueDate,
  } = invoice;
  const amountPaid = paidBy.reduce((a, c) => c.amount + a, 0);

  const isOverdue = new Date(dueDate) < now;
  const isUnpaid = paidStatus !== PAIDSTATUS.PAID;

  // Has it been a bit since last reminder email and it is overdue and unpaid
  if (reminderSentDate && !sendOverride) {
    const REMINDER_INTERVAL = 86400000 * 2; //1 day * 2
    const lastSent = new Date(reminderSentDate);
    const followingDay = new Date(lastSent.getTime() + REMINDER_INTERVAL); // + 1 day in ms

    console.log({ isOverdue, isUnpaid, now, followingDay });

    if (!isOverdue || !isUnpaid || now < followingDay) {
      return;
    }
  }

  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    Key: { id },
    UpdateExpression: "set reminderSentDate = :reminderSentDate",
    ExpressionAttributeValues: {
      ":reminderSentDate": now.toISOString(),
    },
  };

  await dynamodb.update(params).promise();

  console.log("Sending invoice");

  const notifyPayer = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Invoice - ${title}${isOverdue ? " OVERDUE" : ""}| ${id}`,
        recipient: recipientEmail,
        body: `Your payment $${amount} is due on the ${new Date(
          dueDate
        ).toLocaleDateString('en-AU')}.\nYou have paid $${amountPaid} so far, the invoice status is ${paidStatus}.`,
      }),
    })
    .promise();

  // TODOMAYBE notify invoice creator it has been paid?

  return Promise.all([notifyPayer]);
}
