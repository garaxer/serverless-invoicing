export default {
  Effect: "Allow",
  Action: [
    "dynamodb:PutItem",
    "dynamodb:Scan",
    "dynamodb:GetItem",
    "dynamodb:DeleteItem",
    "dynamodb:UpdateItem",
    "dynamodb:Query",
  ],
  Resource: [
    { "Fn::GetAtt": ["BookingsTable", "Arn"] },
    // "${self:custom.BookingsTable.arn}",
    // 
    { "Fn::GetAtt": ["InvoicesTable", "Arn"] },
    {
      "Fn::Join": [
        "/",
        [{ "Fn::GetAtt": ["BookingsTable", "Arn"] }, "index", "statusAndStartDateTime"],
      ],
    },
    {
      "Fn::Join": [
        "/",
        [{ "Fn::GetAtt": ["InvoicesTable", "Arn"] }, "index", "statusAndDueDate"],
      ],
    },
  ],
};
