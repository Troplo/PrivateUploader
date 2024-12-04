import { defineStore } from "pinia";
import {
  AnnouncementsDocument,
  type AnnouncementsInput,
  type AnnouncementsQuery,
  type AnnouncementQuery,
  AnnouncementDocument
} from "@/troploservices-gql/graphql";
import { nextTick, onMounted, ref, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useDisplay } from "vuetify";

export const useAnnouncementsStore = defineStore("announcements", () => {
  const banners = ref<AnnouncementsQuery["announcements"]["items"]>([]);
  const announcements = ref<AnnouncementsQuery["announcements"]["items"]>([]);
  const mainPageAnnouncement = ref<AnnouncementQuery["announcement"] | null>(
    null
  );
  const apolloClient = useApolloClient("troploservices");

  async function getAnnouncements(
    input: AnnouncementsInput = {}
  ): Promise<AnnouncementsQuery["announcements"]> {
    const { data } = await apolloClient.client.query({
      query: AnnouncementsDocument,
      variables: { input },
      fetchPolicy: "network-only"
    });
    return data.announcements;
  }

  const navbarOffset = ref(64);
  const display = useDisplay();

  watch(
    () => [banners.value, display.width.value, display.height.value],
    async () => {
      await nextTick(() => {
        let offset = 64;
        for (const banner of banners.value) {
          const element = document.getElementById(`banner-${banner.id}`);
          if (element) {
            offset += element.clientHeight;
          }
        }
        navbarOffset.value = offset;
      });
    }
  );

  async function getAnnouncement(
    announcementId?: string,
    showOnMainPage?: boolean
  ): Promise<AnnouncementQuery["announcement"]> {
    const { data } = await apolloClient.client.query({
      query: AnnouncementDocument,
      variables: { showOnMainPage, announcementId }
    });
    return data.announcement;
  }

  onMounted(() => {
    getAnnouncement(undefined, true).then((a) => {
      mainPageAnnouncement.value = a;
    });
  });

  return {
    banners,
    getAnnouncements,
    navbarOffset,
    announcements,
    getAnnouncement,
    mainPageAnnouncement
  };
});
