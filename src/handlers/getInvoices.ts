import { DynamoDB } from "aws-sdk";
import commonMiddleware from "../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { APIGatewayEvent, Context } from "aws-lambda";

const dynamodb = new DynamoDB.DocumentClient();

async function getInvoices(event: APIGatewayEvent, _context: Context) {
  let invoices: DynamoDB.DocumentClient.ItemList;
  const { status = "UNPAID" } = event.queryStringParameters;

  try {
    const result = await dynamodb
      .query({
        TableName: process.env.INVOICES_TABLE_NAME,
        IndexName: "statusAndEndDate",
        KeyConditionExpression: "paidStatus = :paidStatus",
        ExpressionAttributeValues: {
          ":paidStatus": status,
        },
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
