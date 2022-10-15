import { CircularProgress, Divider, styled } from "@mui/material";
import CreateInvoice from "@stories/form/CreateInvoice";
import InvoicesList from "@stories/invoicesList/InvoicesList";
import type { NextPage } from "next";
import Layout from "../components/layout/Layout";
import { CreateInvoiceDto, InvoiceDto, PAIDSTATUS } from "../types/invoice";
import { getGroupedInvoices } from "libs/invoices";
import useSWR from "swr";
import useAddInvoice from "api/useAddInvoice";
import usePayInvoice from "api/usePayInvoice";
const SpacedDivider = styled(Divider)(({}) => ({
  marginTop: "1rem",
  marginBottom: "1rem",
}));

const spliceInvoice = (invoices: InvoiceDto[], invoice: InvoiceDto) =>
  invoices.map((i) => (i.id.includes(invoice.id) ? invoice : i));

const Invoices = () => {
  console.log("Invoicing");
  const {
    data: invoices,
    error,
    mutate,
  } = useSWR<InvoiceDto[]>("/invoices?status=UNPAID");

  const { mutate: addInvoice } = useAddInvoice();
  const { mutate: payInvoice } = usePayInvoice();
  if (error) {
    return <h1>An error has occured fetching the data {error.toString()}</h1>;
  }

  // TODO move all of this to useReducer
  const handleDelete = (invoiceId: string) => {
    alert(invoiceId);
  };
  const handlePay = async (invoiceId: string, amount: number, datePaid: Date) => {
    const newInvoices = (invoices || []).map((i) =>
      i.id.includes(invoiceId) ? { ...i, paidStatus: PAIDSTATUS.LOADING } : i
    );
    const options = {
      optimisticData: newInvoices,
      rollbackOnError: true,
      revalidate: true,
    };
    const f = async (invoices?: InvoiceDto[]) => {
      const newInvoice = await payInvoice(invoiceId, amount, datePaid);
      if (!newInvoice) {
        console.error("Unable to pay invoice");
        return invoices
      }
      return spliceInvoice(invoices || [], newInvoice);
    };
    mutate(f, options);
  };

  const handleSubmitInvoice = async (invoice: CreateInvoiceDto) => {
    const createdInvoice: InvoiceDto = {
      ...invoice,
      id: "pending",
      title: "creating",
      paidStatus: PAIDSTATUS.UNPAID,
      createdAt: new Date().toLocaleDateString(),
      paidBy: [],
    };
    const newInvoices = [...(invoices || []), createdInvoice];
    const options = {
      optimisticData: newInvoices,
      rollbackOnError: true,
      revalidate: true,
    };
    const f = async (invoices?: InvoiceDto[]) => {
      const newInvoice = await addInvoice(invoice);
      return [
        ...(invoices?.filter((i) => !i.id.includes("pending")) || []),
        ...(newInvoice ? [newInvoice] : []),
      ];
    };
    mutate(f, options);
  };
  return (
    <>
      <CreateInvoice onSubmit={handleSubmitInvoice} />
      <SpacedDivider />
      {invoices ? (
        <InvoicesList
          groupedInvoices={getGroupedInvoices(invoices)}
          onDelete={handleDelete}
          onReSend={() => alert("not yet implemented")}
          onEdit={() => alert("not yet implemented")}
          onPay={handlePay}
        />
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

// TODO kanban style paid |unpaid |overdue
const Home: NextPage = () => {
  return (
    <Layout title={"Invoicing - create"} useAuth={true}>
      <Invoices />
    </Layout>
  );
};

export default Home;
