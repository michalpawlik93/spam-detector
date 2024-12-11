import { Informations } from "./Informations";

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
    <div className="p-4 bg-white shadow-lg rounded-lg mt-4">
      <Informations />

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Messages:</h3>
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No messages available.</p>
      ) : (
        <ul className="space-y-3">
          {messages.map((msg, index) => {
            const spamCount = spamCounters[msg] || 0;

            return (
              <li
                key={index}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  spamCount > 0 ? "bg-red-100" : "bg-blue-50"
                }`}
              >
                <span className="text-gray-700">{msg}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSpamClick(msg)}
                    disabled={spamCount > 0}
                    className={`px-4 py-2 text-white rounded-lg ${
                      spamCount > 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-400"
                    }`}
                  >
                    Mark as Spam
                  </button>
                  {spamCount > 0 && (
                    <span className="text-sm text-red-500">
                      Spam count: {spamCount}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MessageList;
