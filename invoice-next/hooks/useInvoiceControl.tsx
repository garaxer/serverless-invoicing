import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { InvoiceListState } from "./useSearchInvoicesForm";

export type InvoiceActions = {
  handleDelete: (invoiceId: string) => Promise<void>;
  handleSubmit: (data: InvoiceListState) => void;
};

const InvoiceControlContext =
  createContext<InvoiceActions | undefined>(undefined);

export type InvoiceControlProviderProps = PropsWithChildren<InvoiceActions>;

export const InvoiceControlProvider = ({
  handleDelete,
  handleSubmit,
  children,
}: InvoiceControlProviderProps) => {
  const value = useMemo(
    () => ({
      handleDelete,
      handleSubmit
    }),
    [handleDelete, handleSubmit]
  );
  
  return (
    <InvoiceControlContext.Provider value={value}>
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
