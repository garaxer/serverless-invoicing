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
    createdBy,
  } = invoice;
  const {
    serviceStartDate: nextServiceStartDate,
    serviceEndDate: nextServiceEndDate,
    dueDate: nextDueDate = addDays(new Date(dueDate), 7).toISOString(),
    amount: nextAmount = amount,
  } = nextInvoice || {};
  const datePaid =
    paidBy && paidBy.length ? paidBy[paidBy.length - 1].datePaid : undefined;

  console.log("RECIEPT BEING EMAILED");
  //TODO clean this mess up
  const makeDateString = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-AU") : "";
  await sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: `Payment reciept for ${title} | ${id}`,
        recipients: [
          ...recipientEmail
            .split(";")
            .map((x) => x.split(","))
            .flat(),
          createdBy,
        ],
        body: `
Hi ${recipientName},\n
This is a receipt to confirm payment of $${amountPaid} on ${makeDateString(
          datePaid
        )} which pays the period ${makeDateString(
          serviceStartDate
        )}-${makeDateString(serviceEndDate)}.
The next period  ${makeDateString(nextServiceStartDate)}-${makeDateString(
          nextServiceEndDate
        )}  $${nextAmount} is due before ${makeDateString(nextDueDate)}.
        `,

//         bodyOld: `${recipientName ? `Hi ${recipientName}` : ""}\n
// This email is a receipt to confirm payment of $${amountPaid} on ${makeDateString(
//           datePaid
//         )}. You have paid $${totalPaidSoFar} out of $${amount} for the period ${
//           makeDateString(serviceStartDate) || "?"
//         } to ${
//           makeDateString(serviceEndDate) || "?"
//         }. I have marked the invoice as ${paidStatus}.
// \n
//         ${
//           nextInvoice
//             ? `The next amount of $${nextAmount} for the period "${
//                 makeDateString(nextServiceStartDate) || "?"
//               } to ${
//                 makeDateString(nextServiceEndDate) || "?"
//               }" is due before ${makeDateString(nextDueDate)}.`
//             : ""
//         }`,
      }),
    })
    .promise();

  console.log("RECIEPT EMAILED");

  return;
}
