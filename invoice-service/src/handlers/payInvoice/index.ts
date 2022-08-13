import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/payInvoice.handler`,
  events: [
    {
      http: {
        method: "PATCH",
        path: "/invoice/{id}/pay",
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
