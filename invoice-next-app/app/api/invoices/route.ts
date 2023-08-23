// pages/api/services.js
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { InvoiceDto, PAIDSTATUS } from "types/invoice";
import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import api from "@/api";

export default withApiAuthRequired(async function handler(req: NextApiRequest) {
  // If your Access Token is expired and you have a Refresh Token
  // `getAccessToken` will fetch you a new one using the `refresh_token` grant

  const s = await getSession();
  if (!s?.idToken) {
    console.error("Failed to get token");
    return NextResponse.json(
      { error: "Not logged in, not token found" },
      { status: 401 }
    );
  }
  console.log("Got token");
  console.log({ req });
  const query = req.query;
  const status = query?.status;
  let invoices: InvoiceDto[];
  try {
    invoices = await api.Invoices(s?.idToken).list(status as PAIDSTATUS);
    console.log("success at retrieving invoices");
    console.log("Retrieved invoices count: " + invoices.length);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Something went wrong calling the api ${error.message}` },
      { status: 401 }
    );
  }

  console.log(invoices);

  NextResponse.json(invoices);
});
