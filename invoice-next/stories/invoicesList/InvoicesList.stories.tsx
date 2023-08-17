import { StoryFn, Meta } from "@storybook/react";
import { InvoiceDto, PAIDSTATUS } from "../../types/invoice";
import InvoicesList from "./InvoicesList";
import { v4 as uuid } from "uuid";
import { Box } from "@mui/material";
import { getGroupedInvoices } from "../../libs/invoices";
import { InvoiceControlProvider } from "hooks/useInvoiceControl";

const invoices: InvoiceDto[] = [
  {
    id: uuid(),
    title: "Unit 12/130 Jutland st. Invoice for 24/07/2022 - 30/07/2022",
    paidStatus: PAIDSTATUS.UNPAID,
    createdAt: new Date().toISOString(),
    amount: 420,
    dueDate: new Date("2022/07/31").toISOString(),
    recipientEmail: "gbagnall8@gmail.com",
    recipientName: "Stewart",
    paidBy: [{ amount: 20, datePaid: new Date().toISOString() }],
    serviceStartDate: new Date("2022/07/24").toISOString(),
    serviceEndDate: new Date("2022/07/30").toISOString(),
  },
  {
    id: uuid(),
    title: "Unit 12/130 Jutland st. Invoice for 31/07/2022 - 06/08/2022",
    paidStatus: PAIDSTATUS.UNPAID,
    createdAt: new Date().toISOString(),
    amount: 420,
    dueDate: new Date("2022/08/07").toISOString(),
    recipientEmail: "gbagnall8@gmail.com",
    recipientName: "Stewart",
    paidBy: [{ amount: 20, datePaid: new Date().toISOString() }],
    serviceStartDate: new Date("2022/07/31").toISOString(),
    serviceEndDate: new Date("2022/08/06").toISOString(),
  },
  {
    id: uuid(),
    title: "Unit 12/130 Jutland st. Invoice for 07/08/2022 - 13/08/2022",
    paidStatus: PAIDSTATUS.UNPAID,
    createdAt: new Date().toISOString(),
    amount: 420,
    dueDate: new Date("2022/08/14").toISOString(),
    recipientEmail: "gbagnall8@gmail.com",
    recipientName: "Stewart",
    paidBy: [],
    serviceStartDate: new Date("2022/08/07").toISOString(),
    serviceEndDate: new Date("2022/08/13").toISOString(),
  },
  {
    id: uuid(),
    title: "Unit 12/130 Jutland st. Invoice for 14/08/2022 - 20/08/2022",
    paidStatus: PAIDSTATUS.UNPAID,
    createdAt: new Date().toISOString(),
    amount: 420,
    dueDate: new Date("2022/08/21").toISOString(),
    recipientEmail: "gbagnall8@gmail.com",
    recipientName: "Stewart",
    paidBy: [],
    serviceStartDate: new Date("2022/08/14").toISOString(),
    serviceEndDate: new Date("2022/08/20").toISOString(),
  },
  {
    id: uuid(),
    title: "Unit 12/130 Jutland st. Invoice for 21/08/2022 - 27/08/2022",
    paidStatus: PAIDSTATUS.UNPAID,
    createdAt: new Date().toISOString(),
    amount: 420,
    dueDate: new Date("2022/08/28").toISOString(),
    recipientEmail: "gbagnall8@gmail.com",
    recipientName: "Stewart",
    paidBy: [],
    serviceStartDate: new Date("2022/08/21").toISOString(),
    serviceEndDate: new Date("2022/08/27").toISOString(),
  },
  {
    id: uuid(),
    title: "Unit 12/130 Jutland st. Invoice for 28/07/2022 - 03/08/2022",
    paidStatus: PAIDSTATUS.UNPAID,
    createdAt: new Date().toISOString(),
    amount: 420,
    dueDate: new Date("2022/09/04").toISOString(),
    recipientEmail: "gbagnall8@gmail.com",
    recipientName: "Stewart",
    paidBy: [],
    serviceStartDate: new Date("2022/08/28").toISOString(),
    serviceEndDate: new Date("2022/09/03").toISOString(),
  },
];

export default {
  component: InvoicesList,
  title: "InvoiceList",
} as Meta<typeof InvoicesList>;

const InvoicesListTemplate: StoryFn<typeof InvoicesList> = ({
  ...args
}) => (
  <Box flexDirection="column" bgcolor="#eaeaea" padding={2} color="black">
    <InvoiceControlProvider
      handleDelete={() => Promise.resolve(console.log("deleted"))}
      handleSubmit={(action) => console.log(action)}
    >
      <InvoicesList {...args} />{" "}
    </InvoiceControlProvider>
  </Box>
);

export const InvoicesListForm = InvoicesListTemplate.bind({});
InvoicesListForm.args = {
  groupedInvoices: getGroupedInvoices(invoices),
};
