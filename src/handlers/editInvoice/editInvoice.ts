import { DynamoDB } from "aws-sdk";
import commonMiddleware from "../../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { getInvoiceById } from "../getInvoice";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema from "./schema";

const dynamodb = new DynamoDB.DocumentClient();

const editInvoice: ValidatedEventAPIGatewayProxyEvent<typeof schema>= async (event, context) => {
  const { id } = event.pathParameters;
  const updatedFields = event.body;

  const invoice = await getInvoiceById(id);
  const {title, amount, dueDate, recipientEmail} = {...invoice, ...updatedFields}


  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    Key: { id },
    UpdateExpression:
      "set title = :title, amount = :amount, dueDate = :dueDate, recipientEmail = :recipientEmail",
    ExpressionAttributeValues: {
      ":title": title,
      ":amount": amount,
      ":recipientEmail": recipientEmail,
      ":dueDate": new Date(dueDate).toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedInvoice: DynamoDB.DocumentClient.AttributeMap;

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

export const handler = commonMiddleware(editInvoice);
