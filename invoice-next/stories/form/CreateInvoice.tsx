import { Form, Formik, FormikProps } from "formik";
import FormikMuiTextInput from "./FormikMuiTextInput";
import * as Yup from "yup";
import { createTheme } from "@mui/material/styles";
import { Button, Box, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CreateInvoiceDto, InvoiceDto } from "../../types/invoice";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AttachMoney from "@mui/icons-material/AttachMoney";
import FormikDateInput from "./FormikDateInput";
import { subDays } from "date-fns";
import FormikMuiCheckBox from "./FormikMuiCheckBox";

type CreateInvoiceProps = {
  onSubmit: (invoice: CreateInvoiceDto) => Promise<InvoiceDto | undefined>;
};
const CreateInvoice = ({ onSubmit }: CreateInvoiceProps) => {
  const theme = createTheme({
    palette: {
      background: {
        paper: "#e5e5e5",
      },
      primary: {
        main: "#d0652b",
      },
      secondary: {
        main: "#e65400",
      },
    },
  });

  const BoxFormRow = styled(Box)`
    flex-wrap: wrap;
    display: flex;
  `;
  const BoxFormInputWrapper = styled(Box)`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    margin-right: 1rem;
    &:last-child {
      margin-right: 0rem;
    }
  `;
  const populateValues = (formik: FormikProps<CreateInvoiceDto>) => {
    const dueDate = formik?.values?.dueDate
      ? new Date(formik.values.dueDate)
      : new Date();
    formik.setFieldValue(
      "title",
      `Unit 12/130 Jutland st. Invoice for ${subDays(
        dueDate,
        8
      ).toLocaleDateString()} - ${subDays(dueDate, 1).toLocaleDateString()}`
    );
    formik.setFieldValue("serviceEndDate", subDays(dueDate, 1).toISOString());
    formik.setFieldValue("serviceStartDate", subDays(dueDate, 7).toISOString());
  };
  // will be Due date, populate fields button which gets the rest, defaults can be in a json format.
  // When you hit submit, it populates it with next default. based of the last.
  // List of invoices in table like form, with edit popup and delete button.
  // Don't populate sent date, the daily cron job should pick it up and send it out.
  return (
    <Formik
      initialValues={{
        title: `Unit 12/130 Jutland st. Invoice for ${subDays(
          new Date(),
          7
        ).toLocaleDateString()} - ${subDays(
          new Date(),
          1
        ).toLocaleDateString()}`,
        recipientName: "Stewart/Patty",
        dueDate: new Date().toISOString(),
        amount: 480,
        recipientEmail: "gbagnall8@gmail.com",
        serviceEndDate: subDays(new Date(), 1).toISOString(),
        serviceStartDate: subDays(new Date(), 7).toISOString(),
        sendEmail: false,
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(100, "Must be 100 characters or less")
          .required("Required"),
        dueDate: Yup.date().required("Required"),
      })}
      onSubmit={async (values: CreateInvoiceDto, { setSubmitting }) => {
        await onSubmit(values);
        setSubmitting(false);

        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2));
        //   setSubmitting(false);
        // }, 400);
      }}
    >
      {(formik) => (
        <Form>
          <BoxFormRow>
            <BoxFormInputWrapper>
              <CalendarMonth fontSize="large" color="primary" />
              <FormikDateInput name={"dueDate"} label="Due date" />
            </BoxFormInputWrapper>
            <BoxFormInputWrapper>
              <Button
                variant="contained"
                onClick={() => populateValues(formik)}
              >
                Populate using due date
              </Button>
            </BoxFormInputWrapper>
            <BoxFormInputWrapper flexGrow={1}>
              <ArticleIcon fontSize="large" color="primary" />
              <FormikMuiTextInput
                name="recipientEmail"
                placeholder={"Recipient Email"}
                label={"Email"}
                type={"text"}
                fullWidth
              />
            </BoxFormInputWrapper>
          </BoxFormRow>
          <BoxFormRow>
            <BoxFormInputWrapper flexGrow={1}>
              <ArticleIcon fontSize="large" color="primary" />
              <FormikMuiTextInput
                name="title"
                placeholder={"Title of invoice"}
                label={"Title"}
                type={"text"}
                fullWidth
              />
            </BoxFormInputWrapper>
            <BoxFormInputWrapper flexGrow={0.5}>
              <ArticleIcon fontSize="large" color="primary" />
              <FormikMuiTextInput
                name="recipientName"
                placeholder={"Name of recipient"}
                label={"Name"}
                type={"text"}
              />
            </BoxFormInputWrapper>
          </BoxFormRow>
          <BoxFormRow>
            <BoxFormInputWrapper>
              <CalendarMonth fontSize="large" color="primary" />
              <FormikDateInput
                name={"serviceStartDate"}
                label="From date"
                sx={{ marginRight: "1rem" }}
              />
              <FormikDateInput name={"serviceEndDate"} label="To date" />
            </BoxFormInputWrapper>
            <BoxFormInputWrapper>
              <AttachMoney fontSize="large" color="primary" />
              <FormikMuiTextInput
                name="amount"
                label={"Weekly rent"}
                type="number"
                fullWidth
              />
            </BoxFormInputWrapper>
            <BoxFormInputWrapper>
              <FormControlLabel
                control={<FormikMuiCheckBox name="sendEmail" />}
                label="Send Email?"
              />
            </BoxFormInputWrapper>
          </BoxFormRow>
          <BoxFormRow>
            <Button
              disabled={formik.isSubmitting}
              type="submit"
              variant="contained"
              fullWidth
            >
              Submit
            </Button>
          </BoxFormRow>
        </Form>
      )}
    </Formik>
  );
};

export default CreateInvoice;
