import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import { Booking } from "src/typings/booking";
import { v4 as uuid } from "uuid";

import schema from "./schema";
const dynamodb = new DynamoDB.DocumentClient();

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const {
    time_slot_id,
    party_size,
    managers_notes,
    customers_notes,
    section,
    customer,
    service, 
    startDateTime } = event.body;

  console.log("Creating Booking");

  const booking: Booking = {
    id: uuid(),
    time_slot_id,
    party_size,
    managers_notes,
    customers_notes,
    section,
    customer_id: customer?.id ?? customer.email,
    service_id: service.id,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    startDateTime,
    bookingStatus: "OPEN"
  };

  try {
    const result = await dynamodb
      .put({
        TableName: process.env.BOOKINGS_TABLE_NAME,
        Item: booking,
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
