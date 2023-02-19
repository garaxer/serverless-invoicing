import { DynamoDB } from "aws-sdk";
import commonMiddleware from "../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { Invoice } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();

export const getInvoiceById = async (id: string) => {
  let invoice: DynamoDB.DocumentClient.AttributeMap;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.INVOICES_TABLE_NAME,
        Key: { id },
      })
      .promise();

    invoice = result.Item;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  if (!invoice) {
    throw new createHttpError.NotFound(`Auction with ID "${id}" not found`);
  }

  return invoice as Invoice | undefined;
};

async function getInvoice(event, context) {
  const { id } = event.pathParameters;
  const { email = "unknown@example.com" } = event.requestContext.authorizer;

  const invoice = await getInvoiceById(id);

  return {
    statusCode: 200,
    body: JSON.stringify({ invoice, email }),
  };
}

export const handler = commonMiddleware(getInvoice);
