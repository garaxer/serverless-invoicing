const schema = {
    properties: {
    queryStringParameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['PAID', 'UNPAID'],
            default: 'UNPAID',
          },
        },
      },
    },
    required: [
      'queryStringParameters',
    ],
  };
  
  export default schema;