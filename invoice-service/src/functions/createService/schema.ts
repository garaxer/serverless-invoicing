export default {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    venue: { type: "string" },
    bookingStatus: { type: "string" },
    startDateTime: { type: "string" }, // If a service has a date then it is activity; one day one time only, but if it doesnt then the time slots are for everyday. I am undecided whether I should make a restaurant booker or event sharer.
    serviceType: { type: "string" },
    duration: { type: "number" },
    maxPartySize: { type: "number" },
    maxCapacity: { type: "number" },
    timeSlots: {
      type: "array",
      uniqueItems: true,
      items: {
        type: "string",
        minItems: 1,
        maxItems: 15,
      },
    },
  },
  required: ["title"],
} as const;
