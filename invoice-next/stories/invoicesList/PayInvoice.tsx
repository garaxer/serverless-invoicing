import { AttachMoney } from "@mui/icons-material";
import { Box, Button, FormControlLabel, styled } from "@mui/material";
import FormikDateInput from "@stories/form/FormikDateInput";
import FormikMuiCheckBox from "@stories/form/FormikMuiCheckBox";
import FormikMuiTextInput from "@stories/form/FormikMuiTextInput";
import {
  isOfTypeUsePayInvoiceErrorResponse,
  UsePayInvoiceErrorResponse,
} from "api/usePayInvoice";
import { Form, Formik } from "formik";
import * as Yup from "yup";
type PayInvoiceProps = {
  initialAmount: number;
  invoiceId: string;
  onSubmit: (
    invoiceId: string,
    amount: number,
    datePaid: Date
  ) => Promise<void | unknown | UsePayInvoiceErrorResponse>;
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
        sendEmail: true,
      }}
      validationSchema={Yup.object({
        amount: Yup.number().required("Required"),
      })}
      onSubmit={async (
        values: { amount: number; datePaid: string },
        { setSubmitting, setErrors }
      ) => {
        const response = await onSubmit(
          invoiceId,
          values.amount,
          new Date(values.datePaid)
        );
        if (isOfTypeUsePayInvoiceErrorResponse(response)) {
          // TODO add switch here for known errors. Start returning typed error codes to the front end via swagger or something
          setErrors({ amount: response.error.info });
        }
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
            <FormControlLabel
              sx={{ marginLeft: "1rem" }}
              control={<FormikMuiCheckBox name="sendEmail" />}
              label=" Send Email?"
            />
          </BoxFormInputWrapper>
        </Form>
      )}
    </Formik>
  );
};

export default PayInvoice;
