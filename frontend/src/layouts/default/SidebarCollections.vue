<template>
  <div>
    <CreateCollectionDialog v-model="createCollection" />
    <overline position="start" style="margin-left: 0rem">
      {{ $t("core.sidebar.collections") }}
    </overline>
    <side-bar-item
      class="flex my-1 items-center w-full"
      @click="createCollection = true"
      :item="{
        icon: RiAddLine,
        name: $t('collections.create')
      }"
    ></side-bar-item>
    <div class="pl-1 gap-1 flex items-center">
      <v-text-field
        v-model="search"
        class="flex-grow"
        :label="$t('generic.search')"
      />

      <v-menu location="right">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" style="width: 40px; height: 40px">
            <RiSortDesc v-if="desc" class="action-bar-item" />
            <RiSortAsc v-else class="action-bar-item" />
          </v-btn>
        </template>
        <v-card :padding="false" class="py-1">
          <v-list>
            <overline position="start">
              {{ $t("collections.progressive.sort") }}
            </overline>
            <v-list-item
              :selected="sortOption === SortOption.UPDATED"
              @click="sortOption = SortOption.UPDATED"
            >
              {{ $t("collections.progressive.updated") }}
            </v-list-item>
            <v-list-item
              :selected="sortOption === SortOption.ALPHABETICAL"
              @click="sortOption = SortOption.ALPHABETICAL"
            >
              {{ $t("collections.progressive.alphabetical") }}
            </v-list-item>
            <v-list-item
              :selected="sortOption === SortOption.CREATED_AT"
              @click="sortOption = SortOption.CREATED_AT"
            >
              {{ $t("collections.progressive.createdAt") }}
            </v-list-item>
            <v-list-item
              :selected="sortOption === SortOption.ITEM_COUNT"
              @click="sortOption = SortOption.ITEM_COUNT"
            >
              {{ $t("collections.progressive.itemCount") }}
            </v-list-item>
            <overline position="start">
              {{ $t("collections.progressive.direction") }}
            </overline>
            <v-list-item :selected="!desc" @click="desc = false">
              {{ $t("collections.progressive.asc") }}
            </v-list-item>
            <v-list-item :selected="desc" @click="desc = true">
              {{ $t("collections.progressive.desc") }}
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </div>
    <div class="flex flex-col gap-1">
      <side-bar-item
        to="/collections/manage"
        class="flex items-center w-full"
        v-if="collectionsStore.invites > 0"
      >
        <template #icon>
          <span style="width: 40px">
            <ri-settings5-line class="w-7 ml-2" />
          </span>
        </template>
        <template #title>
          {{ $t("sidebar.collections.invited") }}
          <v-badge color="red" class="rounded-full ml-1">
            {{ collectionsStore.invites }}
          </v-badge>
        </template>
      </side-bar-item>
      <div v-for="collection in filteredCollections" :key="collection.id">
        <side-bar-item
          class="flex items-center w-full"
          :to="`/collections/${collection.id}`"
          @click="collection.new ? updateNew(collection.id) : null"
        >
          <template #icon>
            <user-avatar
              :status="false"
              :user="{
                id: collection.id,
                username: collection.name,
                avatar: collection.avatar || collection.banner
              }"
            ></user-avatar>
          </template>
          <template #title>
            <div class="flex items-center gap-2">
              <div
                class="bg-green rounded-full"
                style="
                  width: 10px;
                  height: 10px;
                  min-height: 10px;
                  min-width: 10px;
                  user-select: none;
                "
                v-if="collection.new"
              />

              {{ collection.name }}
            </div>
          </template>
          <template #subtitle>
            {{ collection.itemCount?.toLocaleString() || 0 }} items
          </template>
        </side-bar-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from "@/components/Users/UserAvatar.vue";
import SideBarItem from "@/layouts/default/SideBarItem.vue";
import {
  RiAddLine,
  RiSettings5Line,
  RiSortAsc,
  RiSortDesc
} from "@remixicon/vue";
import Overline from "@/components/Core/Typography/Overline.vue";
import CreateCollectionDialog from "@/components/Collections/Dialogs/Create.vue";
import { useAppStore } from "@/store/app.store";
import { useCollectionsStore } from "@/store/collections.store";
import { computed, ref, watch } from "vue";

const appStore = useAppStore();
const collectionsStore = useCollectionsStore();

const search = ref("");
enum SortOption {
  UPDATED,
  ALPHABETICAL,
  CREATED_AT,
  ITEM_COUNT
}
const desc = ref(localStorage.getItem("sidebarCollectionsDesc") !== "false");
watch(
  () => desc.value,
  (val) => {
    localStorage.setItem("sidebarCollectionsDesc", val.toString());
  }
);
const sortOption = ref<SortOption>(
  parseInt(
    localStorage.getItem("sidebarCollectionsSort") ||
      SortOption.UPDATED.toString()
  )
);
watch(
  () => sortOption.value,
  (val) => {
    localStorage.setItem("sidebarCollectionsSort", val.toString());
  }
);
const filteredCollections = computed(() => {
  const items = collectionsStore.persistent.slice().sort((a, b) => {
    const left = desc.value ? b : a;
    const right = desc.value ? a : b;

    switch (sortOption.value) {
      case SortOption.ITEM_COUNT:
        return (left.itemCount || 0) - (right.itemCount || 0);
      case SortOption.UPDATED:
        return (
          (left.preview?.createdAt
            ? new Date(left.preview.createdAt).getTime()
            : new Date(left.updatedAt).getTime()) -
          (right.preview?.createdAt
            ? new Date(right.preview.createdAt).getTime()
            : new Date(right.updatedAt).getTime())
        );
      case SortOption.ALPHABETICAL:
        return right.name.localeCompare(left.name);
      case SortOption.CREATED_AT:
        return (
          new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime()
        );
    }
  });
  return items.filter((collection) =>
    collection.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const createCollection = ref(false);

function updateNew(id: number) {
  collectionsStore.persistent = collectionsStore.persistent.map(
    (collection) => {
      if (collection.id === id) {
        collection.new = false;
      }
      return collection;
    }
  );
}
</script>

<style scoped></style>
