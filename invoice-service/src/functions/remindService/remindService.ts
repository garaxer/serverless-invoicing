import { Context, APIGatewayEvent } from "aws-lambda";
import * as createHttpError from "http-errors";
import { getCurrentBookings } from "@libs/booking/currentBookingsQuery";
import { serviceMailer } from "@libs/booking/serviceMailer";

const remindService = async (_event: APIGatewayEvent, _context: Context) => {
  try {
    const currentOpenServices = await getCurrentBookings();
    console.log({ currentOpenServices });
    const closePromises = currentOpenServices.map((service) =>
      serviceMailer(service)
    );
    await Promise.all(closePromises);
    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
};

export const main = remindService;
