// @ts-ignore
import ChatSDK from "@livechat/chat-sdk";

const chatSDKInstance = new ChatSDK({
  debug: true,
});

export const chatSDK = chatSDKInstance;
