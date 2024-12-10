import "../assets/App.css";
import "@livechat/design-system/dist/design-system.css";
import { Loader } from "@livechat/design-system";
import { useAuthorization } from "../hooks/useAuthorization";
import useWebSocket from "../hooks/useWebSocket";

const AppWithAuth = () => {
  const [accessToken] = useAuthorization({
    client_id: "3013ae66db12c66ea349abeebee43911",
    account_url: "https://accounts.livechatinc.com/",
  });

  const [socket, message] = useWebSocket(accessToken);

  if (!accessToken) {
    return <Loader size="small" />;
  }

  return (
    <div>
      <h1>Access Token: {accessToken}</h1>
      <h2>Received message from socket: {message}</h2>
      <button
        onClick={() => (socket as WebSocket)?.send("Client is sending data...")}
      >
        Send message to server
      </button>
    </div>
  );
};

export default AppWithAuth;
