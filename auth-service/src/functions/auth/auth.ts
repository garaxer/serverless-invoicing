import { APIGatewayEvent, Context } from "aws-lambda";
import * as jwt from "jsonwebtoken";

// By default, API Gateway authorizations are cached (TTL) for 300 seconds.
// This policy will authorize all requests to the same API Gateway instance where the
// request is coming from, thus being efficient and optimising costs.
const generatePolicy = (
  principalId: string | (() => string),
  methodArn: string
) => {
  const apiGatewayWildcard = methodArn.split("/", 2).join("/") + "/*";
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: apiGatewayWildcard,
        },
      ],
    },
  };
};

//: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>
type AuthorizedAPIGatewayEvent = APIGatewayEvent & {
  authorizationToken: string;
  methodArn: string;
};

export const handler = async (
  event: AuthorizedAPIGatewayEvent,
  _context: Context
) => {
  if (!event.authorizationToken) {
    throw "Unauthorized";
  }

  const token = event.authorizationToken.replace("Bearer ", "");

  try {
    // Context must contain high level objects, nothing nested Notice that you cannot set a JSON object or array as a valid value of any key in the context map.
    const claimsUnsafe = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);


    const policy = generatePolicy(claimsUnsafe.sub, event.methodArn);

    console.log({ claimsUnsafe });
    const claims = Object.entries(claimsUnsafe).reduce(
      (a, [k, v]) => ({ ...a, [k]: typeof v === "string" ? v : v.toString() }),
      {}
    );
    console.log({ claims });

    console.log({
      ...policy,
      context: claims,
    });

    return {
      ...policy,
      context: claims,
    };
  } catch (error) {
    console.log(error);
    throw "Unauthorized";
  }
};
