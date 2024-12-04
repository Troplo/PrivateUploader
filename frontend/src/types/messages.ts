import { Message } from "@/models/message";
import { Chat } from "@/models/chat";

export interface MessageSocket {
  message: Message;
  chat: Chat;
}
