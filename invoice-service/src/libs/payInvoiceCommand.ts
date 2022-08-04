import { DynamoDB } from "aws-sdk";
import { Invoice } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();

export async function payInvoiceCommand(invoice: Invoice, amount: number) {
  const totalPaidSoFar =
    invoice?.paidBy?.reduce((a, c) => c.amount + a, 0) || 0;

  const paidStatus =
    amount + totalPaidSoFar >= invoice.amount ? "PAID" : "UNPAID";

  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    Key: { id: invoice.id },
    UpdateExpression: "set paidBy = :paidBy, paidStatus = :paid",
    ExpressionAttributeValues: {
      ":paidBy": [
        ...invoice.paidBy,
        { datePaid: new Date().toISOString(), amount },
      ],
      ":paid": paidStatus,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedInvoice: DynamoDB.DocumentClient.AttributeMap;

  const result = await dynamodb.update(params).promise();

  updatedInvoice = result.Attributes;

  return updatedInvoice as Invoice | undefined;
}
