import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import config, { ConfigType } from "./config/config";

declare module "fastify" {
  interface FastifyInstance {
    config: ConfigType;
  }
}

export default async function build() {
  const fastify = Fastify({ logger: true });
  try {
    await fastify.register(fastifyEnv, config());
    fastify.get("/", async () => {
      const jwt = fastify.config.JWT_SECRET;
      return { jwt };
    });
    await fastify.ready();
  } catch (error) {
    fastify.log.error("Error initializing application:", error);
    process.exit(1);
  }
  return fastify;
}
