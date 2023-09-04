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
import useSearchInvoicesForm from "hooks/useSearchInvoicesForm";
import { InvoiceControlProvider } from "hooks/useInvoiceControl";
import useDeleteInvoice from "api/useDeleteInvoice";
const SpacedDivider = styled(Divider)(({}) => ({
  marginTop: "1rem",
  marginBottom: "1rem",
}));


const Invoices = () => {
  console.log("Invoicing");
  const { invoiceUrl, onActionHandler, searchFormState } = useSearchInvoicesForm();
  const { data: invoices, error, mutate, isLoading, isValidating } = useSWR<InvoiceDto[]>(invoiceUrl);

  const { mutate: addInvoice } = useAddInvoice(); // If I want something to happen when there is an error I need to add a callback event
  const { mutate: payInvoice } = usePayInvoice();
  const { mutate: deleteInvoice } = useDeleteInvoice();
  if (error) {
    return <h1>An error has occured fetching the data {error.toString()}</h1>;
  }

  const handleDelete = async (invoiceId: string) => {
    const options = {
      optimisticData: invoices?.filter((i) => i.id !== invoiceId),
      rollbackOnError: true,
      revalidate: true,
      throwOnError: true,
    };
    mutate(deleteInvoice(invoiceId), options);
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
    const response = await payInvoice(invoiceId, amount, datePaid);

    mutate(newInvoices, options);

    return response;
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
    const optimisticNewInvoices = [...(invoices || []), createdInvoice];

    const newInvoice = await addInvoice(invoice);

    mutate(optimisticNewInvoices);
    return newInvoice;
  };
  return (
    <>
      <CreateInvoice onSubmit={handleSubmitInvoice} />
      <SpacedDivider />
      {invoices && !isLoading && !isValidating ? (
        <InvoiceControlProvider
          handleDelete={handleDelete}
          handleSubmit={onActionHandler}
          searchFormState={searchFormState}
        >
          <InvoicesList
            groupedInvoices={getGroupedInvoices(invoices)}
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
