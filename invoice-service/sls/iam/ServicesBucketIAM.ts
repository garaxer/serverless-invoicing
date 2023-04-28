export default {
  Effect: "Allow",
  Action: ["s3:PutObject"],
  Resource: "arn:aws:s3:::${self:custom.ServicesBucket.name}/*",
};
