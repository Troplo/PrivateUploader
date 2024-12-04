import { OnUserStatusDocument } from "@/gql/graphql";
import { useUserStore } from "@/store/user.store";
import { useApolloClient, useSubscription } from "@vue/apollo-composable";
import { useUserPresenceStore } from "@/store/userPresence.store";

export default function setup() {
  const userStore = useUserStore();
  const userPresenceStore = useUserPresenceStore();
  const userStatus = useSubscription(OnUserStatusDocument);
  const cache = useApolloClient().client.cache;

  userStatus.onResult(({ data: { onUserStatus } }) => {
    userPresenceStore.updateLocalStatus(onUserStatus.id, onUserStatus.status);
  });
}
