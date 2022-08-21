import { DynamoDB } from "aws-sdk";
import { Invoice } from "src/typings/invoice";

const dynamodb = new DynamoDB.DocumentClient();

export async function addPictureToInvoiceCommand(
  invoice: Invoice,
  invoiceImage: string,
) {
  const params = {
    TableName: process.env.INVOICES_TABLE_NAME,
    Key: { id: invoice.id },
    UpdateExpression: "set invoiceImage = :invoiceImage",
    ExpressionAttributeValues: {
      ":invoiceImage": invoiceImage,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedInvoice: DynamoDB.DocumentClient.AttributeMap;
  
  const result = await dynamodb.update(params).promise();
  console.log({result});

  updatedInvoice = result.Attributes;

  return updatedInvoice as Invoice | undefined;
}
