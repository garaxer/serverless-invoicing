import { useState } from "react";
import api from "api";
import { InvoiceDto, PAIDSTATUS } from "types/invoice";

const useGetInvoicesNext = () => {
  const [data, setData] = useState<InvoiceDto[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (status = PAIDSTATUS.PAID) => {
    try {
      setIsLoading(true);
      const invoices = await api.Invoices("", "/api").list(status);
      console.log({ invoices });
      setData(invoices);
      setIsLoading(false);
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setIsLoading(true);
    }
  };
  const state = { data, isLoading, error };

  return {
    state,
    fetchData,
    setData,
  };
};

export default useGetInvoicesNext;
