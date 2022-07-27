import commonMiddleware from "../../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { getInvoiceById } from "../getInvoice";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema, { payInvoiceSchema } from "./schema";
import { payInvoiceCommand } from "@libs/payInvoiceCommand";
import { receiptMailer } from "@libs/receiptMailer";
import { PAIDSTATUS } from "src/typings/invoice";
import validator from "@middy/validator";

const payInvoice: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
  _context
) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;

  if (amount < 0) {
    throw new createHttpError.Forbidden(
      `Your pay amount cannot be less than 0. Your Amount: ${amount}`
    );
  }

  const invoice = await getInvoiceById(id);

  if ((amount + invoice?.paidBy?.amount || 0) > invoice.amount) {
    throw new createHttpError.Forbidden(
      `Your pay amount greater than the remaining amount Your Amount: ${amount}. Paid so far ${invoice?.paidBy?.amount || 0}. Total ${invoice.amount}`
    );
  }

  if (invoice.paidStatus === PAIDSTATUS.PAID) {
    throw new createHttpError.Forbidden(`You have paid this invoice`);
  }

  try {
    const updatedInvoice = await payInvoiceCommand(invoice, amount);
    await receiptMailer(invoice, amount);

    return {
      statusCode: 201,
      body: JSON.stringify(updatedInvoice),
    };
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
};

export const handler = commonMiddleware(payInvoice).use(
  validator({
    inputSchema: payInvoiceSchema,
    ajvOptions: {
      strict: false,
    },
  })
);
