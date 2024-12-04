<template>
  <!--  <VErrorBoundary-->
  <!--    :fall-back="skullCrash"-->
  <!--    :params="{ e: error, name: 'UserV3 widget' }"-->
  <!--    stop-propagation-->
  <!--    @error-captured="err"-->
  <!--  />-->
  <v-toolbar v-if="editMode" border class="rounded-xl">
    <v-toolbar-title>
      {{ components.find((c) => c.id === component.name)?.name }}
    </v-toolbar-title>
    <v-btn icon @click="$emit('delete', component)">
      <v-icon>mdi-delete</v-icon>
    </v-btn>
    <v-btn
      v-if="
        component.name !== 'parent' &&
        components.find((c) => c.id === component.name)?.props
      "
      icon
      @click="$emit('settings', component.id)"
    >
      <v-icon>mdi-cog</v-icon>
    </v-btn>
    <v-btn icon @click="$emit('moveUp', component)">
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
    <v-btn icon @click="$emit('moveDown', component)">
      <v-icon>mdi-arrow-down</v-icon>
    </v-btn>
    <v-icon class="drag-handle mr-3 ml-1">mdi-drag</v-icon>
  </v-toolbar>
  <div
    v-if="willShow(component, 'parent')"
    :class="{ 'v-container': editMode }"
  >
    <template v-if="editMode && $experiments.experiments.USER_V3_EDITOR">
      <v-card-subtitle class="mt-2">Dev UserV3 actions:</v-card-subtitle>
      <v-btn
        v-for="comp in components"
        :key="comp.id"
        @click="addItemDebug(comp.id)"
      >
        Add {{ comp.name }}
      </v-btn>
    </template>
    <template v-else-if="editMode">
      <UserV3AddMenu :components="components" @add="addItemDebug" />
    </template>
    <v-row class="c-both">
      <v-col
        v-for="child in component.props.children"
        :key="child.id"
        :xl="12 / component.props.children.length"
        md="12"
      >
        <UserV3ComponentHandler
          :component="child"
          :components="components"
          :edit-mode="editMode"
          :gold="gold"
          :primary="primary"
          :user="user"
          :username="username"
          @delete="$emit('delete', $event)"
          @move-down="$emit('moveDown', $event)"
          @move-up="$emit('moveUp', $event)"
          @settings="$emit('settings', $event)"
          @modify-prop="$emit('modifyProp', $event)"
        />
      </v-col>
    </v-row>
  </div>
  <div
    v-else-if="willShow(component, 'spacer')"
    :style="{ height: component.props?.height + 'px' }"
  ></div>
  <v-divider v-if="willShow(component, 'divider')" />
  <profile-info
    v-else-if="component.name === 'profile-info'"
    :user="user"
    :username="username"
  />
  <mutual-collections
    v-else-if="willShow(component, 'mutual-collections')"
    :user="user"
    :username="username"
  />
  <mutual-friends
    v-else-if="willShow(component, 'mutual-friends')"
    :user="user"
    :username="username"
  />
  <core-statistics
    v-else-if="willShow(component, 'core-statistics')"
    :gold="gold"
    :primary="primary"
    :user="user"
    :username="username"
  />
  <LastFM
    v-else-if="willShow(component, 'last-fm')"
    :component="component"
    :user="user"
  />
  <my-anime-list
    v-else-if="willShow(component, 'mal')"
    :component="component"
    :user="user"
  />
  <social-links
    v-else-if="component.name === 'social-links'"
    :user="user"
    :component="component"
    @add-link="
      $emit('modifyProp', {
        component: component,
        prop: 'links',
        value: $event
      })
    "
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MutualCollections from "@/components/Users/UserV3/Widgets/MutualCollections.vue";
import ProfileInfo from "@/components/Users/UserV3/Widgets/ProfileInfo.vue";
import MutualFriends from "@/components/Users/UserV3/Widgets/MutualFriends.vue";
import CoreStatistics from "@/components/Users/UserV3/Widgets/CoreStatistics.vue";
import LastFM from "@/components/Users/UserV3/Widgets/LastFM.vue";
import MyAnimeList from "@/components/Users/UserV3/Widgets/MyAnimeList.vue";
// import VErrorBoundary from "@/components/Core/ErrorBoundary.vue";
import Crash from "@/components/Core/CrashAlt.vue";
import { Component } from "@/types/userv3";
import UserV3AddMenu from "@/components/Users/UserV3/AddMenu.vue";
import SocialLinks from "@/components/Users/UserV3/Widgets/SocialLinks.vue";
import { FriendStatus, ProfileLayoutComponent, User } from "@/gql/graphql";

export default defineComponent({
  components: {
    SocialLinks,
    UserV3AddMenu,
    MyAnimeList,
    LastFM,
    CoreStatistics,
    MutualFriends,
    ProfileInfo,
    MutualCollections
    // VErrorBoundary
  },
  props: {
    component: {
      type: Object as () => ProfileLayoutComponent,
      required: true
    },
    user: {
      type: Object as () => User,
      required: true
    },
    username: {
      type: String,
      required: false
    },
    gold: {
      type: Boolean,
      required: true
    },
    primary: {
      type: String,
      required: false
    },
    components: {
      type: Array as () => Component[],
      required: true
    },
    editMode: {
      type: Boolean,
      required: true
    }
  },
  emits: [
    "addToParent",
    "delete",
    "moveUp",
    "moveDown",
    "settings",
    "modifyProp"
  ],
  data() {
    return {
      skullCrash: Crash,
      error: null as { error: Error } | null
    };
  },
  methods: {
    err(error: { error: Error }) {
      this.error = error;
      console.error(error.error.stack);
    },
    addItemDebug(name: string) {
      this.$emit("addToParent", {
        name,
        id: this.$functions.uuid(),
        props: this.components.find((c) => c.id === name)?.props || {}
      });
    },
    willShow(component: Component, name: string) {
      if (component.name !== name) return false;
      if (
        component.props?.friendsOnly &&
        this.user?.friend !== FriendStatus.Accepted &&
        this.user?.id !== this.$user.user?.id
      )
        return false;
      if (
        (component.props?.mutualFriends ||
          component.name === "mutual-friends") &&
        !this.user?.friends?.length
      )
        return false;
      if (
        (component.props?.mutualCollections ||
          component.name === "mutual-collections") &&
        !this.user?.mutualCollections?.length
      )
        return false;
      return true;
    }
  }
});
</script>
