import { DynamoDB } from "aws-sdk";
import * as createHttpError from "http-errors";
import { Service } from "src/typings/booking";

const dynamodb = new DynamoDB.DocumentClient();

const getServicebyId = async (id: string) => {
  let service: DynamoDB.DocumentClient.AttributeMap;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.BOOKINGS_TABLE_NAME,
        Key: { id },
      })
      .promise();

    service = result.Item;
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }

  if (!service) {
    throw new createHttpError.NotFound(`Service with ID "${id}" not found`);
  }

  return service as Service;
};

export default getServicebyId;