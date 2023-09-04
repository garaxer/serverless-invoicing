import { useField } from "formik";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";

export type FormikMuiCheckBoxProps = CheckboxProps & {
  name: string;
};

export default function FormikMuiCheckBox(props: FormikMuiCheckBoxProps) {
  const [field, meta] = useField(props.name);
  return (
    <>
      <Checkbox
        data-testid={`checkbox-${props.name}`}
        {...props}
        {...field}
        checked={field.value}
      />
      {!!(meta.touched && meta.error)}
    </>
  );
}
