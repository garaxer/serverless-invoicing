import { Form, Formik } from "formik";
import FormikMuiTextInput from "./FormikMuiTextInput";
import * as Yup from "yup";
import { createTheme } from "@mui/material/styles";
import { Button } from "@mui/material";
import { CreateInvoiceDto } from "../../types/invoice";
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

  return (
    <Formik
      initialValues={{
        title: "",
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
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
          <FormikMuiTextInput
            name="title"
            placeholder={"placeholder"}
            label={"label"}
            type={"text"}
          />
          <Button disabled={formik.isSubmitting} type="submit">
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default CreateInvoice;
