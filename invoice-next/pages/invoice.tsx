import type { NextPage } from "next";
import Layout from "../components/layout/Layout";
import { withPageAuthRequired, useUser } from "@auth0/nextjs-auth0";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import useGetInvoicesNext from "api/useGetInvoicesNext";
import InvoicesList from "@stories/invoicesList/InvoicesList";
import { getGroupedInvoices } from "../libs/invoices";

const Invoice: NextPage = () => {
  const user = useUser();
  const {
    state: { data: invoices, error, isLoading },
    fetchData: getInvoices,
  } = useGetInvoicesNext();

  return (
    <Layout title={"Login"} useAuth={false}>
      <Typography sx={{ paddingBottom: 5 }}>
        You are viewing the invoices of {user.user?.email}
      </Typography>

      <Box>Your UNPAID invoices (TODO via serverside props)</Box>
      <Box>
        <Typography sx={{ paddingBottom: 5, paddingTop: 5 }}>
          Other information
        </Typography>
        <Button onClick={() => getInvoices()}>
          Click here to view all your PAID invoices.
        </Button>
        {error && <h1>error retrieving your invoices</h1>}
        {invoices && (
          <Paper>
            {!isLoading ? (
              <InvoicesList groupedInvoices={getGroupedInvoices(invoices)} />
            ) : (
              <CircularProgress />
            )}
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default Invoice;

export const getServerSideProps = withPageAuthRequired();
