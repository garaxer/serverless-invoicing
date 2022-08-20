export default {
  type: "object",
  properties: {
    timeSlot: { type: "string" },
    phone: { type: "string" },
  },
  required: ["timeSlot"],
} as const;
