import { DynamoDB } from "aws-sdk";
import commonMiddleware from "../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { APIGatewayEvent, Context } from "aws-lambda";
import validator from '@middy/validator';
import getInvoicesSchemas from '@libs/schemas/getInvoicesSchemas';

const dynamodb = new DynamoDB.DocumentClient();

async function getInvoices(event: APIGatewayEvent, _context: Context) {
  let invoices: DynamoDB.DocumentClient.ItemList;
  // TODO add optional duedate before and after
  const { status = "UNPAID" } = event.queryStringParameters;

  try {
    const result = await dynamodb
      .query({
        TableName: process.env.INVOICES_TABLE_NAME,
        IndexName: "statusAndDueDate",
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
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Credentials': true,
    // },
    body: JSON.stringify(invoices),
  };
}

export const handler = commonMiddleware(getInvoices).use(
  validator({
    inputSchema: getInvoicesSchemas,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
