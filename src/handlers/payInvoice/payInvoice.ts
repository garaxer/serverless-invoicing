import commonMiddleware from "../../libs/commonMiddleware";
import * as createHttpError from "http-errors";
import { getInvoiceById } from "../getInvoice";
import { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import schema from "./schema";
import { payInvoiceCommand } from "@libs/payInvoiceCommand";
import { receiptMailer } from "@libs/receiptMailer";
import { PAIDSTATUS } from "src/typings/invoice";


const payInvoice: ValidatedEventAPIGatewayProxyEvent<typeof schema>= async (event, context) => {
  const { id } = event.pathParameters;
  const { amount } = event.body;


  if (amount < 0) {
    throw new createHttpError.Forbidden(
      `Your pay amount cannot be less than 0. Your Amount: ${amount}`
    );
  }

  const invoice = await getInvoiceById(id);

  if (invoice.paidStatus = PAIDSTATUS.PAID) {
    throw new createHttpError.Forbidden(
      `You have paid this invoice`
    );
  }

  try {
    const updatedInvoice = await payInvoiceCommand(invoice, amount)
    await receiptMailer(invoice, amount)

    return {
      statusCode: 201,
      body: JSON.stringify(updatedInvoice),
    };

  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
}

export const handler = commonMiddleware(payInvoice);
