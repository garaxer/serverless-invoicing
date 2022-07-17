import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import commonMiddleware from '../libs/commonMiddleware';

const dynamodb = new DynamoDB.DocumentClient();

async function createInvoice(event, context) {
  const { title, amount = 0 } = event.body;
  const now = new Date();
  const invoice = {
    id: uuid(),
    title,
    paidStatus: "UNPAID",
    createdAt: now.toISOString(),
    amount,
    paidBy: {
      amount: 0
    }
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.INVOICES_TABLE_NAME,
        Item: invoice,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(invoice),
  };
}

export const handler = commonMiddleware(createInvoice);
