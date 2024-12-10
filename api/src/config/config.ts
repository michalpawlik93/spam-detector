import * as path from "path";

export default function () {
  const envFile: EnvironmentType =
    process.env.NODE_ENV === "production"
      ? Environment.Production
      : Environment.Development;
  return {
    dotenv: {
      path: path.resolve(__dirname, `../../${envFile}`),
      debug: true,
    },
    schema: {
      type: "object",
      required: ["JWT_SECRET"],
      properties: {
        DB_URI: { type: "string" },
        JWT_SECRET: { type: "string" },
      },
    },
  };
}

export interface ConfigType {
  JWT_SECRET: string;
}

export type EnvironmentType = (typeof Environment)[keyof typeof Environment];

export const Environment = {
  Production: ".env.production",
  Development: ".env.development",
} as const;
