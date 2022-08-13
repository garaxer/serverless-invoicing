import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/editInvoice.handler`,
  events: [
    {
      http: {
        method: "PATCH",
        path: "/invoice/{id}/",
        authorizer: "${self:custom.authorizer}",
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
