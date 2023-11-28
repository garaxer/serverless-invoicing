import { APIGatewayEvent } from "aws-lambda";

const handler = async (event: APIGatewayEvent, context) => {
  console.log(event);
  console.log(context);

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      result: "hello",
      headers: event.headers,
    }),
  };
};

export const main = handler;
