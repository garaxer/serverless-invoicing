import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/${handlerPath(__dirname)}.main`,
  events: [
    {
      http: {
        method: "post",
        path: "service",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
