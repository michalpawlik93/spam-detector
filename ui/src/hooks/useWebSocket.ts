import { useEffect, useState } from "react";

const useWebSocket = (accessToken: string | null) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [spamCounters, setSpamCounters] = useState<{ [key: string]: number }>(
    {}
  );
  const [isServerAvailable, setIsServerAvailable] = useState<boolean>(false);

  const checkServerAvailability = async () => {
    try {
      const response = await fetch("http://localhost:3001/health");
      if (response.ok) {
        console.log("Server is available");
        setIsServerAvailable(true);
      } else {
        console.warn("Server responded with a non-OK status");
        setIsServerAvailable(false);
      }
    } catch (error) {
      console.error("Failed to connect to the server:", error);
      setIsServerAvailable(false);
    }
  };

  useEffect(() => {
    if (accessToken && !isServerAvailable) {
      const intervalId = setInterval(() => {
        checkServerAvailability();
      }, 5000);

      if (isServerAvailable) {
        clearInterval(intervalId);
      }

      return () => clearInterval(intervalId);
    }
  }, [accessToken, isServerAvailable]);

  useEffect(() => {
    if (accessToken && isServerAvailable) {
      const ws = new WebSocket(
        `ws://localhost:3001/hello-ws?access_token=${accessToken}`
      );

      ws.onopen = () => {
        console.log("WebSocket connection established");
        ws.send("Hi from client! Connection established");
      };

      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          if (parsedData.type === "counter") {
            setSpamCounters((prevCounters) => ({
              ...prevCounters,
              [parsedData.text]: parsedData.counter,
            }));
          } else if (parsedData.type === "incoming_event") {
            setMessages((prevMessages) => [...prevMessages, parsedData.text]);
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed, attempting reconnection...");
        setSocket(null);
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [accessToken, isServerAvailable]);

  return { socket, messages, spamCounters, isServerAvailable };
};

export default useWebSocket;
