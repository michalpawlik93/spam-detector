import { FastifyInstance, FastifyRequest } from "fastify";
import { chatSDK } from "../utils/sdkUtils";
import {
  handleClientSpamDetection,
  handleIncomingEvent,
  IncomingEvent,
} from "../services/spamService";

interface QueryParams {
  access_token: string;
}

export default async function integrationRoutes(fastify: FastifyInstance) {
  fastify.get("/health", (req, res) => {
    res.status(200).send("OK");
  });
  fastify.get(
    "/hello-ws",
    { websocket: true },
    async function wsHandler(
      socket,
      req: FastifyRequest<{ Querystring: QueryParams }>
    ) {
      const accessToken = req.query.access_token as string;

      if (!accessToken) {
        fastify.log.info("Access token is missing, closing connection.");
        socket.close();
        return;
      }

      try {
        chatSDK.init({
          access_token: accessToken,
        });
        await sleep(2000); // bad workaround, look for callback or async
        fastify.log.info("Connection established.");

        const spamMessages: Map<string, number> = new Map();
        chatSDK.on(
          "incoming_event",
          ({ payload }: { payload: { event: IncomingEvent } }) => {
            handleIncomingEvent(payload, spamMessages, socket, fastify);
          }
        );

        socket.on("message", async (message) => {
          fastify.log.info(`Received message: ${message}`);
          handleClientSpamDetection(
            message.toString(),
            spamMessages,
            socket,
            fastify
          );
        });

        socket.on("close", async () => {
          fastify.log.info("Connection closed.");
          try {
            await chatSDK.destroy;
            fastify.log.info("chatSDK instance destroyed.");
          } catch (error) {
            fastify.log.error(`Error during chatSDK destruction: ${error}`);
          }
        });
      } catch (error) {
        fastify.log.error(`Error during chatSDK initialization: ${error}`);
        chatSDK.destroy;
        socket.close();
      }
    }
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
