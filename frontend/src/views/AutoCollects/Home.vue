<template>
  <v-container>
    <div class="float-right" v-if="!$experiments.experiments.PROGRESSIVE_UI">
      <v-btn class="rounded-xl ml-2" to="/autoCollect/configure">
        <v-icon class="mr-2">mdi-cog</v-icon>
        {{ $t("autoCollects.configure.title") }}
      </v-btn>
    </div>
    <br />
    <br />
    <v-row v-if="autoCollects.length">
      <v-col
        v-for="item in autoCollects"
        :key="'item-' + item.id + '-' + (item.shared ? 'shared' : 'owned')"
        md="4"
        xl="3"
        cols="12"
      >
        <CollectionCard :item="item" type="autoCollect" />
      </v-col>
    </v-row>
    <PromoNoContent
      v-else-if="!$app.componentLoading"
      :description="$t('autoCollects.home.subtitle')"
      :icon="RiCheckboxMultipleFill"
      :title="$t('autoCollects.home.title')"
    />
  </v-container>
  <teleport
    v-if="$experiments.experiments.PROGRESSIVE_UI && $ui.ready"
    to="#appbar-options"
  >
    <accessible-transition mode="out-in" name="slide-up" appear>
      <v-btn icon size="small" to="/autoCollect/configure">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </accessible-transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CollectionCard from "@/components/Collections/CollectionCard.vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import { RiCheckboxMultipleFill } from "@remixicon/vue";

export default defineComponent({
  name: "AutoCollectsHome",
  computed: {
    RiCheckboxMultipleFill() {
      return RiCheckboxMultipleFill;
    }
  },
  components: { AccessibleTransition, PromoNoContent, CollectionCard },
  data() {
    return {
      autoCollects: [] as any[]
    };
  },
  mounted() {
    this.getAutoCollects();
    this.$app.title = "AutoCollects";
  },
  methods: {
    async getAutoCollects() {
      this.$app.componentLoading = true;
      const { data } = await this.axios.get("/autoCollects");
      this.autoCollects = data;
      this.$app.componentLoading = false;
    }
  }
});
</script>
