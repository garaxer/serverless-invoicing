import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import commonMiddleware from "../../libs/commonMiddleware";
import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema, {createInvoiceSchema} from "./schema";
import { InvoiceDto, PAIDSTATUS } from "src/typings/invoice";
import { invoiceMailer } from "@libs/invoiceMailer";
import validator from '@middy/validator';

const dynamodb = new DynamoDB.DocumentClient();

const createInvoice: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event, context) => {
  const { title, recipientEmail, amount = 0, dueDate = undefined } = event.body;
  const now = new Date();
  const dueDate14 = new Date();
  dueDate14.setDate(now.getDate() + 14);

  const invoice = new InvoiceDto({
    id: uuid(),
    title,
    paidStatus: PAIDSTATUS.UNPAID,
    createdAt: now.toISOString(),
    amount,
    recipientEmail,
    dueDate: dueDate ? new Date(dueDate).toISOString() : dueDate14.toISOString(),
    paidBy: {
      amount: 0,
    },
  });

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

  await invoiceMailer(invoice)

  return formatJSONResponse({invoice}, 201);
}

export const handler = commonMiddleware(createInvoice).use(
  validator({
    inputSchema: createInvoiceSchema,
    ajvOptions: {
      strict: false,
    },
  })
);;
