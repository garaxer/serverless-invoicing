import { ComponentStory, ComponentMeta } from "@storybook/react";
import CreateInvoice from "./CreateInvoice";

/** Theme */

export default {
  component: CreateInvoice,
  title: "Form",
} as ComponentMeta<typeof CreateInvoice>;

const CreateInvoiceTemplate: ComponentStory<typeof CreateInvoice> = ({
  ...args
}) => <CreateInvoice {...args} />;

export const CreateInvoiceForm = CreateInvoiceTemplate.bind({});
CreateInvoiceForm.args = {};
