export default {
  BookingsTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Delete",
    Properties: {
      TableName: "BookingsTable-${self:provider.stage}",
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "bookingStatus", AttributeType: "S" },
        { AttributeName: "startDateTime", AttributeType: "S" },
      ],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      GlobalSecondaryIndexes: [
        {
          IndexName: "statusAndStartDateTime",
          KeySchema: [
            { AttributeName: "bookingStatus", KeyType: "HASH" },
            { AttributeName: "startDateTime", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
      ],
    },
  },
};
