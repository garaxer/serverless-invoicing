import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import config from "src/config";

const getDynamoDbClient = () => {
  const dynamodb = new DynamoDBClient({
    region: "ap-southeast-2",
    ...(config.isLocal && {
      region: "local",
      endpoint: "http://localhost:8000",
      accessKeyId: "accessKeyId",
      secretAccessKey: "secretAccessKey",
    }),
    ...(process.env.JEST_WORKER_ID && {
      region: "local-env",
      endpoint: "http://localhost:8000",
      sslEnabled: false,
    }),
  });
  const dynamoDBClient = DynamoDBDocumentClient.from(dynamodb);

  return dynamoDBClient;
};
export default getDynamoDbClient;
