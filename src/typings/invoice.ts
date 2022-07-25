
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
    paidBy: {
        amount: number,
    },
}


export class InvoiceDto implements Invoice {
    id: string;
    title: string;
    paidStatus: PAIDSTATUS;
    createdAt: string;
    amount: number;
    dueDate: string;
    paidBy: {
        amount: number;
    };
    constructor(partial: Partial<InvoiceDto>) {
        Object.assign(this, partial)
    }
}