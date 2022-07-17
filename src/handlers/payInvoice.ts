import { DynamoDB } from "aws-sdk";
import commonMiddleware from "../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { getInvoiceById } from "./getInvoice";

const dynamodb = new DynamoDB.DocumentClient();

async function payInvoice(event, context) {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  const invoice = await getInvoiceById(id);

  if (amount < 0) {
    throw new createHttpError.Forbidden(
      `Your pay amount cannot be less than 0. Your Amount: ${amount}`
    );
  }
  const paidStatus =
    amount + invoice.paidBy.amount >= invoice.amount ? "PAID" : "UNPAID";

  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set paidBy.amount = :amount, paidBy.datePaid = :datePaid, paidStatus = :paid",
    ExpressionAttributeValues: {
      ":amount": amount + invoice.paidBy.amount,
      ":paid": paidStatus,
      ":datePaid": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedInvoice;

  try {
    const result = await dynamodb.update(params).promise();
    updatedInvoice = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(updatedInvoice),
  };
}

export const handler = commonMiddleware(payInvoice);
