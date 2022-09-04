import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CreateInvoiceDto, InvoiceDto } from "types/invoice";
import api from "api";

const useAddInvoice = () => {
  const [data, setData] = useState<InvoiceDto | undefined>();
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { getAccessTokenSilently } = useAuth0();

  const mutate = async (invoice: CreateInvoiceDto) => {
    try {
      setIsMutating(true);
      const response = await api.Invoices("").create(invoice);

      setData(response);
      setIsMutating(false);
      return response;
    } catch (error: any) {
      setError(error);
      setIsMutating(false);
    }
  };
  const resetData = () => setData(undefined);

  const state = { data, isMutating, error };
  return { state, mutate, resetData };
};

export default useAddInvoice;
