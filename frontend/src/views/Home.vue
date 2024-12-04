<template>
  <v-container v-if="$user.user">
    <v-row>
      <v-col md="6">
        <UserWidget />
        <BlogWidget class="mt-6" />
        <AnnouncementsWidget class="mt-6" />
      </v-col>
      <v-col md="6">
        <StatsWidget />
        <GraphWidget :gold="$user.gold" :user="true" class="mt-6" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UserWidget from "@/components/Dashboard/UserWidget.vue";
import StatsWidget from "@/components/Dashboard/StatsWidget.vue";
import GraphWidget from "@/components/Dashboard/GraphWidget.vue";
import BlogWidget from "@/components/Dashboard/BlogWidget.vue";
import AnnouncementsWidget from "@/components/Dashboard/AnnouncementsWidget.vue";

export default defineComponent({
  name: "Home",
  components: {
    BlogWidget,
    GraphWidget,
    StatsWidget,
    UserWidget,
    AnnouncementsWidget
  },
  mounted() {
    this.$app.title = "Dashboard";
  }
});
</script>
