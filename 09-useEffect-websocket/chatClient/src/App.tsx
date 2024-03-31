import { useEffect, JSX } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

const WS_URL = "ws://127.0.0.1:4242";

function App(): JSX.Element {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true,
    }
  );

  // Run when the connection state (readyState) changes
  useEffect(() => {
    console.log("Connection state changed");
    if (readyState === ReadyState.OPEN) {
      console.log("Websocket connection now is open!");
    }
  }, [readyState]);

  // Run when a new WebSocket message is received (lastJsonMessage)
  useEffect(() => {
    if (lastJsonMessage === null) {
      // On init, lastJsonMessage is null. We ignoring it here.
      return;
    }
    console.log(`Got a new message: ${JSON.stringify(lastJsonMessage)}`);
  }, [lastJsonMessage]);
  return <></>;
}

export default App;
