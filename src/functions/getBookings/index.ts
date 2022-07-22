import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/bookingsHandler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "bookings",
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
