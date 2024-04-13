import { getSession } from "@auth0/nextjs-auth0";
import { InvoiceDto } from "../_types/invoice";
import { Invoices } from "./invoices";
import { BASE_URL } from "./config";

export default async function Index() {
  const s = await getSession();

  if (!s) {
    return <p>Please login to view invoices</p>;
  }
  const data = await fetch(`${BASE_URL}/dev/invoices?status=PAID`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${s?.idToken}`,
    },
  }).then((res) => res.json());

  // const invoicesData = await fetch("http://localhost:3000/api/invoices");
  // const invoices: InvoiceDto[] & { error: any } = await invoicesData.json();
  // console.log(invoices);
  // if (!invoices || invoices?.error) {
  //   return <>Error fetching invoices</>;
  // }
  return <div>{<Invoices invoices={data} />}</div>;
}
