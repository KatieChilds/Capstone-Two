import React from "react";
import {
  WeavyClient,
  WeavyProvider,
  Messenger,
} from "@weavy/uikit-react";

const weavyClient = new WeavyClient({
  url: "{WEAVY_ENVIRONMENT_URL}",
  tokenFactory: async () => "{ACCESS_TOKEN}",
});

const Chat = () => {
  return (
    <div className="Chat">
      <WeavyProvider client={weavyClient}>
        <Messenger uid="demochat" />
      </WeavyProvider>
    </div>
  );
};

export default Chat;
