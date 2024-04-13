import { getSession } from "@auth0/nextjs-auth0";
import { InvoiceDto } from "../_types/invoice";
import { Invoices } from "./invoices";
import { BASE_URL } from "./config";
import { revalidatePath } from "next/cache";
import InvoiceProvider from "../_context/invoices/InvoiceContext";
import RQProvider from "../_context/RQProvider";

export default async function Index() {
  const s = await getSession();

  if (!s) {
    return <p>Please login to view invoices</p>;
  }
  const dataPromise = fetch(`${BASE_URL}/dev/invoices?status=PAID`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${s?.idToken}`,
    },
  }).then((res) => res.json());
  const data = await fetch(`${BASE_URL}/dev/invoices?status=PAID`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${s?.idToken}`,
    },
  }).then((res) => res.json());

  async function addInvoicePost(food: string) {
    "use server";
    const newInvoices = await fetch(`${BASE_URL}/dev/invoices?status=PAID`, {
      method: "POST",
      cache: "no-cache",
      body: JSON.stringify(food),
    }).then((res) => res.json());
    revalidatePath("/invoices");
    return newInvoices;
  }

  // const invoicesData = await fetch("http://localhost:3000/api/invoices");
  // const invoices: InvoiceDto[] & { error: any } = await invoicesData.json();
  // console.log(invoices);
  // if (!invoices || invoices?.error) {
  //   return <>Error fetching invoices</>;
  // }
  return (
    <div>
      <Invoices invoices={data} />
      <RQProvider>
        <InvoiceProvider
          invoicePromise={dataPromise}
          invoiceAddPromise={addInvoicePost}
        >
          <div></div>
        </InvoiceProvider>
      </RQProvider>
    </div>
  );
}
