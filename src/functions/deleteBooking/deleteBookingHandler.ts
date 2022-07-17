import commonMiddleware from "@libs/commonMiddleware";
import { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { AWSError, DynamoDB } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import * as createHttpError from "http-errors";

const dynamodb = new DynamoDB.DocumentClient();

const deleteBooking: Handler<APIGatewayProxyEvent> = async (event) => {
  console.log("Deleting Booking");

  let booking: PromiseResult<
    DynamoDB.DocumentClient.DeleteItemOutput,
    AWSError
  >;

  const { id } = event.pathParameters;

  try {
    const result = await dynamodb
      .delete({
        TableName: process.env.BOOKINGS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    booking = result;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 204,
    body: JSON.stringify({ id, booking }),
  };
};

export const main = commonMiddleware(deleteBooking);
