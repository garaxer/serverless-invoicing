import { Form, Formik, FormikProps } from "formik";
import FormikMuiTextInput from "./FormikMuiTextInput";
import * as Yup from "yup";
import { createTheme } from "@mui/material/styles";
import { Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CreateInvoiceDto } from "../../types/invoice";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import AttachMoney from "@mui/icons-material/AttachMoney";
import FormikDateInput from "./FormikDateInput";

type CreateInvoiceProps = {
  onSubmit: (invoice: CreateInvoiceDto) => void;
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
      `Unit 12/130 Jutland st. Invoice for ${new Date(
        new Date().setDate(dueDate.getDate() - 7)
      ).toLocaleDateString()} - ${new Date(
        new Date().setDate(dueDate.getDate() - 1)
      ).toLocaleDateString()}`
    );
    formik.setFieldValue(
      "serviceEndDate",
      new Date(new Date().setDate(dueDate.getDate() - 1)).toISOString()
    );
    formik.setFieldValue(
      "serviceStartDate",
      new Date(new Date().setDate(dueDate.getDate() - 7)).toISOString()
    );
  };
  // will be Due date, populate fields button which gets the rest, defaults can be in a json format.
  // When you hit submit, it populates it with next default. based of the last.
  // List of invoices in table like form, with edit popup and delete button.
  // Don't populate sent date, the daily cron job should pick it up and send it out.
  return (
    <Formik
      initialValues={{
        title: `Unit 12/130 Jutland st. Invoice for ${new Date(
          new Date().setDate(new Date().getDate() - 7)
        ).toLocaleDateString()} - ${new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).toLocaleDateString()}`,
        dueDate: new Date().toISOString(),
        amount: 420,
        recipientEmail: "gbagnall8@gmail.com",
        serviceEndDate: new Date(
          new Date().setDate(new Date().getDate() - 1)
        ).toISOString(),
        serviceStartDate: new Date(
          new Date().setDate(new Date().getDate() - 7)
        ).toISOString(),
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(100, "Must be 100 characters or less")
          .required("Required"),
        dueDate: Yup.date().required("Required"),
      })}
      onSubmit={(values: CreateInvoiceDto, { setSubmitting }) => {

        onSubmit(values);

        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {(formik) => (
        <Form>
          <Box flexDirection="column" bgcolor="white" padding={2}>
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
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default CreateInvoice;
