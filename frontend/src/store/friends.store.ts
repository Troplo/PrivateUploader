// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import {
  AddFriendDocument,
  AddFriendInput,
  Friend,
  FriendAction,
  FriendsDocument,
  FriendStatus,
  PartialUserBase,
  PartialUserFriend,
  User
} from "@/gql/graphql";
import { useUserStore } from "@/store/user.store";
import { useApolloClient } from "@vue/apollo-composable";
import { useAppStore } from "@/store/app.store";

export interface FriendsState {
  friends: Friend[];
}

export const useFriendsStore = defineStore("friends", {
  state: () =>
    ({
      friends: []
    } as FriendsState),
  getters: {
    validFriends() {
      return this.friends.filter(
        (friend) => friend.status === FriendStatus.Accepted
      );
    },
    incomingFriends() {
      return this.friends.filter(
        (friend) => friend.status === FriendStatus.Incoming
      );
    }
  },
  actions: {
    friendStatus(userId: number) {
      return (
        this.friends.find((friend) => friend.friendId === userId)?.status ||
        FriendStatus.None
      );
    },
    getName(
      user: PartialUserFriend | PartialUserBase | User | number,
      force = false
    ) {
      if (!user) return undefined;
      const userStore = useUserStore();
      const id = typeof user === "number" ? user : user?.id;
      const friend = userStore.users[id];
      if (friend) {
        return !force
          ? friend.nickname?.nickname || friend.username
          : friend.nickname?.nickname;
      }
      if (typeof user === "number") {
        return undefined;
      }
      return user.username;
    },
    async getFriends() {
      const friendsCache = localStorage.getItem("friendsStore");
      if (friendsCache) {
        try {
          this.friends = JSON.parse(friendsCache);
        } catch {
          //
        }
      }
      const {
        data: { friends }
      } = await useApolloClient().client.query({
        query: FriendsDocument,
        fetchPolicy: "network-only"
      });
      const userStore = useUserStore();
      this.friends = friends;
      localStorage.setItem("friendsStore", JSON.stringify(this.friends));
    },
    async actFriend(userId: number) {
      await axios().post(`/user/friends/${userId}`);
      await this.getFriends();
      return true;
    },
    async init() {
      this.getFriends();
    },
    async actOnFriend(friendId: number | string, action: FriendAction) {
      const apolloClient = useApolloClient();
      await apolloClient.client.mutate({
        mutation: AddFriendDocument,
        variables: {
          input: {
            userId: typeof friendId === "number" ? friendId : undefined,
            username: typeof friendId === "string" ? friendId : undefined,
            action
          } as AddFriendInput
        }
      });
    }
  }
});
