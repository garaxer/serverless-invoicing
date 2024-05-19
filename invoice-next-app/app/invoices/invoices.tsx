import { InvoiceDto } from "../_types/invoice";
import Emailer from "./_components/Emailer";

export async function Invoices({ invoices }: { invoices: InvoiceDto[] }) {
  console.log({ invoices });
  return (
    <>
    <Emailer />
      {invoices &&
        invoices.map((x) => (
          <div key={x.id} className="card w-96 bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Cookies!</h2>
              <p >{x.id}We are using cookies for no reason.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Accept</button>
                <button className="btn btn-ghost">Deny</button>
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
