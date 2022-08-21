import { S3 } from "aws-sdk";

const s3 = new S3();

export async function uploadPictureToS3(
  key: string,
  body: Buffer,
  bucketName = process.env.INVOICES_BUCKET_NAME
) {
  const result = await s3
    .upload({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    })
    .promise();

  return result;
}
