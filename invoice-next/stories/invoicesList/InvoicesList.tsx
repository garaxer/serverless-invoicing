import { Box, Typography, useTheme } from "@mui/material";
import { InvoiceDto } from "../../types/invoice";
import InvoicesListItem from "./InvoicesListItem";

export type InvoicesListProps = {
  groupedInvoices: [string, InvoiceDto[]][];
};
// Use this for the client facing list of invoices. Infinite scroll
//The table will be used for the month to month reciepts using virtualised scrolling.
const InvoicesList = ({ groupedInvoices }: InvoicesListProps) => {
  const theme = useTheme();
  return (
    <>
      <Box>date select</Box>
      <Box>paid/unpaid checkbox unpaid by default</Box>
      {groupedInvoices.map(([group, invoices]) => (
        <div key={group}>
          <Typography marginTop={"2rem"} color={theme.palette.secondary.main}>
            {group}
          </Typography>
          {invoices.map((invoice) => (
            <div key={invoice.id}>
              <InvoicesListItem invoice={invoice} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default InvoicesList;
