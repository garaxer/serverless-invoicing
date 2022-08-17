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

  // Has it been a week since last reminder email and it is overdue and unpaid
  if (reminderSentDate && !sendOverride) {
    const REMINDER_INTERVAL = 1; // 86400000; //1 day
    const lastSent = new Date(reminderSentDate);
    const followingDay = new Date(lastSent.getTime() + REMINDER_INTERVAL); // + 1 day in ms

    console.log({isOverdue, isUnpaid, now, followingDay});
    
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
        body: `Your payment $"${amount}" is due ${new Date(
          dueDate
        ).toLocaleDateString()}. You have paid $${amountPaid}, status is ${paidStatus}`,
      }),
    })
    .promise();

    // TODOMAYBE notify invoice creator it has been paid?

  return Promise.all([notifyPayer]);
}
