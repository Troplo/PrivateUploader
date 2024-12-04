import { useSubscription } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { useCollectionsStore } from "@/store/collections.store";
import { gql } from "@apollo/client/core";
import { App } from "vue";
import {
  OnCollectionCreatedDocument,
  OnCollectionRemovedDocument,
  OnCollectionUpdatedDocument
} from "@/gql/graphql";

export default function setup(app: App) {
  const collectionsStore = useCollectionsStore();

  useSubscription(
    OnCollectionRemovedDocument,
    {},
    {
      context: {
        noToast: true
      }
    }
  ).onResult(({ data }) => {
    if (collectionsStore.selected?.id === data.onCollectionRemoved) {
      app.config.globalProperties.$router.push("/gallery");
    }
    collectionsStore.persistent = collectionsStore.persistent.filter(
      (c) => c.id !== data.onCollectionRemoved
    );
  });

  useSubscription(
    OnCollectionCreatedDocument,
    {},
    {
      context: {
        noToast: true
      }
    }
  ).onResult(({ data }) => {
    collectionsStore.persistent = [
      {
        ...data.onCollectionCreated,
        new: true
      },
      ...collectionsStore.persistent
    ];
  });

  useSubscription(
    OnCollectionUpdatedDocument,
    {},
    {
      context: {
        noToast: true
      }
    }
  ).onResult(({ data }) => {
    const index = collectionsStore.persistent.findIndex(
      (c) => c.id === data.onCollectionUpdated.id
    );
    if (index === -1) return;
    const collection = {
      ...collectionsStore.items[index],
      ...data.onCollectionUpdated
    };
    collectionsStore.persistent = [
      ...collectionsStore.persistent.slice(0, index),
      collection,
      ...collectionsStore.persistent.slice(index + 1)
    ];
  });

  useSubscription(
    gql`
      subscription CollectionInviteCountSubscription {
        onCollectionInviteCount
      }
    `,
    {},
    {
      context: {
        noToast: true
      }
    }
  ).onResult(({ data }) => {
    collectionsStore.invites = data.onCollectionInviteCount;
  });
}
