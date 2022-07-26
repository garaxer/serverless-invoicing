import { SQS } from "aws-sdk";
import { Invoice } from "src/typings/invoice";

const sqs = new SQS();

export async function receiptMailer(invoice: Invoice, amountPaid: number) {
  const {
    title,
    id,
    paidStatus,
    recipientEmail,
    amount,
    paidBy: { amount: totalPayment },
  } = invoice;

  console.log("RECIEPT NOT YET IMPLEMENTED");
  return;
  await sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Payment reciept ${title}-${id}`,
        recipient: recipientEmail,
        body: `I confirm I have recieved payment of ${amountPaid} \
            I have now recieved payment of "${totalPayment}" towards ${amount}. The invoice is ${paidStatus}`,
      }),
    })
    .promise();
  return;
}
