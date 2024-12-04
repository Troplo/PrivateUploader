// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { UnreadMailQuery } from "@/graphql/mail/unreadMail.graphql";
import { useApolloClient } from "@vue/apollo-composable";

export interface MailState {
  // temp
  mailboxes: any[];
  drawer: boolean;
  mailboxDrawer: boolean;
  selectedMailbox: string;
  loading: boolean;
  unread: number;
}

export interface Email {
  uid: number;
  from: {
    name: string;
    address: string;
  }[];
  to: {
    name: string;
    address: string;
  }[];
  subject: string;
}

export const useMailStore = defineStore("mail", {
  state: () =>
    ({
      mailboxes: [],
      drawer: true,
      mailboxDrawer: true,
      selectedMailbox: "INBOX",
      loading: false,
      unread: 0
    } as MailState),
  actions: {
    getSender(email: Email) {
      return email?.from?.[0]?.name || email?.from?.[0]?.address || "Unknown";
    },
    async getMessages(mailbox: string, page: number) {
      const { data } = await axios().get(`/mail/mailbox/${mailbox}/${page}`);
      this.selected.emails = data;
      this.loading = false;
    },
    async setMailbox(mailbox: string) {
      this.loading = true;
      this.selectedMailbox = mailbox;
      await this.getMessages(mailbox, 1);
    },
    async getMailboxes() {
      const response = await axios().get("/mail/mailboxes");
      this.mailboxes = response.data;

      const apolloClient = useApolloClient();
      const { data } = await apolloClient.client.query({
        query: UnreadMailQuery
      });
      this.unread = data.unreadMail;
    },
    async init() {
      this.getMailboxes();
    }
  },
  getters: {
    selected(state: MailState) {
      return state.mailboxes.find(
        (mailbox) => mailbox.name === state.selectedMailbox
      );
    }
  }
});
