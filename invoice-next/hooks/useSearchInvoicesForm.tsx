import  {
  useState,
} from "react";

export enum PAID_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
}
export interface InvoiceListState {
  paidStatus?: PAID_STATUS;
  dueAfterDate?: string;
}

export const initialSearchInvoiceState: InvoiceListState = {
  paidStatus: PAID_STATUS.UNPAID,
  dueAfterDate: new Date(Date.now() - 365*24*60*60*1000).toISOString(),
};

const useSearchInvoicesForm = () => {
  const [invoiceUrl, setInvoiceUrl] = useState("/invoices?status=UNPAID");
  const onActionHandler = (data: InvoiceListState) => {
    console.log(data)
    setInvoiceUrl(`/invoices?status=${data?.paidStatus}`);
  };

  return { invoiceUrl, onActionHandler };
};

export default useSearchInvoicesForm;
