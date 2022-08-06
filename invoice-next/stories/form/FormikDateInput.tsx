import { useEffect, useState } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import enLocale from "date-fns/locale/en-AU";
import { useField } from "formik";

export type FormikDateInputProps = TextFieldProps & {
  name: string;
  label?: string;
};

const FormikDateInput = ({ ...props }: FormikDateInputProps) => {
  const [field, meta, helper] = useField(props.name);
  const [value, setValue] = useState<Date | null>(field.value);

  useEffect(() => {
    setValue(field.value);
  }, [field.value, setValue]);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <DatePicker
        value={value}
        onChange={(newValue) => {
          helper.setTouched(true);
          helper.setValue(newValue?.toISOString());
          setValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            data-testid={`dateTextfield-${props.name}`}
            {...params}
            error={!!(meta.touched && meta.error)}
            helperText={meta.error}
            {...field}
            {...props}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default FormikDateInput;
