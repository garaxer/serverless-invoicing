import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/private.handler`,
  events: [
    {
      http: {
        path: "private",
        method: "POST",
        authorizer: 'auth',
        cors: true,
      },
    },
  ],
};
