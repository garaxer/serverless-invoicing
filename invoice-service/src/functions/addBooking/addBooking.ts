// TODO change this to append a new object to the service.

import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import addBookingCommand from "@libs/booking/addBookingCommand";
import getServicebyId from "@libs/booking/getServicebyId";
import { middyfy } from "@libs/lambda";
import * as createHttpError from "http-errors";
import { Authorizer } from "src/typings/authorizer";

import schema from "./schema";

const createService: ValidatedEventAPIGatewayProxyEvent<
  typeof schema,
  Authorizer
> = async (event) => {
  const { timeSlot } = event.body;
  const { email = "unknown@example.com" } = event.requestContext.authorizer;
  const { id } = event.pathParameters;

  console.log("Adding Booking");

  try {
    const service = await getServicebyId(id);
    const updatedService = await addBookingCommand(service, timeSlot, email);
    console.log(updatedService);
    return formatJSONResponse({
      ...updatedService,
    });
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
};

export const main = middyfy(createService);
