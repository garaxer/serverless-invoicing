import { DynamoDB } from "aws-sdk";
import { Invoice } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();

export const getOverdueInvoices = async () => {
  const now = new Date();
  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    IndexName: 'statusAndDueDate',
    KeyConditionExpression:
      "paidStatus = :paidStatus AND dueDate < :now",
      ExpressionAttributeValues: {
        ':paidStatus': 'UNPAID',
        ':now': now.toISOString()
      }
  };
  
  const result = await dynamodb.query(params).promise();
  return result.Items as Invoice[]
}

