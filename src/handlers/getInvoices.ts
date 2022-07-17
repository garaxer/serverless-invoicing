import { DynamoDB } from "aws-sdk";
import commonMiddleware from "../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { APIGatewayEvent, Context } from "aws-lambda";

const dynamodb = new DynamoDB.DocumentClient();

async function getInvoices(_event: APIGatewayEvent, _context: Context) {
  let invoices: DynamoDB.DocumentClient.ItemList;

  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.INVOICES_TABLE_NAME,
      })
      .promise();

    invoices = result.Items;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(invoices),
  };
}

export const handler = commonMiddleware(getInvoices);
