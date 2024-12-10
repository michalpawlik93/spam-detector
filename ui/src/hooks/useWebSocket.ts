import { useEffect, useState } from "react";

const useWebSocket = (accessToken: string | null) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (accessToken) {
      const ws = new WebSocket(
        `ws://localhost:3001/hello-ws?access_token=${accessToken}`
      );

      ws.onopen = () => {
        ws.send("Hi from client! Connection established");
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, parsedData.text]);
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.onclose = () => {
        console.log("Connection with web socket closed");
      };

      setSocket(ws);
      return () => {
        ws.close();
      };
    }
  }, [accessToken]);

  return { socket, messages };
};

export default useWebSocket;
