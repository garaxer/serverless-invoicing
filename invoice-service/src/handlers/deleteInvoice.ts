import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import commonMiddleware from "../libs/commonMiddleware";

const dynamodb = new DynamoDB.DocumentClient();

async function deleteInvoices(event, context) {
  let invoice;

  const { id } = event.pathParameters;

  try {
    const result = await dynamodb
      .delete({
        TableName: process.env.INVOICES_TABLE_NAME,
        Key: { id },
      })
      .promise();

    invoice = result;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 204,
    body: JSON.stringify({ id, invoice}),
  };
}

export const handler = commonMiddleware(deleteInvoices);
