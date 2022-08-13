export default {
  type: "object",
  properties: {
    subject: { type: "string" },
    body: { type: "string" },
    recipients: {
      type: "array",
      uniqueItems: true,
      recipient: { type: "string" },
    },
  },
  required: ["name"],
} as const;
