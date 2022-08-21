import { getInvoiceById } from "../getInvoice";
import { APIGatewayProxyEvent } from "aws-lambda";
import { uploadPictureToS3 } from "@libs/uploadPictureToS3";
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import * as createHttpError from "http-errors";
import { addPictureToInvoiceCommand } from "@libs/addPictureToInvoiceCommand";

const uploadInvoicePicture = async (
  event: APIGatewayProxyEvent,
  _context: any
) => {
  const { id } = event.pathParameters;
  const invoice = await getInvoiceById(id);

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  try {
    const uploadToS3Result = await uploadPictureToS3(
      invoice.id + ".jpg",
      buffer
    );
    console.log({uploadToS3Result});
    const updatedInvoice = await addPictureToInvoiceCommand(
      invoice,
      uploadToS3Result.Location
    );
    return {
      statusCode: 200,
      body: JSON.stringify(updatedInvoice),
    };
  } catch (error) {
    console.error(error);
    throw new createHttpError.InternalServerError(error);
  }
};

export const handler = middy(uploadInvoicePicture).use(httpErrorHandler());
