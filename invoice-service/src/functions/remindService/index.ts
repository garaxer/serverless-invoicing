import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/remindService.main`,
  events: [{ schedule: "rate(1 day)" }],
};
