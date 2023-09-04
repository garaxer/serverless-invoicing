import type { NextPage } from "next";
import Layout from "../components/layout/Layout";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
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
import { InvoiceDto, PAIDSTATUS } from "types/invoice";
import api from "api";
// TODO make this a viewable only list.
type InvoiceProps = {
  invoices?: InvoiceDto[];
};

const Invoice: NextPage = ({ invoices: unpaidInvoices }: InvoiceProps) => {
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

      <Box>
        Your UNPAID invoices
        <Paper>
          {unpaidInvoices ? (
            <InvoicesList
              groupedInvoices={getGroupedInvoices(unpaidInvoices)}
              onReSend={() => alert("not yet implemented")}
              onEdit={() => alert("not yet implemented")}
              onPay={async () => alert("not yet implemented")}
            />
          ) : (
            <CircularProgress />
          )}
        </Paper>
      </Box>
      <Box>
        <Typography sx={{ paddingBottom: 5, paddingTop: 5 }}>
          Other information
        </Typography>
        <Button onClick={() => getInvoices()}>
          Click here to view all your PAID invoices.
        </Button>
        <Paper sx={{ padding: 2 }}>
          {error && <h1>error retrieving your invoices</h1>}
          {!isLoading ? (
            invoices && (
              <InvoicesList
                groupedInvoices={getGroupedInvoices(invoices)}
                onDelete={() => alert("not yet implemented")}
                onReSend={() => alert("not yet implemented")}
                onEdit={() => alert("not yet implemented")}
                onPay={async () => alert("not yet implemented")}
              />
            )
          ) : (
            <CircularProgress />
          )}
        </Paper>
      </Box>
    </Layout>
  );
};

export default Invoice;

// https://auth0.github.io/nextjs-auth0/modules/helpers_with_page_auth_required.html#withpageauthrequired
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const { req, res } = context;
    const s = await getSession(req, res);
    let invoices: InvoiceDto[] = [];

    if (!s?.idToken) {
      console.error("Failed to get token");
      return {
        props: { invoices },
      };
    }
    try {
      invoices = await api.Invoices(s?.idToken).list(PAIDSTATUS.UNPAID);
      console.log("success at retrieving invoices");
      console.log("Retrieved invoices count: " + invoices.length);
    } catch (error: any) {
      console.error({ error });
    }

    console.log(invoices);

    return {
      props: { invoices },
    };
  },
});
