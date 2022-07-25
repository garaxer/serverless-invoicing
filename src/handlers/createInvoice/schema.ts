export default {
  type: "object",
  properties: {
    title: { type: 'string' },
    amount: { type: 'number' },
    dueDate: { type: 'string' },
  },
  required: ['title']
} as const;
