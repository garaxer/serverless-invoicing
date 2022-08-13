import commonMiddleware from "../../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { getInvoiceById } from "../getInvoice";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema, { payInvoiceSchema } from "./schema";
import { payInvoiceCommand } from "@libs/payInvoiceCommand";
import { receiptMailer } from "@libs/receiptMailer";
import { PAIDSTATUS } from "src/typings/invoice";
import validator from "@middy/validator";
import { Authorizer } from "src/typings/authorizer";

const payInvoice: ValidatedEventAPIGatewayProxyEvent<typeof schema, Authorizer> = async (
  event,
  _context
) => {
  const { email } = event.requestContext.authorizer;
  const { id } = event.pathParameters;
  const { amount } = event.body;

  // Validate amount
  if (amount < 0) {
    throw new createHttpError.Forbidden(
      `Your pay amount cannot be less than 0. Your Amount: ${amount}`
    );
  }

  const invoice = await getInvoiceById(id);
  const totalPaidSoFar = invoice?.paidBy?.reduce((a, c) => c.amount + a, 0) || 0;
  
  // Validate overpaying
  if ((amount + totalPaidSoFar ) > invoice.amount) {
    throw new createHttpError.Forbidden(
      `Your pay amount greater than the remaining amount Your Amount: ${amount}. Paid so far ${
        totalPaidSoFar
      }. Total ${invoice.amount}`
    );
  }

  // Validate paying if marked as paid
  if (invoice.paidStatus === PAIDSTATUS.PAID) {
    throw new createHttpError.Forbidden(`You have paid this invoice`);
  }

  // Pay identity validation
  // if(email === invoice.createdBy) {
  //   throw new createHttpError.Forbidden('You cannot pay your own invoice')
  // }

  try {
    const updatedInvoice = await payInvoiceCommand(invoice, amount, email);
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
