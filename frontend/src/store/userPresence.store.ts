import { ref } from "vue";
import {
  BlockedUsersQuery,
  CurrentUserDocument,
  FriendsQuery,
  TrackedUsersDocument,
  TrackedUsersQuery,
  UserStatus,
  UserStoredStatus
} from "@/gql/graphql";
import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { useUserStore } from "@/store/user.store";

export const useUserPresenceStore = defineStore("presence", () => {
  const tracked = ref<TrackedUsersQuery["trackedUsers"]>([]);
  const blocked = ref<BlockedUsersQuery["blockedUsers"]>([]);
  const apolloClient = useApolloClient();
  const cache = apolloClient.client.cache;
  const userStore = useUserStore();

  async function getTracked() {
    const trackedCache = localStorage.getItem("trackedUsersStore");
    if (trackedCache) {
      try {
        tracked.value = JSON.parse(trackedCache);
      } catch {
        //
      }
    }
    const {
      data: { trackedUsers }
    } = await useApolloClient().client.query({
      query: TrackedUsersDocument
    });
    tracked.value = trackedUsers;
    localStorage.setItem("trackedUsersStore", JSON.stringify(trackedUsers));
  }

  async function updateLocalStatus(
    id: number,
    status: UserStatus,
    storedStatus?: UserStoredStatus
  ) {
    if (!userStore.user) return;
    if (id === userStore.user.id) {
      // Update currentUser
      cache.writeQuery({
        query: CurrentUserDocument,
        data: {
          currentUser: {
            ...userStore.user,
            status,
            storedStatus:
              storedStatus || status === UserStatus.Offline
                ? UserStoredStatus.Invisible
                : (status as unknown as UserStoredStatus)
          }
        }
      });
      await userStore.getCurrentUser();
    }
    // Update tracked users
    cache.modify({
      id: `PartialUserFriend:${id}`,
      fields: {
        status: () => status
      }
    });
    await getTracked();
  }

  return {
    tracked,
    blocked,
    getTracked,
    updateLocalStatus
  };
});
