import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/${handlerPath(__dirname)}.main`,
  events: [
    {
      http: {
        cors: true,
        authorizer: "${self:custom.authorizer}",
        method: "post",
        path: "booking/{id}",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
