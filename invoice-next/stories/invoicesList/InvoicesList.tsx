import { Box, Typography, useTheme } from "@mui/material";
import { InvoiceDto } from "../../types/invoice";
import InvoicesListItem from "./InvoicesListItem";

export type InvoicesListProps = {
  groupedInvoices: [string, InvoiceDto[]][];
  onDelete?: (invoiceId: string) => void | Promise<void>;
  onReSend?: (invoiceId: string) => void | Promise<void>;
  onEdit?: (invoiceId: string) => void | Promise<void>;
  onPay: (invoiceId: string, amount: number, datePaid: Date) => Promise<void | unknown>;
};
// Use this for the client facing list of invoices. Infinite scroll
//The table will be used for the month to month reciepts using virtualised scrolling.
// TODO wrap the CRUD and pay functions within context
const InvoicesList = ({
  groupedInvoices,
  onDelete,
  onReSend,
  onEdit,
  onPay
}: InvoicesListProps) => {
  console.log("Using invoices list");
  const theme = useTheme();
  return (
    <>
      <Box>TODO date select</Box>
      <Box>TODO paid/unpaid checkbox (unpaid by default)</Box>
      {groupedInvoices.map(([group, invoices]) => (
        <div key={group}>
          <Typography marginTop={"2rem"} color={theme.palette.secondary.main}>
            {group}
          </Typography>
          {invoices.map((invoice) => (
            <div key={invoice.id}>
              <InvoicesListItem
                invoice={invoice}
                onDelete={onDelete}
                onReSend={onReSend}
                onEdit={onEdit}
                onPay={onPay}
              />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default InvoicesList;
