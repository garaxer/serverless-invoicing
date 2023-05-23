import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import { InvoiceDto } from "../../types/invoice";
import InvoicesListItem from "./InvoicesListItem";
import {
  ActionHandler,
  InvoiceListState,
  PAID_STATUS,
  SearchInvoicesAction,
} from "hooks/useSearchInvoicesForm";

export type InvoicesListProps = {
  groupedInvoices: [string, InvoiceDto[]][];
  onDelete?: (invoiceId: string) => void | Promise<void>;
  onReSend?: (invoiceId: string) => void | Promise<void>;
  onEdit?: (invoiceId: string) => void | Promise<void>;
  onPay: (
    invoiceId: string,
    amount: number,
    datePaid: Date
  ) => Promise<void | unknown>;
  onActionHandler?: ActionHandler;
  invoiceListState?: InvoiceListState;
};
// Use this for the client facing list of invoices. Infinite scroll
//The table will be used for the month to month reciepts using virtualised scrolling.
// TODO wrap the CRUD and pay functions within context
const InvoicesList = ({
  groupedInvoices,
  onDelete,
  onReSend,
  onEdit,
  onPay,
  onActionHandler,
  invoiceListState,
}: InvoicesListProps) => {
  console.log("Using invoices list");
  const theme = useTheme();
  return (
    <>
      <FormGroup sx={{ flexDirection: "row" }}>
        <FormControlLabel
          control={
            <Switch
              checked={invoiceListState?.paidStatus === PAID_STATUS.PAID}
              onClick={() =>
                onActionHandler &&
                onActionHandler({
                  type: SearchInvoicesAction.SET_PAID_STATUS_FILTER,
                  data:
                    invoiceListState?.paidStatus === PAID_STATUS.PAID
                      ? PAID_STATUS.UNPAID
                      : PAID_STATUS.PAID,
                })
              }
            />
          }
          label="Show paid?"
        />
        <Button
          type="submit"
          size="small"
          onClick={() =>
            onActionHandler &&
            onActionHandler({
              type: SearchInvoicesAction.SEARCH_SUBMIT,
            })
          }
        >
          Search again
        </Button>
      </FormGroup>

      <Box>TODO date filter?</Box>
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
