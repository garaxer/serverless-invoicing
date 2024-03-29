import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

export type ValidatedAPIGatewayProxyEvent<S, A = {}> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> } & {requestContext: {authorizer: Partial<A>}}
export type ValidatedEventAPIGatewayProxyEvent<S, A = {}> = Handler<ValidatedAPIGatewayProxyEvent<S, A>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>, statusCode = 200) => {
  return {
    headers: {
      /* Required for CORS support to work */
      "Access-Control-Allow-Origin": "*",
      /* Required for cookies, authorization headers with HTTPS */
      "Access-Control-Allow-Credentials": true,
    },
    statusCode,
    body: JSON.stringify(response)
  }
}
