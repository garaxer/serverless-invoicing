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
  InvoicesTable: {
    Type: "AWS::DynamoDB::Table",
    DeletionPolicy: "Delete",
    Properties: {
      TableName: "InvoicesTable-${self:provider.stage}",
      BillingMode: "PAY_PER_REQUEST",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" },
        { AttributeName: "paidStatus", AttributeType: "S" },
        { AttributeName: "recipientEmail", AttributeType: "S" },
        { AttributeName: "dueDate", AttributeType: "S" },
      ],
      KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
      GlobalSecondaryIndexes: [
        {
          IndexName: "statusAndDueDate",
          KeySchema: [
            { AttributeName: "paidStatus", KeyType: "HASH" },
            { AttributeName: "dueDate", KeyType: "RANGE" },
          ],
          Projection: { ProjectionType: "ALL" },
        },
        {
          IndexName: "emailIndex",
          KeySchema: [{ AttributeName: "recipientEmail", KeyType: "HASH" }],
          Projection: { ProjectionType: "ALL" },
        },
      ],
    },
  }
};
