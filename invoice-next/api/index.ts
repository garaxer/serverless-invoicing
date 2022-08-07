import { InvoiceDto, PAIDSTATUS, CreateInvoiceDto } from "../types/invoice";

const BASE_URL =
  "https://bpqc2pxzub.execute-api.ap-southeast-2.amazonaws.com/dev";

export const SWRFetcher = (
  resource: RequestInfo | URL,
  init?: RequestInit | undefined
) =>
  fetch(`${BASE_URL}${resource}`, init).then((res) => {
    console.log("Custom fetcher");
    console.log(res);
    return res.json();
  });

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

const requests = {
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

const Invoices = {
  list: (status?: PAIDSTATUS) =>
    requests.get<InvoiceDto[]>(`/invoices${status ? `?status=${status}` : ""}`),
  create: (invoice: CreateInvoiceDto) =>
    requests.post<InvoiceDto>("/invoice", invoice),
};

const agent = {
  Invoices,
};

export default agent;
