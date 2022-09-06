import { InvoiceDto, PAIDSTATUS, CreateInvoiceDto } from "../types/invoice";

const BASE_URL =
  "https://bpqc2pxzub.execute-api.ap-southeast-2.amazonaws.com/dev";

export const SWRFetcher =
  (token: string) =>
  async (resource: RequestInfo | URL, init?: RequestInit | undefined) => {
    console.log({ token });
    const res = await fetch(`${BASE_URL}${resource}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.log("Custom fetcher");
    console.log({ res });
    return await res.json();
  };

const responseBody = <T>(response: Response) => {
  console.log(response);

  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.json() as Promise<T>;
};

const responseError = (error: Error) => {
  console.error(error);
  throw error;
};

const requests = (token: string) => {
  return {
    get: <T>(url: string) =>
      fetch(`${BASE_URL}${url}`)
        .then((r) => responseBody<T>(r))
        .catch(responseError),
    post: <T>(url: string, body: {}) =>
      fetch(`${BASE_URL}${url}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((r) => responseBody<T>(r))
        .catch(responseError),
  };
};

const Invoices = (token: string) => ({
  list: (status?: PAIDSTATUS) =>
    requests(token).get<InvoiceDto[]>(
      `/invoices${status ? `?status=${status}` : ""}`
    ),
  create: (invoice: CreateInvoiceDto) =>
    requests(token).post<InvoiceDto>("/invoice", invoice),
  pay: (invoiceId: string) =>
    requests(token).get<InvoiceDto>(`/invoices/${invoiceId}`),
});

const agent = {
  Invoices,
};

export default agent;
