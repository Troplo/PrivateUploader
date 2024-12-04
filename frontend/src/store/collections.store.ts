// Utilities
import { defineStore } from "pinia";
import { CollectionCache } from "@/types/collection";
import {
  UserCollectionsQuery,
  UserLightCollectionsQuery
} from "@/graphql/collections/getUserCollections.graphql";
import { CollectionQuery } from "@/graphql/collections/getCollection.graphql";
import {
  Collection,
  CollectionInput,
  Pager,
  UserCollectionsInput
} from "@/gql/graphql";
import { useApolloClient, useMutation } from "@vue/apollo-composable";
import { useRoute } from "vue-router";
import { isNumeric } from "@/plugins/isNumeric";
import { computed, ref } from "vue";
import {
  AddToCollectionMutation,
  RemoveFromCollectionMutation
} from "@/graphql/collections/addToCollection.graphql";

export const useCollectionsStore = defineStore("collections", () => {
  const route = useRoute();
  const items = ref<CollectionCache[]>([]);
  const pager = ref<Pager>({
    currentPage: 0,
    endIndex: 0,
    endPage: 0,
    pageSize: 0,
    pages: [],
    startIndex: 0,
    startPage: 0,
    totalPages: 0,
    totalItems: 0
  });
  const complete = ref(false);
  const page = ref(1);
  const persistent = ref<
    {
      id: number;
      name: string;
      permissionsMetadata: {
        write: boolean;
        read: boolean;
        configure: boolean;
      };
      avatar: string | null;
      banner: string | null;
      itemCount: number;
      createdAt: string;
      image: string | null;
      updatedAt: string;
      new: boolean | undefined;
      preview: {
        createdAt: string;
        attachment: {
          id: number;
          attachment: string;
        };
      };
      shareLink: string | null;
    }[]
  >([]);
  const invites = ref(0);

  const write = computed(() => {
    return persistent.value.filter(
      (c) => c.permissionsMetadata.write || c.permissionsMetadata.configure
    );
  });

  const selected = computed(() => {
    if (!route.path.startsWith("/collections/")) return;
    const id: string | number = isNumeric(<string>route.params.id)
      ? parseInt(<string>route.params.id)
      : <string>route.params.id;
    return persistent.value.find(
      (collection) =>
        (typeof id === "number" && collection.id === id) ||
        collection.shareLink === id
    );
  });

  async function getCollections(
    input: UserCollectionsInput,
    store = true,
    reset = false
  ) {
    if (reset) page.value = 1;
    const {
      data: { collections }
    } = await useApolloClient().client.query({
      query: UserCollectionsQuery,
      variables: {
        input: {
          ...input,
          page: page.value,
          limit: 24
        }
      }
    });
    if (store && !reset) {
      items.value.push(...collections.items);
      pager.value = collections.pager;
    } else if (store && reset) {
      items.value = collections.items;
      pager.value = collections.pager;
    }
    if (!collections.items.length) {
      complete.value = true;
    }
    return collections;
  }

  async function getCollection(
    id: number | string
  ): Promise<Collection | null> {
    const {
      data: { collection }
    } = await useApolloClient().client.query({
      query: CollectionQuery,
      fetchPolicy: "network-only",
      variables: {
        input: {
          id: typeof id === "string" ? undefined : id,
          shareLink: typeof id === "string" ? id : undefined
        }
      } as CollectionInput
    });
    return collection;
  }

  async function init() {
    const {
      data: { collections }
    } = await useApolloClient().client.query({
      query: UserLightCollectionsQuery,
      fetchPolicy: "network-only",
      variables: {
        input: {}
      }
    });
    if (collections) {
      persistent.value = collections.items;
    }
  }

  async function addToCollection(collectionId: number, items: number[]) {
    const data = useMutation(AddToCollectionMutation, {
      variables: {
        input: {
          collectionId,
          items
        }
      }
    });
    return await data.mutate();
  }

  async function removeFromCollection(collectionId: number, items: number[]) {
    const data = useMutation(RemoveFromCollectionMutation, {
      variables: {
        input: {
          collectionId,
          items
        }
      }
    });
    return await data.mutate();
  }

  return {
    items,
    pager,
    complete,
    page,
    persistent,
    invites,
    write,
    selected,
    getCollections,
    getCollection,
    init,
    addToCollection,
    removeFromCollection
  };
});
