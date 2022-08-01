const schema = {
  type: "object",
  properties: {
    amount: { type: "number" },
  },
  required: ['amount']
}; 
export default schema

export const payInvoiceSchema = {
  properties: {
      body : schema
  },
  required: ['body']
}