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
        {messages.map((msg, index) => {
          const spamCount = spamCounters[msg] || 0;

          return (
            <li key={index}>
              <span>{msg}</span>
              <button
                onClick={() => handleSpamClick(msg)}
                disabled={spamCount > 0}
              >
                Mark as Spam
              </button>
              {spamCount > 0 && <span> - Spam count: {spamCount}</span>}{" "}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MessageList;
