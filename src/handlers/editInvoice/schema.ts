export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    amount: { type: 'number' },
    dueDate: { type: 'string' },
    recipientEmail: { type: 'string' },
  }
} as const;
