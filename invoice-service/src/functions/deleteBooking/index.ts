import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/deleteBookingHandler.main`,
  events: [
    {
      http: {
        cors: true,
        authorizer: "${self:custom.authorizer}",
        method: "DELETE",
        path: "/service/{id}",
      },
    },
  ],
};
