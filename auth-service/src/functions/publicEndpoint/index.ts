import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/public.handler`,
  events: [
    {
      http: {
        path: "public",
        method: "POST",
        cors: true,
      },
    },
  ],
};
