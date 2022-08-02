export type CreateInvoiceDto = {
  title: string;
  amount?: string;
  dueDate?: string;
  recipientEmail?: string;
  serviceEndDate?: string;
  serviceStartDate?: string;
};
