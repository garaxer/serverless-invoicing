import { DynamoDB } from "aws-sdk";
import commonMiddleware from "../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { APIGatewayEvent, Context } from "aws-lambda";
import validator from "@middy/validator";
import getInvoicesSchemas from "@libs/schemas/getInvoicesSchemas";
import { Invoice, PAIDSTATUS } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();

export type GetInvoicesByFilterType = {
  paidStatus: PAIDSTATUS;
  createdBy?: string;
  recipient?: string;
  dueAfterDate?: string;
  dueBeforeDate?: string;
  limit?: string | number;
  exclusiveStartKeyId?: string;
};
export const getInvoicesByFilter = async ({
  paidStatus,
  limit,
  exclusiveStartKeyId,
  dueAfterDate,
}: GetInvoicesByFilterType): Promise<Invoice[]> => {
  let invoices: DynamoDB.DocumentClient.ItemList;
  // TODO add optional duedate before and after

  // TODO Only get invoices created by you.
  try {
    const result = await dynamodb
      .query({
        TableName: process.env.INVOICES_TABLE_NAME,
        IndexName: "statusAndDueDate",
        KeyConditionExpression: `paidStatus = :paidStatus${
          dueAfterDate ? " AND dueAfterDate > :dueAfterDate" : ""
        }`,
        ExpressionAttributeValues: {
          ":paidStatus": paidStatus,
          ...(dueAfterDate && { ":dueAfterDate": dueAfterDate }),
        },
        ...(limit && { Limit: parseInt(`${limit || 20}`) }),
        ...(exclusiveStartKeyId && {
          ExclusiveStartKey: { id: exclusiveStartKeyId },
        }), // LastEvaluatedKey
      })
      .promise();

    invoices = result.Items;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
  return invoices as Invoice[];
};

async function getInvoices(event: APIGatewayEvent, _context: Context) {
  const {
    status = PAIDSTATUS.UNPAID,
    limit = undefined,
    exclusiveStartKeyId = undefined,
  } = event?.queryStringParameters || {};

  const invoices = await getInvoicesByFilter({
    paidStatus: status as PAIDSTATUS,
    limit,
    exclusiveStartKeyId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify(invoices),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
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
