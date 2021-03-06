export default {
  getInvoices: {
    handler: "src/handlers/getInvoices.handler",
    events: [
      {
        http: {
          method: "GET",
          path: "/invoices",
          request: {
            parameters: {
              querystrings: {
                status: false,
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
          method: "GET",
          path: "/invoice/{id}",
          
        },
      },
    ],
  },
  deleteInvoice: {
    handler: "src/handlers/deleteInvoice.handler",
    events: [
      {
        http: {
          method: "DELETE",
          path: "/invoice/{id}",
        },
      },
    ],
  },
  remindInvoice: {
    handler: "src/handlers/remindInvoice.handler",
  },
};
