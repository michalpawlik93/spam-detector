import { FastifyInstance } from "fastify";
import build from "../app";

let app: FastifyInstance;

export const setupFastify = async (): Promise<void> => {
  app = await build();
};

export const teardownFastify = async (): Promise<void> => {
  if (app) await app.close();
};

export { app };
