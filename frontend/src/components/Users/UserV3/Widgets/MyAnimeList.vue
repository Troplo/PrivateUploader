<template>
  <v-card class="mx-2 my-5">
    <v-toolbar>
      <v-toolbar-title>
        <span>
          MAL
          <v-tooltip :eager="false" location="top" activator="parent">
            MyAnimeList
          </v-tooltip>
        </span>
        <template v-if="!loading && malUser">
          &bullet;
          {{ malUser.anime_statistics.num_episodes.toLocaleString() }}
          episodes &bullet;
          {{ malUser.anime_statistics.num_days_watched.toLocaleString() }}
          days
        </template>
      </v-toolbar-title>
      <v-btn
        icon
        :href="`https://myanimelist.net/profile/${malUser?.name}`"
        target="_blank"
        :disabled="!malUser?.name"
      >
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      <v-btn
        icon
        :disabled="page === 1"
        @click="page > 1 ? page-- : (page = 1)"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="getMAL">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn icon :disabled="page >= pages" @click="page < pages ? page++ : ''">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-toolbar>
    <template v-if="!loading">
      <v-list>
        <v-list-item
          v-for="anime in computedRecent"
          :key="anime.node.id"
          target="_blank"
        >
          <template #prepend>
            <a
              target="_blank"
              rel="noopener"
              :href="`https://myanimelist.net/anime/${anime.node.id}`"
            >
              <v-img
                :src="anime.node.main_picture.medium"
                class="mr-3"
                width="40"
              />
            </a>
          </template>
          <v-list-item-title
            tag="a"
            style="color: unset"
            target="_blank"
            rel="noopener"
            :href="`https://myanimelist.net/anime/${anime.node.id}`"
          >
            {{ anime.node.title }}
          </v-list-item-title>
          <v-progress-linear
            :color="getStatusColor(anime.node.my_list_status.status)"
            :model-value="
              (anime.node.my_list_status.num_episodes_watched /
                anime.node.num_episodes) *
              100
            "
            class="mt-1"
            height="20"
          >
            <strong
              :class="
                (anime.node.my_list_status.num_episodes_watched /
                  anime.node.num_episodes) *
                  100 <=
                60
                  ? 'white-text'
                  : 'text-black'
              "
              style="font-size: 14px"
            >
              {{ anime.node.my_list_status.num_episodes_watched }}/{{
                anime.node.num_episodes
              }}
              ({{ anime.node.my_list_status.score || "-" }}/10)
            </strong>
          </v-progress-linear>
          <v-select
            v-model="anime.node.my_list_status.status"
            :disabled="user.id !== $user.user?.id"
            :items="statuses"
            bg-color="transparent"
            class="mt-n3"
            item-title="text"
            item-value="value"
            @update:model-value="
              updateAnime(
                anime.node.id,
                anime.node.my_list_status.num_episodes_watched,
                anime.node.my_list_status.score,
                $event
              )
            "
          >
            <template #append>
              <div style="display: flex; align-items: center">
                {{ $date(anime.node.my_list_status.updated_at).fromNow() }}
                <template
                  v-if="
                    user.id === $user.user?.id &&
                    anime.node.my_list_status.status === 'watching'
                  "
                >
                  <v-btn
                    :loading="partialLoading"
                    icon
                    size="x-small"
                    @click="
                      updateAnime(
                        anime.node.id,
                        anime.node.my_list_status.num_episodes_watched - 1,
                        anime.node.my_list_status.score,
                        anime.node.my_list_status.status
                      )
                    "
                  >
                    <v-icon>mdi-minus</v-icon>
                    <v-tooltip :eager="false" activator="parent" location="top">
                      Decrease watched episode count
                    </v-tooltip>
                  </v-btn>
                  <v-btn
                    :loading="partialLoading"
                    icon
                    size="x-small"
                    @click="
                      updateAnime(
                        anime.node.id,
                        anime.node.my_list_status.num_episodes_watched + 1,
                        anime.node.my_list_status.score,
                        anime.node.my_list_status.status
                      )
                    "
                  >
                    <v-icon>mdi-plus</v-icon>
                    <v-tooltip :eager="false" activator="parent" location="top">
                      Increase watched episode count
                    </v-tooltip>
                  </v-btn>
                </template>
              </div>
            </template>
          </v-select>
        </v-list-item>
      </v-list>
    </template>
    <template v-else>
      <MessageSkeleton />
    </template>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MessageSkeleton from "@/components/Communications/MessageSkeleton.vue";
import { MalUser } from "@/types/mal/user";
import { MalAnime } from "@/types/mal/anime";

export default defineComponent({
  components: { MessageSkeleton },
  props: ["user", "component"],
  data() {
    return {
      recent: [] as MalAnime[],
      page: 1,
      malUser: null as MalUser | null,
      loading: true,
      partialLoading: false,
      ratings: [
        {
          text: "Masterpiece",
          value: 10
        },
        {
          text: "Great",
          value: 9
        },
        {
          text: "Very Good",
          value: 8
        },
        {
          text: "Good",
          value: 7
        },
        {
          text: "Fine",
          value: 6
        },
        {
          text: "Average",
          value: 5
        },
        {
          text: "Bad",
          value: 4
        },
        {
          text: "Very Bad",
          value: 3
        },
        {
          text: "Horrible",
          value: 2
        },
        {
          text: "Appalling",
          value: 1
        },
        {
          text: "Not rated",
          value: 0
        }
      ],
      statuses: [
        {
          text: "Watching",
          value: "watching"
        },
        {
          text: "Completed",
          value: "completed"
        },
        {
          text: "On Hold",
          value: "on_hold"
        },
        {
          text: "Dropped",
          value: "dropped"
        },
        {
          text: "Plan to Watch",
          value: "plan_to_watch"
        }
      ]
    };
  },
  computed: {
    perPage() {
      return this.component?.props?.display || 3;
    },
    computedRecent() {
      return this.recent.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    },
    pages() {
      return Math.ceil(this.recent.length / this.perPage);
    }
  },
  mounted() {
    this.getMAL();
  },
  methods: {
    async updateAnime(
      id: number,
      episodes: number,
      score: number,
      status: string
    ) {
      await this.axios.patch(
        `/providers/userv3/mal/${this.user?.username}/anime`,
        {
          id,
          num_episodes_watched: episodes,
          score,
          status
        }
      );
      this.getMAL(false);
    },
    getStatusColor(status: string) {
      switch (status) {
        case "completed":
          return "info";
        case "dropped":
          return "error";
        case "on_hold":
          return "warning";
        case "plan_to_watch":
          return "indigo";
        case "watching":
          return "success";
        default:
          return "grey";
      }
    },
    async getMAL(load = true) {
      if (load) {
        this.loading = true;
      } else {
        this.partialLoading = true;
      }
      const { data } = await this.axios.get(
        `/providers/userv3/mal/${this.user?.username}`,
        {
          headers: {
            noToast: true
          }
        } as any
      );
      if (!data.data) return;
      this.recent = data.data;
      this.malUser = data.user;
      this.loading = false;
      this.partialLoading = false;
    }
  }
});
</script>
