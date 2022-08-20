export default {
  type: "object",
  properties: {
    timeSlot: { type: "string" },
  },
  required: ["timeSlot"],
} as const;
