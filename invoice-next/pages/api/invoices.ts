// pages/api/services.js
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import api from "api";
import { InvoiceDto, PAIDSTATUS } from "types/invoice";

export default withApiAuthRequired(async function services(req, res) {
  // If your Access Token is expired and you have a Refresh Token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant

  const s = getSession(req, res);
  if (!s?.idToken) {
    console.error("Failed to get token");
    return res.status(401).json({ error: "Not logged in, not token found" });
  }
  console.log("Got token");
  const query = req.query;
  const { status } = query;
  let invoices: InvoiceDto[];
  try {
    invoices = await api.Invoices(s?.idToken).list(status as PAIDSTATUS);
    console.log("success at retrieving invoices");
    console.log("Retrieved invoices count: " + invoices.length);
  } catch (error: any) {
    return res
      .status(401)
      .json({ error: `Something went wrong calling the api ${error.message}` });
  }

  console.log(invoices);

  res.status(200).json(invoices);
});
