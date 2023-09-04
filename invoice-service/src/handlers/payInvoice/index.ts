import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.handler`,
  events: [
    {
      http: {
        cors: true,
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
