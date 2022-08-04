import { Form, Formik } from "formik";
import FormikMuiTextInput from "./FormikMuiTextInput";
import * as Yup from "yup";
import { createTheme } from "@mui/material/styles";
import { Button, Box, Grid } from "@mui/material";
import { CreateInvoiceDto } from "../../types/invoice";
import ArticleIcon from "@mui/icons-material/Article";
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

  return (
    <Formik
      initialValues={{
        title: "",
        dueDate: new Date().toISOString()
      }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        dueDate: Yup.date()
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
          <Grid container spacing={2} padding={2} bgcolor="white">
            <Grid item xs={12}>
              <Box alignItems="center" display="flex">
                <ArticleIcon fontSize="large" color="primary" />
                <FormikMuiTextInput
                  name="title"
                  placeholder={"Title of invoice"}
                  label={"Title"}
                  type={"text"}
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid item>
              <FormikDateInput placeholder={new Date().toISOString()} name={"dueDate"} label="Due date" />
            </Grid>
            <Grid item xs={12} justifyContent="right" display="flex">
            <Button disabled={formik.isSubmitting} type="submit" variant="contained" fullWidth>
              Submit
            </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default CreateInvoice;
