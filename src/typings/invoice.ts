
export enum PAIDSTATUS  {
    PAID = 'PAID',
    UNPAID = 'UNPAID'
}

export type Invoice = {
    id: string,
    title: string,
    paidStatus: PAIDSTATUS,
    createdAt: string,
    amount: number,
    dueDate: string,
    recipientEmail: string;
    paidBy: {
        amount: number,
        datePaid?: string;
    },
    reminderSentDate?: string
}


export class InvoiceDto implements Invoice {
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
    };
    reminderSentDate?: string;
    constructor(partial: Partial<InvoiceDto>) {
        Object.assign(this, partial)
    }
}