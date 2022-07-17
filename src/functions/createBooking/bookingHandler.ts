import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import { BookingClass } from "src/typings/booking";
import { v4 as uuid } from "uuid";

import schema from "./schema";
const dynamodb = new DynamoDB.DocumentClient();

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const { startTime, bookingStatus, bookingType, description, attendees } = event.body;

  console.log("Creating Booking");

  const booking = new BookingClass({
    id: uuid(),
    startTime,
    description,
    bookingStatus,
    bookingType,
    attendees: attendees.map(
      ({ firstName, lastName, phoneNumber, contactEmail }) => ({
        firstName,
        lastName,
        phoneNumber,
        contactEmail,
      })
    ),
  });

  try {
    const result = await dynamodb
      .put({
        TableName: process.env.BOOKINGS_TABLE_NAME,
        Item: booking.to_new(),
      })
      .promise();
    console.log(result);  
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return formatJSONResponse({
    booking,
  });
};

export const main = middyfy(hello);
