import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import { CreateEventService } from "src/typings/booking";
import { v4 as uuid } from "uuid";

import schema from "./schema";
const dynamodb = new DynamoDB.DocumentClient();

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const {
    title,
    description = "",
    venue = "",
    bookingStatus = "OPEN",
    startDateTime = new Date().toISOString(),
    serviceType = "",
    duration = 60,
    maxPartySize = 1,
    maxCapacity = 12,
    timeSlots = ["1200"],
  } = event.body;

  console.log("Creating Service");

  const service: CreateEventService = {
    id: uuid(),
    title,
    description,
    venue,
    bookingStatus,
    startDateTime,
    serviceType,
    duration,
    maxPartySize,
    maxCapacity,
    timeSlots,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const result = await dynamodb
      .put({
        TableName: process.env.BOOKINGS_TABLE_NAME,
        Item: service,
      })
      .promise();
    console.log(result);
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  return formatJSONResponse({
    service,
  });
};

export const main = middyfy(hello);
