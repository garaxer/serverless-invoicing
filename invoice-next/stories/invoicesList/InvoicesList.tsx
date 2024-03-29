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
  PAID_STATUS,
  initialSearchInvoiceState,
} from "hooks/useSearchInvoicesForm";
import { CalendarMonth } from "@mui/icons-material";
import FormikDateInput from "@stories/form/FormikDateInput";
import { useInvoiceControl } from "hooks/useInvoiceControl";
import { Formik } from "formik";
import { OnPayProps } from "api/usePayInvoice";

export type InvoicesListProps = {
  groupedInvoices: [string, InvoiceDto[]][];
  onReSend?: (invoiceId: string) => void | Promise<void>;
  onEdit?: (invoiceId: string) => void | Promise<void>;
  onPay: (props: OnPayProps) => Promise<void | unknown>;
};
// Use this for the client facing list of invoices. TODO Infinite scroll
// The table will be used for the month to month reciepts using virtualised scrolling.
// TODO wrap the CRUD and pay functions within context
const InvoicesList = ({
  groupedInvoices,
  onReSend,
  onEdit,
  onPay,
}: InvoicesListProps) => {
  const { handleSubmit, handleDelete, searchFormState } = useInvoiceControl();
  const theme = useTheme();
  return (
    <>
      <Formik
        initialValues={{ ...initialSearchInvoiceState, ...searchFormState }}
        onSubmit={(values, _formikHelpers) => {
          handleSubmit(values);
        }}
      >
        {(formik) => (
          <FormGroup sx={{ flexDirection: "row" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formik.values.paidStatus === PAID_STATUS.PAID}
                  onClick={() =>
                    formik.setFieldValue(
                      "paidStatus",
                      formik.values.paidStatus === PAID_STATUS.PAID
                        ? PAID_STATUS.UNPAID
                        : PAID_STATUS.PAID
                    )
                  }
                />
              }
              label="Show paid?"
            />

            <Box>
              <CalendarMonth fontSize="large" color="primary" />
              <FormikDateInput
                name={"dueAfterDate"}
                label="Invoice dates after"
                sx={{ marginRight: "1rem" }}
              />
            </Box>

            <Button
              type="submit"
              size="small"
              onClick={() => formik.submitForm()}
            >
              Search again
            </Button>
          </FormGroup>
        )}
      </Formik>

      {groupedInvoices.map(([group, invoices]) => (
        <div key={group}>
          <Typography marginTop={"2rem"} color={theme.palette.secondary.main}>
            {group}
          </Typography>
          {invoices.map((invoice) => (
            <div key={invoice.id}>
              <InvoicesListItem
                invoice={invoice}
                onDelete={handleDelete}
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
