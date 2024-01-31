import { getSession } from "@auth0/nextjs-auth0";
import { InvoiceDto } from "../_types/invoice";
import { Invoices } from "./invoices";

export default async function Index() {
  const s = await getSession();

  console.log({ s });
  // const invoicesData = await fetch("http://localhost:3000/api/invoices");
  // const invoices: InvoiceDto[] & { error: any } = await invoicesData.json();
  // console.log(invoices);
  // if (!invoices || invoices?.error) {
  //   return <>Error fetching invoices</>;
  // }
  return <div>{/* <Invoices invoices={invoices} /> */}</div>;
}
