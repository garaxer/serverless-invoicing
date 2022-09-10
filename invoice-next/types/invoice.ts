
export enum PAIDSTATUS {
  PAID = "PAID",
  UNPAID = "UNPAID",
  LOADING = "LOADING",
}

export type CreateInvoiceDto = {
  title: string;
  amount: number;
  dueDate: string;
  recipientEmail: string;
  serviceEndDate?: string;
  serviceStartDate?: string;
};

export type InvoiceDto = {
  id: string;
  title: string;
  paidStatus: PAIDSTATUS;
  createdAt: string;
  amount: number;
  dueDate: string;
  recipientEmail: string;
  paidBy: {
    amount: number;
    datePaid?: string;
  }[];
  reminderSentDate?: string;
  serviceEndDate?: string;
  serviceStartDate?: string;
};