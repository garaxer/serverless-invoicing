import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import enLocale from "date-fns/locale/en-AU";
import { useField } from "formik";
export interface FormikDateInputProps {
  placeholder: string;
  name: string;
  label?: string;
  initialDate?: Date;
}

const FormikDateInput = ({
  initialDate = new Date(),
  ...props
}: FormikDateInputProps) => {
  const [value, setValue] = React.useState<Date | null>(initialDate);
  const [field, meta, helper] = useField(props.name);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <DatePicker
        value={value}
        onChange={(newValue) => {
          helper.setTouched(true);
          helper.setValue(newValue?.toISOString())
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
