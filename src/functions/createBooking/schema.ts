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
        required: ["contactEmail"],
      },
    },
  },
  required: ["startTime", "bookingStatus", "description", "attendees"],
} as const;

/**{
    "customer": {
        "firstName": "Gary",
        "lastName": "Bagnall",
        "email": "gbagnall8@gmail.com",
        "phone": "+61 434 984 069",
    },
    "time": {selection:"2022-07-29T18:00:00", "id": ""},
    "selectedMenuOptions": [],
    "numOfPeople": 2,
    "sectionId": "",
    "hasCustomerNotes": false,
    "hasManagerNotes": false,
    "service": {
        "id": "",
        "duration": 105,
        "serviceType": "Dinner",
        "name": "Dinner"
    },
    "tags": []
} */
