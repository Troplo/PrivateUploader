/**
 * GraphQL Socket event handler
 */
import setupMessages from "@/boot/sockets/message.socket";
import setupCollections from "@/boot/sockets/collection.socket";
import { App } from "vue";
import setupUser from "@/boot/sockets/user.socket";
import setupChatAssociation from "@/boot/sockets/chatAssociation.socket";

export function setupSockets(app: App) {
  if (
    app.config.globalProperties.$experiments.experiments.REMOVE_LEGACY_SOCKET
  ) {
    setupMessages();
    setupChatAssociation();
    setupUser();
  }
  console.log(
    `[Flowinity/Socket] Force new socket setup: ${app.config.globalProperties.$experiments.experiments.REMOVE_LEGACY_SOCKET}`
  );
  setupCollections(app);
}
