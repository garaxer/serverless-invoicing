export type CreateInvoiceDto = {
  title: string;
  amount?: number;
  dueDate?: string;
  recipientEmail?: string;
  serviceEndDate?: string;
  serviceStartDate?: string;
};
