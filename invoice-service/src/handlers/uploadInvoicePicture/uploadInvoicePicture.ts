import { getInvoiceById } from "../getInvoice";
import { APIGatewayProxyEvent } from "aws-lambda";
import { uploadPictureToS3 } from "@libs/uploadPictureToS3";

const uploadInvoicePicture = async (
  event: APIGatewayProxyEvent,
  _context: any
) => {
  const { id } = event.pathParameters;
  const invoice = await getInvoiceById(id);

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  const uploadToS3Result = await uploadPictureToS3(invoice.id + ".jpg", buffer);
  console.log(uploadToS3Result);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

export const handler = uploadInvoicePicture;
