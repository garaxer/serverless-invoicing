import { DynamoDB } from "aws-sdk";
import { Service } from "src/typings/booking";

const dynamodb = new DynamoDB.DocumentClient();

export const getCurrentBookings = async () => {
  const now = new Date();
  const params = {
    TableName: process.env.BOOKINGS_TABLE_NAME,
    IndexName: 'statusAndStartDateTime',
    KeyConditionExpression:
      "bookingStatus = :bookingStatus AND startDateTime > :now",
      ExpressionAttributeValues: {
        ':bookingStatus': 'OPEN',
        ':now': now.toISOString()
      }
  };
  
  const result = await dynamodb.query(params).promise();
  return result.Items as Service[]
}

