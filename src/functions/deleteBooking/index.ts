import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/deleteBookingHandler.main`,
  events: [
    {
      http: {
        method: "DELETE",
        path: "/booking/{id}",
      },
    },
  ],
};
