// @ts-ignore
import ChatSDK from "@livechat/chat-sdk";

export const chatSDKInstance = new ChatSDK({
  debug: true,
});

export const chatSDK = chatSDKInstance;
