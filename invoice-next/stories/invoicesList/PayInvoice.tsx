import { AttachMoney } from "@mui/icons-material";
import { Box, Button, styled } from "@mui/material";
import FormikDateInput from "@stories/form/FormikDateInput";
import FormikMuiTextInput from "@stories/form/FormikMuiTextInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";
type PayInvoiceProps = {
  initialAmount: number;
  invoiceId: string;
  onSubmit: (invoiceId: string, amount: number, datePaid: Date) => Promise<void>;
};
const PayInvoice = ({
  invoiceId,
  initialAmount = 420,
  onSubmit,
}: PayInvoiceProps) => {
  const BoxFormInputWrapper = styled(Box)`
    display: flex;
    align-items: center;
    padding: 1rem 0 1rem 0;
    > div {
      margin-right: 1rem;
    }
  `;

  return (
    <Formik
      initialValues={{
        amount: initialAmount,
        datePaid: new Date().toISOString(),
      }}
      validationSchema={Yup.object({
        amount: Yup.number().required("Required"),
      })}
      onSubmit={async (values: { amount: number, datePaid: string }, { setSubmitting }) => {
        console.log(values)
        await onSubmit(invoiceId, values.amount, new Date(values.datePaid));
        setSubmitting(false);
      }}
    >
      {(formik) => (
        <Form>
          <BoxFormInputWrapper>
            <AttachMoney fontSize="large" color="primary" />
            <FormikMuiTextInput
              name="amount"
              label={"Pay amount"}
              type="number"
            />
            <FormikDateInput name="datePaid" label="Date paid" />
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              variant="contained"
            >
              Pay
            </Button>
          </BoxFormInputWrapper>
        </Form>
      )}
    </Formik>
  );
};

export default PayInvoice;
