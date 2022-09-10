import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { InvoiceDto } from "../../types/invoice";
import PayInvoice from "./PayInvoice";

export type InvoicesListItemProps = {
  invoice: InvoiceDto;
  onDelete?: (invoiceId: string) => void;
  onReSend?: (invoiceId: string) => void;
  onEdit?: (invoiceId: string) => void;
  onPay: (invoiceId: string, amount: number) => Promise<void>;
};
// Good example in mui divider
const InvoicesListItem = ({
  invoice,
  onDelete,
  onReSend,
  onEdit,
  onPay,
  ...props
}: InvoicesListItemProps) => {
  return (
    <Card sx={{ marginBottom: "1rem" }} {...props}>
      <CardContent>
        <Typography variant="h5" color="text.primary">
          {invoice.title}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Due: {format(new Date(invoice.dueDate), "dd/MM/yyyy")}
        </Typography>
        <Box sx ={{display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" component="div">
            {invoice.paidStatus}
          </Typography>
          <PayInvoice initialAmount={0} invoiceId={invoice.id} onSubmit={onPay} />
        </Box>
        {invoice.serviceStartDate && invoice.serviceEndDate && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            Period: {format(new Date(invoice.serviceStartDate), "dd/MM/yyyy")} -{" "}
            {format(new Date(invoice.serviceEndDate), "dd/MM/yyyy")}
          </Typography>
        )}
      </CardContent>
      <Divider />
      <CardActions>
        <Box display="flex" justifyContent="space-between" width={"100%"}>
          <Box>
            <Typography>
              {invoice.reminderSentDate
                ? `Email last sent: ${format(
                    new Date(invoice.reminderSentDate),
                    "dd/MM/yyyy"
                  )}`
                : "Email not yet sent"}
            </Typography>
          </Box>

          <Box>
            {onEdit && (
              <Button size="small" onClick={() => onEdit(invoice.id)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button size="small" onClick={() => onDelete(invoice.id)}>
                Delete
              </Button>
            )}
            {onReSend && (
              <Button size="small" onClick={() => onReSend(invoice.id)}>
                Resend
              </Button>
            )}
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default InvoicesListItem;
