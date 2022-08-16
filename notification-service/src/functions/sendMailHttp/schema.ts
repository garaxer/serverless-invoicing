export default {
  type: "object",
  properties: {
    subject: { type: "string" },
    body: { type: "string" },
    recipients: {
      type: "array",
      uniqueItems: true,
      items: { type: "string" },
    },
  },
  required: ["subject","body"],
} as const;
