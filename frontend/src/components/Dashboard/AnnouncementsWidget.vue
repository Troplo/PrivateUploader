<template>
  <v-card class="text-center justify-center">
    <v-container>
      <span>
        <strong class="text-gradient" style="font-size: 24px">
          {{ $t("dashboard.announcements") }}
        </strong>
        <v-btn
          v-if="$user.user?.administrator"
          icon
          size="x-small"
          style="margin-top: -0.25rem"
          class="ml-1"
          @click="newAnnouncement"
        >
          <v-icon>add-line</v-icon>
        </v-btn>
      </span>
      <v-card
        v-for="announcement in announcements"
        :key="announcement.id"
        :color="$vuetify.theme.global.name === 'amoled' ? undefined : 'toolbar'"
        :variant="
          $vuetify.theme.global.name === 'amoled' ? 'outlined' : undefined
        "
        class="my-3 pt-3 hover"
        elevation="0"
      >
        <UserAvatar
          :user="announcement.user"
          size="58"
          style="cursor: pointer"
          @click="
            $router.push(`/u/${announcement.user?.username || 'Flowinity'}`)
          "
        />
        <v-card-title
          style="cursor: pointer"
          @click="
            $router.push(`/u/${announcement.user?.username || 'Flowinity'}`)
          "
        >
          {{ announcement.user?.username || "Flowinity Staff" }}
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-if="announcement.editing"
            v-model="announcement.content"
            auto-grow
            variant="underlined"
            color="primary"
            label="Content"
            autofocus
            class="mb-4"
          >
            <template #append>
              <div class="d-flex flex-column">
                <v-btn
                  icon
                  size="x-small"
                  :loading="loading"
                  @click="
                    announcement.new
                      ? createAnnouncement(announcement)
                      : submitEdit(announcement)
                  "
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
                <v-btn
                  icon
                  class="mt-1"
                  size="x-small"
                  :loading="loading"
                  @click="
                    announcement.editing = false;
                    $app.init();
                  "
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </div>
            </template>
            <template #details>
              May take a few seconds for changes to appear for everyone.
            </template>
          </v-textarea>
          <p
            v-memo="announcement.content"
            class="mb-1 mt-n1"
            v-html="$functions.markdownEmail(announcement.content)"
          />
          <small>
            {{
              $date(announcement.createdAt).format("Do of MMMM YYYY, h:mm A")
            }}
          </small>
          <template v-if="!announcement.editing && $user.user?.administrator">
            <v-btn
              v-if="announcement.userId === $user.user?.id"
              icon
              size="x-small"
              class="ml-1"
              @click="announcement.editing = true"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              size="x-small"
              class="ml-2"
              :loading="loading"
              @click="deleteAnnouncement(announcement)"
            >
              <v-icon>close-line</v-icon>
            </v-btn>
          </template>
        </v-card-text>
      </v-card>
      <v-pagination v-model="page" :length="pages" />
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { Announcement } from "@/models/announcement";

export default defineComponent({
  components: { UserAvatar },
  data() {
    return {
      page: 1,
      loading: false,
      demo: [
        {
          id: 1,
          userId: 1,
          content: "Welcome to PrivateUploader.",
          type: null,
          createdAt: "2023-01-21T15:36:45.000Z",
          updatedAt: "2023-01-21T15:36:45.000Z",
          user: {
            id: 1,
            username: "Troplo",
            avatar: "3c0926363bc9.png",
            moderator: false,
            administrator: true
          }
        }
      ]
    };
  },
  computed: {
    announcements() {
      // limit 3 per page, get pages
      const announcements = this.$app.demo
        ? this.demo
        : this.$app.site.announcements;
      return announcements.slice((this.page - 1) * 3, this.page * 3);
    },
    pages() {
      const announcements = this.$app.demo
        ? this.demo
        : this.$app.site.announcements;
      return Math.ceil(announcements.length / 3);
    }
  },
  methods: {
    newAnnouncement() {
      this.$app.site.announcements.unshift({
        id: new Date().getTime(),
        userId: this.$user.user?.id,
        content: "",
        type: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: this.$user.user,
        editing: true,
        new: true
      });
    },
    async submitEdit(announcement: Announcement) {
      this.loading = true;
      console.log(announcement);
      const { data } = await this.axios.patch(`/admin/announcement`, {
        content: announcement.content,
        id: announcement.id
      });
      announcement.editing = false;
      announcement.content = data.content;
      this.loading = false;
    },
    async deleteAnnouncement(announcement: Announcement) {
      this.loading = true;
      await this.axios.delete(`/admin/announcement/${announcement.id}`);
      this.$app.site.announcements.splice(
        this.$app.site.announcements.indexOf(announcement),
        1
      );
      this.loading = false;
    },
    async createAnnouncement(announcement: Announcement) {
      this.loading = true;
      await this.axios.post("/admin/announcement", {
        content: announcement.content
      });
      announcement.editing = false;
      announcement.new = false;
      this.loading = false;
    }
  }
});
</script>

<style scoped>
.hover {
  background: transparent !important;
}

.hover:hover {
  background: rgba(0, 0, 0, 0.1) !important;
}
</style>
