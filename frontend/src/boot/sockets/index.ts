/**
 * GraphQL Socket event handler
 */
import setupMessages from "@/boot/sockets/message.socket";
import setupCollections from "@/boot/sockets/collection.socket";
import { App } from "vue";
import setupUser from "@/boot/sockets/user.socket";
import setupChatAssociation from "@/boot/sockets/chatAssociation.socket";

export function setupSockets(app: App) {
  setupMessages();
  setupChatAssociation();
  setupUser();
  setupCollections(app);
}
