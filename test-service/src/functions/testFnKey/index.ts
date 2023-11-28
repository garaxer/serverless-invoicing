
export default {
  handler: `src/functions/testFn/handler.main`,
  events: [
    {
      http: {
        cors: true,
        method: "GET",
        path: "/testKey",
      },
    },
  ],
};
