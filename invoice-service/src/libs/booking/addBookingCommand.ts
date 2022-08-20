import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import { Service } from "src/typings/booking";

const dynamodb = new DynamoDB.DocumentClient();

const addBookingCommand = async (
  service: Service,
  timeSlotId: string,
  email = "unknown"
) => {

  if (!service.timeSlots.find((ts) => ts.id === timeSlotId)) {
    throw new createHttpError.NotFound(
      `Timeslot ${timeSlotId} does not exist ${service.timeSlots.map(
        (x) => x.id
      )}`
    );
  }

  const newTimeSlot = service.timeSlots.map((timeSlot) =>
    timeSlot.id === timeSlotId
      ? { ...timeSlot, attendees: [...timeSlot.attendees, email] }
      : timeSlot
  );

  const params = {
    TableName: process.env.BOOKINGS_TABLE_NAME,
    Key: { id: service.id },
    UpdateExpression: "set timeSlot = :timeSlot, updated_at = :updated_at",
    ExpressionAttributeValues: {
      ":timeSlot": newTimeSlot,
      ":updated_at": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedInvoice: DynamoDB.DocumentClient.AttributeMap;

  const result = await dynamodb.update(params).promise();
  console.log({ result });

  updatedInvoice = result.Attributes;

  console.log({ updatedInvoice });

  return updatedInvoice as Service | undefined;
};

export default addBookingCommand;
