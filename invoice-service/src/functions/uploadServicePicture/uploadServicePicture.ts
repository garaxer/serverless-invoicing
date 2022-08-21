import { APIGatewayProxyEvent } from "aws-lambda";
import { uploadPictureToS3 } from "@libs/uploadPictureToS3";
import getServicebyId from "@libs/booking/getServicebyId";

const uploadServicePicture = async (
  event: APIGatewayProxyEvent,
  _context: any
) => {
  const { id } = event.pathParameters;
  const service = await getServicebyId(id);

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  const uploadToS3Result = await uploadPictureToS3(
    service.id + ".jpg",
    buffer,
    process.env.SERVICES_BUCKET_NAME
  );
  console.log(uploadToS3Result);

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

export const handler = uploadServicePicture;
