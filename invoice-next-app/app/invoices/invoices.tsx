import { InvoiceDto } from "../_types/invoice";


export async function Invoices({invoices}: {invoices: InvoiceDto[]}) {

  return (
    <>
      {invoices.map((x) => (
        <div key={x.id}>{x.id}</div>
      ))}
    </>
  );
}
