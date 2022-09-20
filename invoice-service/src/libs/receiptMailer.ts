import { SQS } from "aws-sdk";
import { Invoice } from "src/typings/invoice";
import { addDays } from "date-fns";
const sqs = new SQS();

export async function receiptMailer(
  invoice: Invoice,
  amountPaid: number,
  totalPaidSoFar: number,
  nextInvoice?: Invoice
) {
  const {
    title,
    id,
    paidStatus,
    recipientEmail,
    recipientName,
    amount,
    serviceStartDate,
    serviceEndDate,
    paidBy,
    dueDate,
  } = invoice;
  const {
    serviceStartDate: nextServiceStartDate,
    serviceEndDate: nextServiceEndDate,
    dueDate: nextDueDate = addDays(new Date(dueDate), 7).toISOString(),
    amount: nextAmount = amount,
  } = nextInvoice;
  const datePaid =
    paidBy && paidBy.length ? paidBy[paidBy.length - 1].datePaid : undefined;

  console.log("RECIEPT BEING EMAILED");
  const makeDateString = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-AU") : "";
  await sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Payment reciept for ${title} | ${id}`,
        recipient: recipientEmail,
        body: `${recipientName ? `Hi ${recipientName}` : ""}\n
        This email is a receipt to confirm payment of $${amountPaid} on ${makeDateString(
          datePaid
        )} which pays $${totalPaidSoFar} towards $${amount} for the period ${
          makeDateString(serviceStartDate) || "?"
        } to ${
          makeDateString(serviceEndDate) || "?"
        }. I have marked the invoice as ${paidStatus}.
\n
        The next period "${makeDateString(nextServiceStartDate) || "?"} to ${
          makeDateString(nextServiceEndDate) || "?"
        }" $${nextAmount} is due before ${makeDateString(nextDueDate)}.`,
      }),
    })
    .promise();

  console.log("RECIEPT EMAILED");

  return;
}
