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
        Authorization: `Bearer ${token}`,
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

const requests = (token: string, baseUrl = BASE_URL) => {
  return {
    get: <T>(url: string) =>
      fetch(`${baseUrl}${url}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((r) => responseBody<T>(r))
        .catch(responseError),
    post: <T>(url: string, body: {}) =>
      fetch(`${baseUrl}${url}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
        .then((r) => responseBody<T>(r))
        .catch(responseError),
    patch: <T>(url: string, body: {}) =>
      fetch(`${baseUrl}${url}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
        .then((r) => responseBody<T>(r))
        .catch(responseError),
  };
};

const Invoices = (token: string, baseUrl = BASE_URL) => ({
  list: (status?: PAIDSTATUS) =>
    requests(token, baseUrl).get<InvoiceDto[]>(
      `/invoices${status ? `?status=${status}` : ""}`
    ),
  create: (invoice: CreateInvoiceDto) =>
    requests(token, baseUrl).post<InvoiceDto>("/invoice", invoice),
  pay: (invoiceId: string, amount: number) =>
    requests(token, baseUrl).patch<InvoiceDto>(`/invoice/${invoiceId}/pay`, {amount}),
});

const agent = {
  Invoices,
};

export default agent;
