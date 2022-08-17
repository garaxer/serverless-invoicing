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

const payInvoice: ValidatedEventAPIGatewayProxyEvent<
  typeof schema,
  Authorizer
> = async (event, _context) => {
  const { email = "unknown@example.com" } = event.requestContext.authorizer;
  const { id } = event.pathParameters;
  const { amount } = event.body;

  // Validate amount
  if (amount < 0) {
    throw new createHttpError.Forbidden(
      `Your pay amount cannot be less than 0. Your Amount: ${amount}`
    );
  }

  const invoice = await getInvoiceById(id);

  if (
    !email.includes(invoice.recipientEmail) &&
    !email.includes(invoice.createdBy)
  ) {
    const message = `You can not pay an invoice that was not assigned to you. ${email} was attempting to pay ${invoice.recipientEmail}'s invoice, created by ${invoice.createdBy}`;
    throw new createHttpError.Forbidden(message);
  }

  const totalPaidSoFar =
    invoice?.paidBy?.reduce((a, c) => c.amount + a, 0) || 0;

  // Validate overpaying
  if (amount + totalPaidSoFar > invoice.amount) {
    throw new createHttpError.Forbidden(
      `Your pay amount greater than the remaining amount Your Amount: ${amount}. Paid so far ${totalPaidSoFar}. Total ${invoice.amount}`
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

  // Pay invoice and use the account the logged it as paid as the one who did.
  // Send an email to the recipient email.
  try {
    const updatedInvoice = await payInvoiceCommand(
      invoice,
      amount,
      totalPaidSoFar,
      email
    );
    const totalPaidSoFarAfterPaying =
      updatedInvoice?.paidBy?.reduce((a, c) => c.amount + a, 0) || 0;

    //TODO Get the next invoice using the due date.
    await receiptMailer(updatedInvoice, amount, totalPaidSoFarAfterPaying);

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
