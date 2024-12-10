import { WebSocket } from "@fastify/websocket";
import { isSpam } from "../utils/spamUtils";
import { FastifyInstance } from "fastify";

export const handleIncomingEvent = (
  payload: { event: IncomingEvent },
  spamMessages: Map<string, number>,
  socket: WebSocket,
  fastify: FastifyInstance
) => {
  const incomingMessage = payload?.event?.text;
  const incomingType = payload?.event?.type;
  fastify.log.info(`Received message: ${incomingMessage}`);
  if (incomingMessage && incomingType === "message") {
    const spamKey = isSpam(incomingMessage, spamMessages);
    if (spamKey !== null) {
      const currentCount = spamMessages.get(incomingMessage) || 0;
      spamMessages.set(incomingMessage, currentCount + 1);

      const spamCountEvent: EventContract = {
        type: "counter",
        counter: currentCount + 1,
        text: spamKey,
      };

      socket.send(JSON.stringify(spamCountEvent));
    } else {
      const incomingEvent: EventContract = {
        type: "incoming_event",
        text: payload.event.text,
      };

      socket.send(JSON.stringify(incomingEvent));
    }
  }
};

export const handleClientSpamDetection = (
  message: string,
  spamMessages: Map<string, number>,
  socket: WebSocket,
  fastify: FastifyInstance
) => {
  try {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "spam_detected" && parsedMessage.message) {
      const messageContent = parsedMessage.message;
      fastify.log.info(`Detected spam message from client: ${messageContent}`);

      handleSpamDetection(messageContent, spamMessages, socket);
    }
  } catch (error) {
    fastify.log.error(`Error parsing message: ${error}`);
  }
};

const handleSpamDetection = (
  message: string,
  spamMessages: Map<string, number>,
  socket: WebSocket
) => {
  const currentCount = spamMessages.get(message) || 0;
  spamMessages.set(message, currentCount + 1);

  const spamCountEvent: EventContract = {
    type: "counter",
    counter: currentCount + 1,
    text: message,
  };

  socket.send(JSON.stringify(spamCountEvent));
};

//refactor types and change them to generics
export type IncomingEvent = {
  text: string;
  type: string;
};

export type EventContract = {
  type: "counter" | "incoming_event";
  counter?: number;
  text?: string;
};
