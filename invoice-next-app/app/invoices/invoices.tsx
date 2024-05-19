import { InvoiceDto } from "../_types/invoice";
import Emailer from "./_components/Emailer";
import { createEmailClient } from "./_libs/email";
import config from "./config";

export async function Invoices({ invoices }: { invoices: InvoiceDto[] }) {
  async function testEmail() {
    "use server";
    const emailer = createEmailClient();
    console.log("nice");
    await emailer.send({
      to: [config.emailTo],
      from: { name: "Gary", email: config.emailFrom },
      subject: "Invoice for rent",
      html: "<p>Test</p>",
    });

    return true;
  }

  // console.log({ invoices });
  return (
    <>
      <Emailer sendEmail={testEmail} />
      {invoices &&
        invoices.map((x) => (
          <div key={x.id} className="card w-96 bg-neutral text-neutral-content">
            <div className="card-body items-center text-center">
              <h2 className="card-title">Cookies!</h2>
              <p>{x.id}We are using cookies for no reason.</p>
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
