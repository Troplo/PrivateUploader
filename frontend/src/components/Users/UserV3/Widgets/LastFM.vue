<template>
  <v-card class="mx-2 my-5">
    <v-toolbar>
      <v-toolbar-title>
        Last.fm
        <template v-if="!loading">
          &bullet; {{ parseInt(attributes.total).toLocaleString() }} scrobbles
        </template>
      </v-toolbar-title>
      <v-btn
        icon
        :href="`https://last.fm/user/${attributes.user}`"
        target="_blank"
        :disabled="!attributes.user"
      >
        <v-icon>external-link-line</v-icon>
      </v-btn>
      <v-btn
        icon
        :disabled="page === 1"
        @click="page > 1 ? page-- : (page = 1)"
      >
        <v-icon>arrow-left-s-line</v-icon>
      </v-btn>
      <v-btn icon @click="getLastFM">
        <v-icon>refresh-line</v-icon>
      </v-btn>
      <v-btn icon :disabled="page >= pages" @click="page < pages ? page++ : ''">
        <v-icon>arrow-right-s-line</v-icon>
      </v-btn>
    </v-toolbar>
    <template v-if="!loading">
      <v-list>
        <v-list-item
          v-for="track in computedTracks"
          :key="track?.date?.uts"
          :active="track['@attr']?.nowplaying === 'true'"
          :href="track.url"
          target="_blank"
        >
          <template #prepend>
            <v-avatar size="36">
              <v-img :src="track.image[1]['#text']" />
            </v-avatar>
          </template>
          <v-list-item-title>
            {{ track.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ track.artist["#text"] }}
          </v-list-item-subtitle>
          <template #append>
            <v-list-item-subtitle>
              {{
                track?.date?.uts
                  ? $date(track?.date?.uts * 1000).fromNow()
                  : "Scrobbling now"
              }}
            </v-list-item-subtitle>
          </template>
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

export default defineComponent({
  components: { MessageSkeleton },
  props: ["user", "component"],
  data() {
    return {
      tracks: [] as {
        artist: { "#text": string };
        name: string;
        url: string;
        image: { "#text": string }[];
        date: { uts: number };
        "@attr": { nowplaying: string };
      }[],
      attributes: {
        total: "0",
        totalPages: "0",
        user: ""
      },
      page: 1,
      loading: true
    };
  },
  computed: {
    perPage() {
      return this.component?.props?.display || 7;
    },
    pages() {
      return Math.ceil(this.tracks.length / this.perPage);
    },
    computedTracks() {
      return this.tracks.slice(
        (this.page - 1) * this.perPage,
        this.page * this.perPage
      );
    }
  },
  mounted() {
    this.getLastFM();
  },
  methods: {
    async getLastFM() {
      this.loading = true;
      const { data } = await this.axios.get(
        `/providers/userv3/lastfm/${this.user?.username}`,
        {
          headers: {
            noToast: true
          }
        } as any
      );
      if (!data.recenttracks) return;
      this.tracks = data.recenttracks.track;
      this.attributes = data.recenttracks["@attr"];
      this.loading = false;
    }
  }
});
</script>
