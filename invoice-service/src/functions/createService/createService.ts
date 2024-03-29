import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import { Authorizer } from "src/typings/authorizer";
import { CreateEventService, ReminderFrequency } from "src/typings/booking";
import { v4 as uuid } from "uuid";

import schema from "./schema";
const dynamodb = new DynamoDB.DocumentClient();

const hello: ValidatedEventAPIGatewayProxyEvent<
  typeof schema,
  Authorizer
> = async (event) => {
  const oneWeekFromNow = new Date(
    new Date().getTime() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();
  const {
    title,
    description = "",
    venue = "",
    bookingStatus = "OPEN",
    startDateTime = oneWeekFromNow,
    serviceType = "",
    duration = 60,
    maxPartySize = 1,
    maxCapacity = 12,
    timeSlots = ["1200"],
    reminder = ["weekly"],
    sendEmail = true,
    sendText = false,
  } = event.body;
  const { email: creatorEmail = "unknown@example.com" } =
    event.requestContext.authorizer;

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
    timeSlots: timeSlots.map((timeSlot) => ({ id: timeSlot, attendees: [] })),
    creatorEmail,
    reminder: reminder as ReminderFrequency[],
    sendEmail,
    sendText,
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
