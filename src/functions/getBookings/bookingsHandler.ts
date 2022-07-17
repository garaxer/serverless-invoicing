
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient();

const getBookings: Handler<APIGatewayProxyEvent> = async (
  event
) => {
  const { limit = 20, exclusiveStartKeyId = undefined } = event?.queryStringParameters || {};

  console.log(`Getting Bookings ${limit}`);

  let bookings: DynamoDB.DocumentClient.ItemList;
  let lastEvaluatedKey: DynamoDB.DocumentClient.Key;

  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.BOOKINGS_TABLE_NAME,
        Limit: parseInt(`${limit || 20}`),
        ...(exclusiveStartKeyId && {
          ExclusiveStartKey: { id: exclusiveStartKeyId },
        }), // LastEvaluatedKey
      })
      .promise();

    bookings = result.Items;
    lastEvaluatedKey = result.LastEvaluatedKey
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return formatJSONResponse({
    bookings,
    lastEvaluatedKey
  });
};

export const main = middyfy(getBookings);
