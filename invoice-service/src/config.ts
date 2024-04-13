
type GlobalConfigType = {
  isTestRunning: boolean;
  isLocal: boolean;
  loggerLevel: string;
};

export const config: GlobalConfigType = {
  isTestRunning: process.env.NODE_ENV === "test",
  isLocal: process.env?.STAGE === "local" || process.env?.STAGE === "",
  loggerLevel: (process.env?.LOGGER_LEVEL || "info"),
};

export default config;
