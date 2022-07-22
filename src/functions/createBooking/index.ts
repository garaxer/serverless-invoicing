import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/bookingHandler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'booking',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
