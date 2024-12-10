import { FastifyInstance, FastifyRequest } from "fastify";
import { chatSDK } from "../utils/sdkUtils";

interface QueryParams {
  access_token: string;
}
export default async function integrationRoutes(fastify: FastifyInstance) {
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
        await sleep(2000); // bad look for callback or async
        fastify.log.info("Connection established.");

        const handleIncomingEvent = ({
          payload,
        }: {
          payload: { event: IncomingEvent };
        }) => {
          const incomingMessage = payload?.event?.text;
          if (incomingMessage) {
            const event = JSON.stringify({ text: incomingMessage });
            fastify.log.info(event);
            socket.send(event);
          }
        };
        chatSDK.on("incoming_event", handleIncomingEvent);

        socket.on("message", async (message) => {
          fastify.log.info(`Received message:${message}`);
          // try {
          //   const agentData = await chatSDK.getAgentDetails();
          //   socket.send(JSON.stringify(agentData));
          // } catch (error) {
          //   socket.send("Error fetching agent details");
          //   fastify.log.error("getAgentDetails error:");
          //   fastify.log.error(error);
          // }
        });

        socket.on("close", async () => {
          fastify.log.info("Connection closed.");
          try {
            await chatSDK.destroy();
            fastify.log.info("chatSDK instance destroyed.");
          } catch (error) {
            fastify.log.error(`Error during chatSDK destruction: ${error}`);
          }
        });
      } catch (error) {
        fastify.log.error("Error during chatSDK destruction: ${error}");
        chatSDK.destroy();
        socket.close();
      }
    }
  );
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
type IncomingEvent = {
  text: string;
};
