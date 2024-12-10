import { useState } from "react";

const MessageList = ({
  messages,
  socket,
}: {
  messages: string[];
  socket: WebSocket | null;
}) => {
  const [spamCounters, setSpamCounters] = useState<{ [key: string]: number }>(
    {}
  );

  const handleSpamClick = (message: string) => {
    setSpamCounters((prevCounters) => ({
      ...prevCounters,
      [message]: (prevCounters[message] || 0) + 1,
    }));

    if (socket) {
      socket.send(`SPAM detected: ${message}`);
    }
  };

  return (
    <div>
      <h3>Messages:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <span>{msg}</span>
            <button onClick={() => handleSpamClick(msg)}>Mark as Spam</button>
            <span> - Spam count: {spamCounters[msg] || 0}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessageList;
