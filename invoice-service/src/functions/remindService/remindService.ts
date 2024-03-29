import { Context, APIGatewayEvent } from "aws-lambda";
import * as createHttpError from "http-errors";
import { getCurrentBookings } from "src/db/currentBookingsQuery";
import { serviceMailer } from "@libs/booking/serviceMailer";

const remindService = async (_event: APIGatewayEvent, _context: Context) => {
  try {
    const currentOpenServices = await getCurrentBookings();
    console.log({ currentOpenServices });
    const closePromises = currentOpenServices.map((service) =>
      serviceMailer(service)
    );
    console.log({ closePromises });
    await Promise.all(closePromises);
    console.log("Done");

    return { closed: closePromises.length };
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
};

export const main = remindService;
