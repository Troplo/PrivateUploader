import { useUserStore } from "@/store/user.store";
import { useSubscription } from "@vue/apollo-composable";
import { UserStatusSubscription } from "@/graphql/user/subscriptions/status.graphql";

export default function setup() {
  const userStore = useUserStore();
  const userStatus = useSubscription(UserStatusSubscription);

  userStatus.onResult(({ data: { onUserStatus } }) => {
    const index = userStore.tracked.findIndex((f) => f.id === onUserStatus.id);

    if (index === -1) return;
    userStore.tracked[index].status = onUserStatus.status;
    userStore.tracked[index].platforms = onUserStatus.platforms;
  });
}
