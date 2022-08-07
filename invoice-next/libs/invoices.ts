import { format } from "date-fns";
import { InvoiceDto } from "types/invoice";

// Todo place this function in context and mock context in the story.
export const getGroupedInvoices = (invoices: InvoiceDto[]) => {
  return Object.entries(
    invoices.reduce((invoicesByDuedate, invoice) => {
      console.log({dueDate: invoice.dueDate});
      
      const dateMonth = format(new Date(invoice.dueDate), "MM/yyyy");
      return {
        ...invoicesByDuedate,
        [dateMonth]: [...(invoicesByDuedate[dateMonth] || []), invoice],
      };
    }, {} as { [key: string]: InvoiceDto[] })
  );
};
