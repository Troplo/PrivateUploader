<template>
  <template v-if="appStore.site?.officialInstance">
    <Banner :announcement="announcement" />
    <NewsItem :announcement="announcement" />
    <teleport
      to="#appbar-options"
      v-if="
        uiStore.ready &&
        (userStore.user?.administrator || userStore.user?.moderator)
      "
    >
      <accessible-transition mode="out-in" name="slide-up" appear>
        <div class="flex gap-2">
          <v-btn
            icon
            size="small"
            :href="`https://troplo.com/admin/announcements/${announcement?.id}`"
            target="_blank"
          >
            <RiPencilLine />
            <v-tooltip location="bottom" activator="parent">
              Edit on Troplo.com
            </v-tooltip>
          </v-btn>
        </div>
      </accessible-transition>
    </teleport>
  </template>
</template>

<script setup lang="ts">
import { useApolloClient } from "@vue/apollo-composable";
import {
  AnnouncementDocument,
  type AnnouncementQuery
} from "@/troploservices-gql/graphql";
import Banner from "@/components/News/Banner.vue";
import NewsItem from "@/components/News/NewsItem.vue";
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { RailMode, useProgressiveUIStore } from "@/store/progressive.store";
import { RiNewsLine, RiPencilLine } from "@remixicon/vue";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import { useUserStore } from "@/store/user.store";
import { useAppStore } from "@/store/app.store";

const route = useRoute();
const id = ref<string>(route.params.id as string);
const apollo = useApolloClient("troploservices");
const announcement = ref<AnnouncementQuery["announcement"]>();
const uiStore = useProgressiveUIStore();
const userStore = useUserStore();
const appStore = useAppStore();

async function getAnnouncement() {
  const { data } = await apollo.client.query({
    query: AnnouncementDocument,
    variables: { announcementId: id.value }
  });
  announcement.value = data.announcement as AnnouncementQuery["announcement"];
  uiStore._currentNavItem = {
    item: {
      name: announcement.value?.title || "News item",
      icon: RiNewsLine,
      path: `/news/${id.value}`
    },
    rail: [
      uiStore.navigation.options[RailMode.HOME].find(
        (item) => item.path === "/news"
      )
    ]
  };
}

onMounted(() => {
  getAnnouncement();
});

watch(
  () => id.value,
  () => {
    getAnnouncement();
  }
);
</script>

<style scoped></style>
