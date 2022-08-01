import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/createInvoice.handler`,
  events: [
    {
      http: {
        method: "POST",
        path: "/invoice",
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
