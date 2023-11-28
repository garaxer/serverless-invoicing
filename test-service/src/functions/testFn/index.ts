
export default {
  handler: `src/functions/testFn/handler.main`,
  events: [
    {
      http: {
        cors: true,
        private: true,
        method: "GET",
        path: "/test",
      },
    },
  ],
};
