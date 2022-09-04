import { CircularProgress, Divider, styled } from "@mui/material";
import CreateInvoice from "@stories/form/CreateInvoice";
import InvoicesList from "@stories/invoicesList/InvoicesList";
import type { NextPage } from "next";
import Layout from "../components/layout/Layout";
import { CreateInvoiceDto, InvoiceDto, PAIDSTATUS } from "../types/invoice";
import { getGroupedInvoices } from "libs/invoices";
import useSWR from "swr";
import useAddInvoice from "api/useAddInvoice";
import { useAuth0 } from "@auth0/auth0-react";
const SpacedDivider = styled(Divider)(({}) => ({
  marginTop: "1rem",
  marginBottom: "1rem",
}));
// TODO kanban style paid unpaid overdue
const Home: NextPage = () => {
  
  const {
    data: invoices,
    error,
    mutate,
  } = useSWR<InvoiceDto[]>("/invoices?status=UNPAID");

  const { mutate: addInvoice } = useAddInvoice();
  if (error) {
    return <h1>An error has occured fetching the data {error.toString()}</h1>;
  }

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
    <Layout title={"Login"}>
      <CreateInvoice onSubmit={handleSubmitInvoice} />
      <SpacedDivider />
      {invoices ? (
        <InvoicesList groupedInvoices={getGroupedInvoices(invoices)} />
      ) : (
        <CircularProgress />
      )}
    </Layout>
  );
};

export default Home;
