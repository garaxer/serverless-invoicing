import schema from './schema';

export default  {
  type: "object",
  properties: {
    amount: { type: "number" },
    datePaid: { type: "string" },
  },
  required: ['amount']

} as const; 

export const payInvoiceSchema = {
  properties: {
      body : schema
  },
  required: ['body']
}