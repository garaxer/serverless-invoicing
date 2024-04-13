"use client";
import { createContext, useContext } from "react";

const InvoiceContext = createContext<{
  invoicePromise: Promise<string[]>;
  invoiceAddPromise: (invoice: string) => Promise<void>;
} | null>(null);

export const useInvoicePromise = () => {
  const invoice = useContext(InvoiceContext);
  if (!invoice)
    throw new Error("useInvoice must be used within a InvoiceProvider");
  return invoice;
};

const InvoiceProvider = ({
  children,
  invoicePromise,
  invoiceAddPromise,
}: {
  children: React.ReactNode;
  invoicePromise: Promise<string[]>;
  invoiceAddPromise: (invoice: string) => Promise<void>;
}) => {
  return (
    <InvoiceContext.Provider value={{ invoicePromise, invoiceAddPromise }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export default InvoiceProvider;
