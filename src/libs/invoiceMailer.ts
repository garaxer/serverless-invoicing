import { DynamoDB, SQS } from "aws-sdk";
import { Invoice } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();
const sqs = new SQS();

export async function invoiceMailer(invoice: Invoice) {
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
  const { amount: amountPaid } = paidBy;

  if (reminderSentDate) {
    const REMINDER_INTERVAL = 1; // 86400000; //1 day
    const lastSent = new Date(reminderSentDate);
    const followingDay = new Date(lastSent.getTime() + REMINDER_INTERVAL); // + 1 day in ms

    if (now < followingDay) {
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

  const isOverdue = new Date(dueDate) < now;
  console.log('INVOICE NOT YET IMPLEMENTED');
  console.log(isOverdue);
  
  return 

  const notifyPayer = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Invoice - ${title} ${id}${isOverdue ? " OVERDUE" : ""}`,
        recipient: recipientEmail,
        body: `Your payment $"${amount}" is due ${new Date(
          dueDate
        ).toLocaleDateString()}. You have paid $${amountPaid}, status is ${paidStatus}`,
      }),
    })
    .promise();

  return Promise.all([notifyPayer]);
}
