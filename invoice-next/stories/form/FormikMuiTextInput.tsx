import { useField } from "formik";
import TextField, { TextFieldProps } from "@mui/material/TextField";

export type FormikMuiTextInputProps = TextFieldProps & {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
};

export default function FormikMuiTextInput(props: FormikMuiTextInputProps) {
  const [field, meta] = useField(props.name);
  return (
    <TextField
      data-testid={`textfield-${props.name}`}
      {...field}
      {...props}
      error={!!(meta.touched && meta.error)}
      helperText={meta.error}
    />
  );
}
