const schema = {
  type: "object",
  properties: {
    title: { type: 'string' },
    amount: { type: 'number' },
    dueDate: { type: 'string' },
    recipientEmail: { type: 'string' },
    serviceEndDate: { type: 'string' },
    serviceStartDate: { type: 'string' },
  },
  required: ['title']
} 
export default schema


export const createInvoiceSchema = {
  properties: {
      body : schema
  },
  required: ['body']
}