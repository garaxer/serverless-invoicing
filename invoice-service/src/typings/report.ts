export enum REPORTTYPE {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}


export type Report = {
    id: string;
    source: string;
    description: string;
    reportType: REPORTTYPE;
    paid: boolean;
    taxable: boolean;
    invoice_id: string;
}