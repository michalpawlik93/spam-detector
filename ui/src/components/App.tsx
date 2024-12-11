import "@livechat/design-system/dist/design-system.css";
import { Loader } from "@livechat/design-system";
import { useAuthorization } from "../hooks/useAuthorization";
import useWebSocket from "../hooks/useWebSocket";
import MessageList from "./MessageList";
import "../assets/index.css";

const AppWithAuth = () => {
  const { accessToken } = useAuthorization({
    client_id: "3013ae66db12c66ea349abeebee43911",
    account_url: "https://accounts.livechatinc.com/",
  });

  const { socket, messages, spamCounters, isServerAvailable } =
    useWebSocket(accessToken);

  if (!accessToken) {
    return <Loader size="small" />;
  }

  return (
    <div className="p-4">
      {!isServerAvailable ? (
        <div className="flex justify-center items-center h-screen bg-orange-100 text-orange-800 font-semibold p-6 rounded-lg border-2 border-orange-300 shadow-xl">
          <div className="text-center">
            <h2 className="text-2xl mb-2">Server is unavailable</h2>
            <p className="text-sm">Reconnecting...</p>
          </div>
        </div>
      ) : (
        <MessageList
          messages={messages}
          socket={socket}
          spamCounters={spamCounters}
        />
      )}
    </div>
  );
};

export default AppWithAuth;
