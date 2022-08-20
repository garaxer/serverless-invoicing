import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

const path = handlerPath(__dirname);

export default {
  handler: `${path}/${path.split("/")[path.split("/").length - 1]}.main`,
  events: [
    {
      http: {
        cors: true,
        authorizer: "${self:custom.authorizer}",
        method: "post",
        path: "/services",
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
};
