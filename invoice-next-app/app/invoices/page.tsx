import { InvoiceDto } from "../_types/invoice";
import { Invoices } from "./invoices";

export default async function Index() {
  const invoicesData = await fetch("http://localhost:3000/api/invoices");
  const invoices: InvoiceDto[] & { error: any } = await invoicesData.json();
  console.log(invoices);
  if (!invoices || invoices?.error) {
    return <>Error fetching invoices</>;
  }
  return (
    <div>
      <Invoices invoices={invoices} />
    </div>
  );
}
