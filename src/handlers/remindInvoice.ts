import { Context, APIGatewayEvent } from 'aws-lambda';

const remindInvoice = async (event: APIGatewayEvent, context: Context): Promise<void> => {
    console.log('Processing !!');
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);
    console.log(`Context: ${JSON.stringify(context, null, 2)}`);

};

export const handler = remindInvoice;
