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
import { isOfTypeInvoiceDto } from "api";
import useSearchInvoicesForm from "hooks/useSearchInvoicesForm";
import { InvoiceControlProvider } from "hooks/useInvoiceControl";
import useDeleteInvoice from "api/useDeleteInvoice";
const SpacedDivider = styled(Divider)(({}) => ({
  marginTop: "1rem",
  marginBottom: "1rem",
}));

const spliceInvoice = (invoices: InvoiceDto[], invoice: InvoiceDto) =>
  invoices.map((i) => (i.id.includes(invoice.id) ? invoice : i));

const Invoices = () => {
  console.log("Invoicing");
  const { invoiceUrl, onActionHandler } = useSearchInvoicesForm();
  const { data: invoices, error, mutate } = useSWR<InvoiceDto[]>(invoiceUrl);

  const { mutate: addInvoice } = useAddInvoice(); // If I want something to happen when there is an error I need to add a callback event
  const { mutate: payInvoice } = usePayInvoice();
  const { mutate: deleteInvoice } = useDeleteInvoice();
  if (error) {
    return <h1>An error has occured fetching the data {error.toString()}</h1>;
  }

  const handleDelete = (invoiceId: string) => {
    deleteInvoice(invoiceId);
    mutate(invoices?.filter(i => i.id !== invoiceId));
  };
  const handlePay = async (
    invoiceId: string,
    amount: number,
    datePaid: Date
  ) => {
    const newInvoices = (invoices || []).map((i) =>
      i.id.includes(invoiceId) ? { ...i, paidStatus: PAIDSTATUS.LOADING } : i
    );

    const options = {
      optimisticData: newInvoices,
      rollbackOnError: true,
      revalidate: true,
      throwOnError: true,
    };
    const newInvoiceP = payInvoice(invoiceId, amount, datePaid);

    const callPayInvoice = async (invoices?: InvoiceDto[]) => {
      const newInvoice = await newInvoiceP; // TODO doesn't look good to await twice
      if (!newInvoice || !isOfTypeInvoiceDto(newInvoice)) {
        console.info("Unable to pay invoice");
        return invoices; // TODO can just throw an error here
      }
      return spliceInvoice(invoices || [], newInvoice);
    };
    mutate(callPayInvoice, options); // mutate just returns the new list, from useSWR, if it throws an error, it will throw it at the config level.

    const newInvoice = await newInvoiceP;
    return newInvoice; // TODO to return back to formik
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
        <InvoiceControlProvider
          handleDelete={handleDelete}
          handleSubmit={onActionHandler}
        >
          <InvoicesList
            groupedInvoices={getGroupedInvoices(invoices)}
            onDelete={handleDelete}
            onReSend={() => alert("not yet implemented")}
            onEdit={() => alert("not yet implemented")}
            onPay={handlePay}
          />
        </InvoiceControlProvider>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

// TODO kanban style paid | unpaid | overdue or use tabs
const Home: NextPage = () => {
  return (
    <Layout title={"Invoicing - create"} useAuth={true}>
      <Invoices />
    </Layout>
  );
};

export default Home;
