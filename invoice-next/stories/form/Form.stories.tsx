import { Box } from "@mui/material";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CreateInvoice from "./CreateInvoice";

/** Theme */

export default {
  component: CreateInvoice,
  title: "Form",
} as ComponentMeta<typeof CreateInvoice>;

const CreateInvoiceTemplate: ComponentStory<typeof CreateInvoice> = ({
  ...args
}) => (
  <Box flexDirection="column" bgcolor="white" padding={2}>
    <CreateInvoice {...args} />
  </Box>
);

export const CreateInvoiceForm = CreateInvoiceTemplate.bind({});
CreateInvoiceForm.args = {};
