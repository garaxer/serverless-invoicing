import { useFormik } from "formik";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

export enum PAID_STATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
}

export type ActionPayload<T> = {
  type: string;
  data?: T | any; // Cannot get the types to work
} | {
  type: SearchInvoicesAction.SEARCH_SUBMIT,
  data: InvoiceListState
}

export type ActionHandler = <T>(payload: ActionPayload<T>) => void;

export interface InvoiceListState {
  paidStatus?: PAID_STATUS;
}

export enum SearchInvoicesAction {
  SET_PAID_STATUS_FILTER = "SET_PAID_STATUS_FILTER",
  SEARCH_SUBMIT = "SEARCH_SUBMIT",
}

// Prefer to do context like tabs, but this suits formik. Avoid. Hard to type field to state
//better than this?
// export const [form, dispatchForm] = useReducer(
//   (s: { [k: string]: string }, a: { [k: string]: string }) => ({
//     ...s,
//     ...a,
//   }),
//   { paidStatus: "", month: "" }
// );
const useSearchInvoicesForm = (
  params: InvoiceListState,
  onAction?: ActionHandler
) => {
  const {
    values: state,
    setValues,
    handleSubmit,
    setFieldValue,
  } = useFormik<InvoiceListState>({
    initialValues: params,
    onSubmit: (values) => {
      onAction &&
        onAction({
          type: SearchInvoicesAction.SEARCH_SUBMIT,
          data: values,
        });
    },
  });

  const onActionHandler: ActionHandler = ({ type, data }) => {
    switch (type) {
      case SearchInvoicesAction.SEARCH_SUBMIT:
        handleSubmit();
        break;
      case SearchInvoicesAction.SET_PAID_STATUS_FILTER:
        setFieldValue("paidStatus", data);
        onAction && data && onAction({ type, data });
        break;
      case "general": {
        setValues({ ...state, ...data });
        break;
      }
      default:
        return state;
    }
  };

  return { state, onActionHandler };
};

export default useSearchInvoicesForm;

/** context */
export type SearchInvoicesFormProviderProps = InvoiceListState & {
  onAction: ActionHandler;
};

export const InvoicesSearchFormContext =
  createContext<SearchInvoicesFormProviderProps>({
    paidStatus: PAID_STATUS.UNPAID,
    onAction: (_action: any) => {},
  });

export const useSearchInvoicesFormContext = () =>
  useContext(InvoicesSearchFormContext);

export const SearchInvoicesFormProvider = ({
  paidStatus = PAID_STATUS.UNPAID,
  onAction = (_action: any) => {},
  children,
}: PropsWithChildren<SearchInvoicesFormProviderProps>) => {
  const value = useMemo(
    () => ({
      paidStatus,
      onAction,
    }),
    [paidStatus, onAction]
  );

  return (
    <InvoicesSearchFormContext.Provider value={value}>
      {children}
    </InvoicesSearchFormContext.Provider>
  );
};

// use like so
// const Form = () => {
//   const { state, onActionHandler } = useSearchInvoicesForm({});
//   return (
//     <SearchInvoicesFormProvider
//       {...state}
//       onAction={onActionHandler}
//     ></SearchInvoicesFormProvider>
//   );
// };
