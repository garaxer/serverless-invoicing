import { APIGatewayEvent, Context } from "aws-lambda";

export const handler = async (_event: APIGatewayEvent, _context: Context) => {
    return {
      statusCode: 200,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Hi from Public API',
      }),
    };
  }