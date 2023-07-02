import { PropsWithChildren, createContext, useContext } from "react";

export type InvoiceActions = {
  handleDelete: (invoiceId: string) => void;
};

const InvoiceControlContext =
  createContext<InvoiceActions | undefined>(undefined);

export type InvoiceControlProviderProps = PropsWithChildren<InvoiceActions>;

export const InvoiceControlProvider = ({
  handleDelete,
  children,
}: InvoiceControlProviderProps) => {
  return (
    <InvoiceControlContext.Provider value={{ handleDelete }}>
      {children}
    </InvoiceControlContext.Provider>
  );
};

export const useInvoiceControl = () => {
    const context = useContext(InvoiceControlContext);
    if (context === undefined) {
        throw new Error("InvoiceControlContext must be used within a InvoiceControlProvider");
    }
    return context;
};
