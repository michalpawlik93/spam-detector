const MessageList = ({
  messages,
  socket,
  spamCounters,
}: {
  messages: string[];
  socket: WebSocket | null;
  spamCounters: { [key: string]: number };
}) => {
  const handleSpamClick = (message: string) => {
    if (socket) {
      const spamMessageEvent = JSON.stringify({
        type: "spam_detected",
        message: message,
      });
      socket.send(spamMessageEvent);
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
