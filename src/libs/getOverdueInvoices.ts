import { DynamoDB } from "aws-sdk";

const dynamodb = new DynamoDB.DocumentClient();

export const getOverdueInvoices = async () => {
  const now = new Date();
  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression:
      "paidStatus = :paidStatus AND dueDate < :now",
      ExpressionAttributeValues: {
        ':paidStatus': 'UNPAID',
        ':now': now.toISOString()
      }
  };
  
  const result = await dynamodb.query(params).promise();
  return result.Items
}

