import { v4 as uuid } from "uuid";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import commonMiddleware from "../../libs/commonMiddleware";
import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import schema, { createInvoiceSchema } from "./schema";
import { InvoiceDto, PAIDSTATUS } from "src/typings/invoice";
import { invoiceMailer } from "@libs/invoiceMailer";
import validator from "@middy/validator";
import { subDays, addDays } from "date-fns";
import { Authorizer } from "src/typings/authorizer";

const dynamodb = new DynamoDB.DocumentClient();

// TODO automate this to happen once a week or on payment of last invoice.
const createInvoice: ValidatedEventAPIGatewayProxyEvent<
  typeof schema,
  Authorizer
> = async (event, _context) => {
  const { email = "unknownCreate@example.com" } =
    event.requestContext.authorizer;
  console.log({ auth: event.requestContext.authorizer });
  if (
    event.requestContext.authorizer[
      Object.keys(event.requestContext.authorizer).find((x) =>
        x.includes("roles")
      )
    ]?.includes("admin")
  ) {
    console.log("is admin");
  }

  const {
    title,
    recipientEmail,
    recipientName = undefined,
    amount = 0,
    dueDate: dueDateU = undefined,
    serviceEndDate = undefined,
    serviceStartDate = undefined,
    sendEmail = true,
  } = event.body;
  const now = new Date();
  const dueDate = dueDateU ? new Date(dueDateU) : addDays(now, 14);

  const invoice = new InvoiceDto({
    id: uuid(),
    title,
    paidStatus: PAIDSTATUS.UNPAID,
    createdAt: now.toISOString(),
    amount,
    recipientEmail,
    recipientName,
    dueDate: dueDate.toISOString(),
    paidBy: [],
    serviceEndDate: (serviceEndDate
      ? new Date(serviceEndDate)
      : subDays(dueDate, 1)
    ).toISOString(),
    serviceStartDate: (serviceStartDate
      ? new Date(serviceStartDate)
      : subDays(dueDate, 7)
    ).toISOString(),
    createdBy: email,
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

  if (sendEmail) {
    await invoiceMailer(invoice, true);
  }

  return formatJSONResponse({ ...invoice }, 201);
};

export const handler = commonMiddleware(createInvoice).use(
  validator({
    inputSchema: createInvoiceSchema,
    ajvOptions: {
      strict: false,
    },
  })
);
