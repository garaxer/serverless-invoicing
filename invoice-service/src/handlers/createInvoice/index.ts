import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/createInvoice.handler`,
  events: [
    {
      http: {
        cors: true,
        method: "POST",
        authorizer: "${self:custom.authorizer}",
        path: "/invoice",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
