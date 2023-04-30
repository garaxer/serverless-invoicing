import * as createHttpError from "http-errors";
import { APIGatewayProxyEvent } from "aws-lambda";
import middy from "@middy/core";
import validator from "@middy/validator";
import cors from '@middy/http-cors'
import httpErrorHandler from "@middy/http-error-handler";
import { uploadPictureToS3 } from "@libs/uploadPictureToS3";
import { addPictureToInvoiceCommand } from "src/db/addPictureToInvoiceCommand";
import { getInvoiceById } from "../getInvoice";
import schema from "./schema";

const uploadInvoicePicture = async (
  event: APIGatewayProxyEvent,
  _context: any
) => {
  const { id } = event.pathParameters;
  const invoice = await getInvoiceById(id);
  const { email = "unknown@example.com" } = event.requestContext.authorizer;
  const isOwner = [invoice.createdBy, invoice.recipientEmail].includes(email);
  if (!isOwner) {
    throw new createHttpError.Unauthorized(
      `account email ${email} must one of: ${[
        invoice.createdBy,
        invoice.recipientEmail,
      ].toString()}`
    );
  }
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  try {
    const uploadToS3Result = await uploadPictureToS3(
      invoice.id + ".jpg",
      buffer
    );
    console.log({ uploadToS3Result });
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

export const handler = middy(uploadInvoicePicture)
  .use(httpErrorHandler())
  .use(
    validator({
      inputSchema: schema,
      ajvOptions: {
        strict: false,
      },
    })
  )
  .use(cors());
