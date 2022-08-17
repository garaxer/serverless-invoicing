import { DynamoDB } from "aws-sdk";
import { Invoice } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();

export async function payInvoiceCommand(
  invoice: Invoice,
  amount: number,
  totalPaidSoFar: number,
  email = "unknown"
) {
  const paidStatus =
    amount + totalPaidSoFar >= invoice.amount ? "PAID" : "UNPAID";
  // email is the email of the account the user is logged in with that has.
  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    Key: { id: invoice.id },
    UpdateExpression: "set paidBy = :paidBy, paidStatus = :paid",
    ExpressionAttributeValues: {
      ":paidBy": [
        ...invoice.paidBy,
        { datePaid: new Date().toISOString(), amount, email },
      ],
      ":paid": paidStatus,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedInvoice: DynamoDB.DocumentClient.AttributeMap;
  
  const result = await dynamodb.update(params).promise();
  console.log({result});

  updatedInvoice = result.Attributes;

  console.log({updatedInvoice});

  return updatedInvoice as Invoice | undefined;
}
