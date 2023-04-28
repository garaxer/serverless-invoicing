export default {
  InvoicesBucket: {
    Type: "AWS::S3::Bucket",
    Properties: {
      BucketName: "${self:custom.InvoicesBucket.name}",
      LifecycleConfiguration: {
        Rules: [
          { Id: "ExpirePictures", Status: "Enabled", ExpirationInDays: 365 },
        ],
      },
    },
  },
  InvoicesBucketPolicy: {
    Type: "AWS::S3::BucketPolicy",
    Properties: {
      Bucket: { Ref: "InvoicesBucket" },
      PolicyDocument: {
        Statement: [
          {
            Sid: "PublicRead",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: "arn:aws:s3:::${self:custom.InvoicesBucket.name}/*",
          },
        ],
      },
    },
  },
};
