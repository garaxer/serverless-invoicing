import { InvoiceDto } from "../_types/invoice";

export async function Invoices({ invoices }: { invoices: InvoiceDto[] }) {
  console.log({ invoices });
  return <>{invoices && invoices?.map((x) => <div key={x.id}>{x.id}</div>)}</>;
}
