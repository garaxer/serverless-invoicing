export default {
  type: "object",
  properties: {
    customer: {
      type: "object",
      minItems: 1,
      maxItems: 15,
      properties: {
        id: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
      },
      required: ["email"],
    },
    startDateTime: { type: "string" },
    time_slot_id: { type: "string" },
    party_size: { type: "number" },
    managers_notes: { type: "string" },
    customers_notes: { type: "string" },
    section: { type: "string" },
    service: {
      type: "object",
      minItems: 1,
      maxItems: 2,
      properties: {
        id: { type: "string" },
        title: { type: "string" },
      },
      required: ["id"],
    },
  },
  required: ["customer", "startDateTime", "time_slot_id", "service"],
} as const;

// export type BookingCreate = {
//   customer: User;
//   start_time: string;
//   time_id: string;
//   party_size?: number;
//   managers_notes?: string;
//   customers_notes?: string;
//   service: Service;
// };

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

// attendees: {
//   type: "array",
//   uniqueItems: true,
//   items: {
//     type: "object",
//     minItems: 1,
//     maxItems: 15,
//     properties: {
//       firstName: { type: "string" },
//       lastName: { type: "string" },
//       contactEmail: { type: "string" },
//       phoneNumber: { type: "string" },
//     },
//     required: ["contactEmail"],
//   },
// },