import { Chat, Message } from "@/gql/graphql";

export interface MessageSocket {
  message: Message;
  chat: Chat;
}
