import { middyfy } from "@libs/lambda";
import { APIGatewayEvent, Context } from "aws-lambda";

const privateTest = async (event: APIGatewayEvent, context: Context) => {
  console.log(' Private');
  
  return {
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      "Access-Control-Allow-Origin": "*",
      /* Required for cookies, authorization headers with HTTPS */
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: "alive",
      event,
      context,
    }),
  };
};

export const handler = middyfy(privateTest)