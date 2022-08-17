import { SQS } from "aws-sdk";
import { Invoice } from "src/typings/invoice";

const sqs = new SQS();

export async function receiptMailer(
  invoice: Invoice,
  amountPaid: number,
  totalPaidSoFar: number
) {
  const { title, id, paidStatus, recipientEmail, amount } = invoice;

  console.log("RECIEPT BEING EMAILED");

  await sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Payment reciept ${title} | ${id}`,
        recipient: recipientEmail,
        body: `I confirm I have recieved payment of ${amountPaid} \
            I have now recieved payment of "${totalPaidSoFar}" towards ${amount}. The invoice is ${paidStatus}`,
      }),
    })
    .promise();

  console.log("RECIEPT EMAILED");

  return;
}
