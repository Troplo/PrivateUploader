<template>
  <Sharing
    v-if="collection"
    v-model="sharing"
    :collection="collection"
    @get-collection="getCollection"
  />
  <CollectionSettings
    v-model="settings"
    :collection="collection"
    @refreshCollection="getCollection"
  />
  <UserBanner
    v-if="collection && !$experiments.experiments.PROGRESSIVE_UI"
    :collection="collection"
    :gold="$user.gold"
    @sharing-dialog="sharing = true"
    @refresh-user="getCollection"
  >
    <v-card-title>
      {{ collection.name }}
      <span class="float-end">
        <v-btn
          v-if="
            !$route.params.type && collection.permissionsMetadata?.configure
          "
          @click="sharing = true"
        >
          <v-icon class="mr-1" style="font-size: 20px">mdi-share</v-icon>
          Collection Sharing
        </v-btn>
        <v-btn
          v-if="
            !$route.params.type && collection.permissionsMetadata?.configure
          "
          @click="settings = true"
        >
          <v-icon class="mr-1" style="font-size: 20px">mdi-cog</v-icon>
          Settings
        </v-btn>
        <v-btn
          v-else-if="collection?.shareLink"
          @click="
            $functions.copy(
              $app.site.hostnameWithProtocol +
                '/collections/' +
                collection?.shareLink
            )
          "
        >
          <v-icon class="mr-1" style="font-size: 20px">mdi-link</v-icon>
          Copy Share Link
        </v-btn>
      </span>
    </v-card-title>
    <v-card-text v-if="collection.users.length" class="mt-n3">
      <v-icon>mdi-swap-horizontal</v-icon>
      {{ collection.user.username }},
      {{ collection.users.map((user) => user.user.username).join(", ") }}
    </v-card-text>
    <v-card-text v-else class="mt-n3">
      {{ collection.itemCount }} items
    </v-card-text>
  </UserBanner>
  <v-container v-if="collection">
    <Gallery
      :type="GalleryType.Collection"
      :id="collection.id"
      :supports="{
        multiSelect: true,
        pins: true,
        randomAttachment: true,
        upload: false,
        search: true,
        metadata: true,
        filter: true,
        sort: true,
        permissions: {
          read: true,
          write: collection.permissionsMetadata?.write,
          configure: collection.permissionsMetadata?.configure
        }
      }"
      :path="`/collections/${this.$route.params.id}`"
    >
      <template v-slot:custom-values="{ item }: any">
        <v-card-subtitle>Creator: {{ item?.user?.username }}</v-card-subtitle>
      </template>
    </Gallery>
    <teleport
      to="#appbar-options-first"
      v-if="$experiments.experiments.PROGRESSIVE_UI"
    >
      <accessible-transition mode="out-in" name="slide-up" appear>
        <div class="flex gap-2">
          <accessible-transition name="slide-up" mode="out-in">
            <leave-collection-dialog
              :collection="collection"
              v-slot="{ toggle }"
            >
              <v-btn
                @click="toggle"
                icon
                v-if="collection?.userId !== $user.user?.id"
                :key="collection?.userId"
                size="small"
              >
                <v-tooltip activator="parent" location="bottom">
                  {{ $t("collections.leave.title") }}
                </v-tooltip>
                <RiLogoutBoxLine class="action-bar-item" />
              </v-btn>
            </leave-collection-dialog>
          </accessible-transition>
          <accessible-transition name="slide-up" mode="out-in">
            <v-btn
              icon
              v-if="!!collection?.shareLink"
              :key="collection?.userId"
              size="small"
              @click="
                $functions.copy(
                  `${$app.site.hostnameWithProtocol}/collections/${collection?.shareLink}`
                );
                $toast.success($t('generic.copied'));
              "
            >
              <v-tooltip activator="parent" location="bottom">
                {{ $t("collections.sharing.copy") }}
              </v-tooltip>
              <RiLink class="action-bar-item" />
            </v-btn>
          </accessible-transition>
          <v-btn icon size="small" @click="sharing = true">
            <v-tooltip activator="parent" location="bottom">
              {{ $t("collections.sharing.title") }}
            </v-tooltip>
            <RiShareForwardFill class="action-bar-item" />
          </v-btn>
          <v-btn icon size="small" @click="settings = true">
            <v-tooltip activator="parent" location="bottom">
              {{ $t("collections.settings.title") }}
            </v-tooltip>
            <RiSettings5Line class="action-bar-item" />
          </v-btn>
          <div class="border-r border-outline-dark"></div>
        </div>
      </accessible-transition>
    </teleport>
  </v-container>
  <v-container v-else-if="!$app.componentLoading">
    <PromoNoContent
      icon="mdi-close-circle"
      title="Collection not found"
      description="The collection you are looking for does not exist or you don't have permission to view it."
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, h, markRaw } from "vue";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import CollectionBanner from "@/components/Collections/CollectionBanner.vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import Sharing from "@/components/Collections/Dialogs/Sharing.vue";
import UserBanner from "@/components/Users/UserBanner.vue";
import CollectionSettings from "@/components/Collections/Dialogs/Settings.vue";
import Gallery from "@/views/Gallery.vue";
import { GalleryType, Collection } from "@/gql/graphql";
import { isNumeric } from "@/plugins/isNumeric";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import {
  RiCollageFill,
  RiCollageLine,
  RiLink,
  RiLogoutBoxLine,
  RiSettings5Line,
  RiShareForwardFill
} from "@remixicon/vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import { RailMode } from "@/store/progressive.store";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";
import LeaveCollectionDialog from "@/components/Collections/Dialogs/LeaveCollectionDialog.vue";

export default defineComponent({
  name: "CollectionsItem",
  computed: {
    GalleryType() {
      return GalleryType;
    }
  },
  components: {
    LeaveCollectionDialog,
    AccessibleTransition,
    RiLogoutBoxLine,
    RiSettings5Line,
    RiShareForwardFill,
    RiLink,
    PromoNoContent,
    Gallery,
    CollectionSettings,
    UserBanner,
    Sharing,
    GalleryCore,
    CollectionBanner,
    GalleryNavigation
  },
  data() {
    return {
      collection: undefined as Collection | undefined,
      sharing: false,
      settings: false
    };
  },
  methods: {
    async getCollection(load = true) {
      if (!this.collection && this.$collections.items.length && load) {
        this.collection = this.$collections.items.find(
          (c: Collection) => c.id === parseInt(<string>this.$route.params.id)
        );
      }
      if (load) {
        this.$app.componentLoading = true;
      }
      const collection = await this.$collections.getCollection(
        isNumeric(this.$route.params.id)
          ? parseInt(<string>this.$route.params.id)
          : this.$route.params.id
      );
      this.$app.componentLoading = false;
      this.collection = collection;
      this.$app.title = this.collection?.name || "Collection";

      this.$ui.currentNavItem = {
        item: {
          name: this.collection?.name || "Loading...",
          icon: this.collection?.avatar
            ? h(UserAvatar, {
                user: {
                  avatar: this.collection?.avatar,
                  username: this.collection?.name
                },
                size: 32,
                style: "margin: 0px 4px 0px 4px"
              })
            : markRaw(RiCollageLine),
          path: this.$route.path,
          selectedIcon: markRaw(RiCollageFill)
        },
        rail: this.$experiments.experiments.BREADCRUMB_SHOW_PARENT
          ? [
              this.$ui.navigation.railOptions.find(
                (rail) => rail.id === RailMode.GALLERY
              )
            ]
          : []
      };

      console.log(this.collection);

      this.$ui.appBarImage = this.collection?.banner
        ? this.$app.domain + this.collection?.banner
        : null;

      if (this.$ui.appBarImage) {
        this.$ui.appBarType = "collapse";
        this.$ui.appBarHeight = 256;
      } else {
        this.$ui.appBarType = "stick";
        this.$ui.appBarHeight = 64;
      }
    },
    async onCollectionUserUpdate(data: { id?: number; collectionId: number }) {
      if (data.collectionId !== this.collection?.id) return;
      this.getCollection(false);
    },
    async onCollectionUpdate(data: { id?: number; name?: string }) {
      if (data.id !== this.collection?.id) return;
    }
  },
  mounted() {
    this.getCollection();
    this.$sockets.gallery.on("collectionUpdate", this.onCollectionUpdate);
    this.$sockets.gallery.on(
      "collectionUserUpdate",
      this.onCollectionUserUpdate
    );
    this.$sockets.gallery.on("collectionUserAdd", this.onCollectionUserUpdate);
    this.$sockets.gallery.on(
      "collectionUserRemove",
      this.onCollectionUserUpdate
    );
  },
  unmounted() {
    this.$ui.appBarImage = null;
    this.$sockets.gallery.off("collectionUpdate", this.onCollectionUpdate);
    this.$sockets.gallery.off(
      "collectionUserUpdate",
      this.onCollectionUserUpdate
    );
    this.$sockets.gallery.off("collectionUserAdd", this.onCollectionUserUpdate);
    this.$sockets.gallery.off(
      "collectionUserRemove",
      this.onCollectionUserUpdate
    );
    this.$ui.appBarType = "stick";
    this.$ui.appBarHeight = 64;
  },
  watch: {
    "$route.params.id"(val) {
      if (!val) return;
      this.getCollection();
    }
  }
});
</script>
