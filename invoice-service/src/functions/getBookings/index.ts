import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/bookingsHandler.main`,
  events: [
    {
      http: {
        cors: true,
        authorizer: "${self:custom.authorizer}",
        method: "get",
        path: "/services",
        request: {
          parameters: {
            querystrings: {
              limit: false,
              exclusiveStartKeyId: false,
            },
          },
        },
      },
    },
  ],
};
