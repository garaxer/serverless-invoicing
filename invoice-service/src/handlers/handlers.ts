export default {
  getInvoices: {
    handler: "src/handlers/getInvoices.handler",
    events: [
      {
        http: {
          method: "GET",
          path: "/invoices",
          authorizer: "${self:custom.authorizer}",
          request: {
            parameters: {
              querystrings: {
                status: false,
                limit: false,
                exclusiveStartKeyId: false,
              },
            },
          },
        },
      },
    ],
  },
  getInvoice: {
    handler: "src/handlers/getInvoice.handler",
    events: [
      {
        http: {
          cors: true,
          method: "GET",
          path: "/invoice/{id}",
          authorizer: "${self:custom.authorizer}",
        },
      },
    ],
  },
  deleteInvoice: {
    handler: "src/handlers/deleteInvoice.handler",
    events: [
      {
        http: {
          cors: true,
          method: "DELETE",
          path: "/invoice/{id}",
          authorizer: "${self:custom.authorizer}",
        },
      },
    ],
  },
  remindInvoice: {
    handler: "src/handlers/remindInvoice.handler",
  },
};
