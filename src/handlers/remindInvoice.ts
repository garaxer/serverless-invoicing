import { Context, APIGatewayEvent } from 'aws-lambda';
import { getOverdueInvoices } from '@libs/getOverdueInvoices';

const remindInvoice = async (event: APIGatewayEvent, context: Context): Promise<void> => {
    const invoicesOverdue = await getOverdueInvoices();
    console.log(invoicesOverdue);
    };

export const handler = remindInvoice;
