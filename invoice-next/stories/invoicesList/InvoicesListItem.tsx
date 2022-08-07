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

export type InvoicesListItemProps = {
  invoice: InvoiceDto;
};
// Good example in mui divider
const InvoicesListItem = ({ invoice, ...props }: InvoicesListItemProps) => {
  return (
    <Card sx={{ marginBottom: "1rem" }} {...props}>
      <CardContent>
        <Typography variant="h5" color="text.primary">
          {invoice.title}
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Due: {format(new Date(invoice.dueDate), "dd/MM/yyyy")}
        </Typography>
        <Typography variant="h5" component="div">
          {invoice.paidStatus}
        </Typography>
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
            <Button size="small">Edit</Button>
            <Button size="small">Delete</Button>
            <Button size="small">Resend</Button>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default InvoicesListItem;
