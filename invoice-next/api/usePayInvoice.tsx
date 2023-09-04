import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { InvoiceDto } from "types/invoice";
import api, { ResponseError } from "api";

export type UsePayInvoiceErrorResponse = { error: ResponseError; invoiceId: string }
export const isOfTypeUsePayInvoiceErrorResponse = (obj: unknown): obj is UsePayInvoiceErrorResponse => {
  return obj != null && typeof (obj as UsePayInvoiceErrorResponse)?.error?.info === "string";
};

export type OnPayProps = {
  invoiceId: string;
  amount: number;
  datePaid: Date;
  sendEmail: boolean;
};

const usePayInvoice = () => {
  const [data, setData] = useState<InvoiceDto | undefined>();
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] =
    useState<UsePayInvoiceErrorResponse | null>(null);

  const { getIdTokenClaims, isAuthenticated } = useAuth0();

  const mutate = async ({
    invoiceId,
    amount,
    datePaid,
    sendEmail,
  }: OnPayProps) => {
    const idToken = await getIdTokenClaims();
  if (!idToken || !isAuthenticated) {
      alert("Please login");
      return;
    }
    try {
      setIsMutating(true);
      const response = await api
        .Invoices(idToken.__raw)
        .pay(invoiceId, amount, datePaid.toISOString(), sendEmail);

      setData(response);
      setIsMutating(false);
      return response;
    } catch (error: any) {
      const errorResponse = {
        invoiceId,
        error,
      }
      setError(errorResponse);
      setIsMutating(false);
      return errorResponse;
    }
  };
  const resetData = () => setData(undefined);

  const state = { data, isMutating, error };
  return { state, mutate, resetData };
};

export default usePayInvoice;
