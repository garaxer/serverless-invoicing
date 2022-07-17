export default {
  type: "object",
  properties: {
    startTime: { type: "string" },
    bookingStatus: { type: "string" },
    bookingType: { type: "string" },
    description: { type: "string" },
    attendees: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "object",
        minItems: 1,
        maxItems: 15,
        properties: {
          firstName: { type: "string" },
          lastName: { type: "string" },
          contactEmail: { type: "string" },
          phoneNumber: { type: "string" },
        },
        required: ['contactEmail']
      },
    },
  },
  required: ["startTime", "bookingStatus", "description", "attendees"],
} as const;
