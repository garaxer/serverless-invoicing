import { Context, APIGatewayEvent } from "aws-lambda";
import { getOverdueInvoices } from "@libs/overdueInvoicesQuery";
import { invoiceMailer } from "@libs/invoiceMailer";
import * as createHttpError from "http-errors";

const remindInvoice = async (_event: APIGatewayEvent, _context: Context) => {
  try {
    const invoicesOverdue = await getOverdueInvoices();
    console.log({ invoicesOverdue });
    const closePromises = invoicesOverdue.map((invoice) =>
      invoiceMailer(invoice)
    );
    await Promise.all(closePromises);
    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
};

export const handler = remindInvoice;
