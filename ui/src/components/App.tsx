import "../assets/App.css";
import "@livechat/design-system/dist/design-system.css";
import { Loader } from "@livechat/design-system";
import { useAuthorization } from "../hooks/useAuthorization";
import useWebSocket from "../hooks/useWebSocket";
import MessageList from "./MessageList";

const AppWithAuth = () => {
  const [accessToken] = useAuthorization({
    client_id: "3013ae66db12c66ea349abeebee43911",
    account_url: "https://accounts.livechatinc.com/",
  });

  const { socket, messages, spamCounters } = useWebSocket(accessToken);

  if (!accessToken) {
    return <Loader size="small" />;
  }

  return (
    <div>
      <h1>Hello there!</h1>
      <MessageList
        messages={messages}
        socket={socket}
        spamCounters={spamCounters}
      />
    </div>
  );
};

export default AppWithAuth;
