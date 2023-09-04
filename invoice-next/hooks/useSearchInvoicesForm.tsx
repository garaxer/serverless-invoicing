import { useReducer, useState } from "react";

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
  dueAfterDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
};

const reducer = (state: InvoiceListState, action: SearchFormAction) => {
  switch (action.type) {
    case "SET_SEARCH_STATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
};

export type SearchFormAction = {
  type: "SET_SEARCH_STATE";
  state: InvoiceListState;
};

const useSearchInvoicesForm = () => {
  const [invoiceUrl, setInvoiceUrl] = useState("/invoices?status=UNPAID");
  const [state, dispatch] = useReducer(reducer, initialSearchInvoiceState);
  const onActionHandler = (data: InvoiceListState) => {
    const dueAfterDate = data?.dueAfterDate
      ? `&dueAfterDate=${data.dueAfterDate}`
      : "";
    setInvoiceUrl(`/invoices?status=${data?.paidStatus}${dueAfterDate}`);
    dispatch({ type: "SET_SEARCH_STATE", state: data });
  };

  return { invoiceUrl, onActionHandler, searchFormState: state };
};

export default useSearchInvoicesForm;
