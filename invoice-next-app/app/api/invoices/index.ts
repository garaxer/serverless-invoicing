import { InvoiceDto, PAIDSTATUS, CreateInvoiceDto } from "../../_types/invoice";

const BASE_URL =
  "https://bpqc2pxzub.execute-api.ap-southeast-2.amazonaws.com/dev";

export const SWRFetcher =
  (token: string) =>
  async (resource: RequestInfo | URL, init?: RequestInit | undefined) => {
    // console.log({ token });
    const res = await fetch(`${BASE_URL}${resource}`, {
      ...init,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // console.log("Custom fetcher");
    // console.log({ res });
    return await res.json();
  };

export const isOfTypeInvoiceDto = (obj: unknown): obj is InvoiceDto => {
  return obj != null && typeof (obj as InvoiceDto)?.id === "string";
};

const responseBodyIsTyped =
  <T>(typingFn: (obj: unknown) => obj is T) =>
  async (response: Response) => {
    console.log(response);

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const responseTyped: unknown = await response.json();
    if (!typingFn(responseTyped)) {
      throw new TypeError("Type not correct in response");
    }
    return responseTyped;
  };

export class ResponseError extends Error {
  info: string | undefined;
  status: number | undefined;
}

const responseBody = async <T>(response: Response) => {
  if (!response.ok) {
    const error = new ResponseError(
      "An error occurred while fetching the data."
    );
    // Attach extra info to the error object.
    error.info = await response.text(); // edit backend to send json?
    error.status = response.status;
    throw error;
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
    delete: <T>(url: string) =>
      fetch(`${baseUrl}${url}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
  delete: (invoiceId: string) =>
    requests(token, baseUrl).delete<{id: string, invoice: InvoiceDto}>(`/invoice/${invoiceId}`),
  pay: (invoiceId: string, amount: number, datePaid: string, sendEmail = true) =>
    requests(token, baseUrl).patch<InvoiceDto>(`/invoice/${invoiceId}/pay`, {
      amount,
      datePaid,
      sendEmail,
    }),
});

const agent = {
  Invoices,
};

export default agent;
