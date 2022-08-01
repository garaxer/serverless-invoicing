import { DynamoDB, SQS } from "aws-sdk";
import { Invoice } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();

export async function payInvoiceCommand(invoice: Invoice, amount: number) {
  const paidStatus =
    amount + invoice.paidBy.amount >= invoice.amount ? "PAID" : "UNPAID";

  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    Key: { id: invoice.id },
    UpdateExpression:
      "set paidBy.amount = :amount, paidBy.datePaid = :datePaid, paidStatus = :paid",
    ExpressionAttributeValues: {
      ":amount": amount + invoice.paidBy.amount,
      ":paid": paidStatus,
      ":datePaid": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedInvoice: DynamoDB.DocumentClient.AttributeMap;

  const result = await dynamodb.update(params).promise();

  
  updatedInvoice = result.Attributes;

  return updatedInvoice as Invoice | undefined;
}
