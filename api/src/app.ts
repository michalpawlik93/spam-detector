import Fastify from "fastify";
import fastifyEnv from "@fastify/env";
import config, { ConfigType } from "./config/config";
import integrationRoutes from "./routes/integration";
import websocket from "@fastify/websocket";
declare module "fastify" {
  interface FastifyInstance {
    config: ConfigType;
  }
  interface RouteShorthandOptions {
    websocket?: boolean;
  }
}

export default async function build() {
  const fastify = Fastify({
    logger: {
      level: "info",
    },
  });
  try {
    await fastify.register(fastifyEnv, config());
    fastify.register(websocket);
    fastify.register(integrationRoutes, {});
    await fastify.ready();
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
  return fastify;
}
