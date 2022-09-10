import { AttachMoney } from "@mui/icons-material";
import { Box, Button, styled } from "@mui/material";
import FormikMuiTextInput from "@stories/form/FormikMuiTextInput";
import { Form, Formik } from "formik";
import * as Yup from "yup";
type PayInvoiceProps = {
  initialAmount: number;
  invoiceId: string;
  onSubmit: (invoiceId: string, amount: number) => Promise<void>;
};
const PayInvoice = ({
  invoiceId,
  initialAmount = 420,
  onSubmit,
}: PayInvoiceProps) => {
  const BoxFormInputWrapper = styled(Box)`
    display: flex;
    align-items: center;
    > div {
      margin-right: 1rem;
    }
  `;

  return (
    <Formik
      initialValues={{
        amount: initialAmount,
      }}
      validationSchema={Yup.object({
        amount: Yup.number().required("Required"),
      })}
      onSubmit={async (values: { amount: number }, { setSubmitting }) => {
        await onSubmit(invoiceId, values.amount);
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
