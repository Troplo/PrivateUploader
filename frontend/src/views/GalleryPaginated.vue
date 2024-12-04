<template>
  <v-container>
    <GalleryNavigation
      :supports="
        supports || {
          filter: true,
          metadata: true,
          search: true,
          upload: true,
          sort: true
        }
      "
      @refreshGallery="getGallery()"
      @update:show="show = $event"
      v-model:search="show.search"
      @update:filter="
        show.selected = $event;
        page = 1;
      "
      @update:metadata="
        show.metadata = $event;
        page = 1;
      "
      @update:sort="
        show.sort = $event;
        page = 1;
      "
      @update:order="
        show.order = $event;
        page = 1;
      "
    />
    <GalleryCore
      :items="gallery"
      :page="page"
      :loading="loading"
      :random-attachment-loading="randomLoading"
      :supports="
        supports || {
          multiSelect: true,
          randomAttachment: true,
          permissions: {
            read: true,
            write: true,
            configure: true
          }
        }
      "
      :searched="show.searched"
      @delete="deleteItem"
      @refresh="getGallery()"
      @remove="removeItemFromCollection($event.item, $event.collection)"
      @updateItem="updateItem"
      @page-change="$router.push(`${path}/${$event}`)"
      @random-attachment="randomAttachment"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </GalleryCore>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GalleryCore from "@/components/Gallery/GalleryCore.vue";
import { CollectionCache } from "@/types/collection";
import GalleryNavigation from "@/components/Gallery/GalleryNavigation.vue";
import { GalleryQuery } from "@/graphql/gallery/gallery.graphql";
import {
  GalleryFilter,
  GalleryInput,
  GalleryOrder,
  GallerySort,
  GalleryType,
  Pager,
  Upload
} from "@/gql/graphql";
import { isNumeric } from "@/plugins/isNumeric";
import {
  useApolloClient,
  useSubscription,
  UseSubscriptionReturn
} from "@vue/apollo-composable";
import functions from "@/plugins/functions";
import { UploadsSubscription } from "@/graphql/gallery/subscriptions/createUploads.graphql";
import { UpdateUploadsSubscription } from "@/graphql/gallery/subscriptions/updateUploads.graphql";

export default defineComponent({
  components: { GalleryNavigation, GalleryCore },
  props: ["path", "type", "name", "random", "supports", "id"],
  provide() {
    return {
      getGallery: this.getGallery,
      removeItemFromCollection: this.removeItemFromCollection,
      deleteItem: this.deleteItem,
      updateItem: this.updateItem
    };
  },
  data() {
    return {
      gallery: undefined as
        | {
            items: Upload[];
            pager: Pager;
          }
        | undefined,
      page: 1,
      loading: true,
      show: {
        search: "",
        metadata: true,
        selected: [GalleryFilter.IncludeMetadata],
        sort: GallerySort.CreatedAt,
        order: GalleryOrder.Desc,
        /**
         * @description If the current state is a search
         */
        searched: false
      },
      randomLoading: false,
      createSubscription: null as UseSubscriptionReturn<any, any> | null,
      updateSubscription: null as UseSubscriptionReturn<any, any> | null
    };
  },
  computed: {
    rid() {
      const id = this.$route.params.id;
      return isNumeric(id) ? parseInt(id) : id;
    }
  },
  methods: {
    async randomAttachment() {
      this.randomLoading = true;
      // TODO
      /*this.$functions.copy(
        "https://" + this.$user.user?.domain.domain + "/i/" + data.attachment
      );*/
      const {
        data: { gallery }
      } = await useApolloClient().client.query({
        query: GalleryQuery,
        variables: {
          input: {
            page: 1,
            type: this.type,
            order: GalleryOrder.Random,
            limit: 1,
            collectionId: typeof this.id === "number" ? this.id : undefined,
            shareLink: typeof this.id === "string" ? this.id : undefined
          }
        },
        fetchPolicy: "network-only"
      });
      functions.copy(this.$app.domain + gallery.items?.[0]?.attachment);
      this.randomLoading = false;
    },
    removeItemFromCollection(item: Upload, collection: CollectionCache) {
      const index = this.gallery.items.findIndex(
        (i: Upload) => i.id === item.id
      );
      if (index === -1) return;
      this.gallery.items[index] = <Upload>{
        ...this.gallery.items[index],
        collections: this.gallery.items[index]?.collections.filter(
          (c: any) => c.id !== collection.id
        )
      };
    },
    deleteItem(item: Upload) {
      const index = this.gallery.items.findIndex((i: any) => i.id === item.id);
      if (index === -1) return;
      this.gallery.items.splice(index, 1);
    },
    updateItem({
      item,
      collection
    }: {
      item: number;
      collection: CollectionCache;
    }) {
      const index = this.gallery.items.findIndex((i: any) => i.id === item);
      if (index === -1) return;
      this.gallery.items[index] = {
        ...this.gallery.items[index],
        collections: [...this.gallery.items[index]?.collections, collection]
      };
    },
    async getGallery() {
      this.loading = true;
      if (this.$experiments.experiments.PROGRESSIVE_UI) {
        this.$app.componentLoading = true;
      }
      const {
        data: { gallery }
      } = await this.$apollo.query({
        query: GalleryQuery,
        fetchPolicy: "network-only",
        variables: {
          input: {
            page: this.page,
            filters: this.show.selected,
            search: this.show.search,
            sort: this.show.sort,
            type: this.type,
            order: this.show.order,
            collectionId: typeof this.rid === "number" ? this.rid : undefined,
            shareLink: typeof this.rid === "string" ? this.rid : undefined
          }
        } as GalleryInput
      });
      this.show.searched = !!this.show.search.length;
      this.gallery = gallery;
      this.loading = false;
      if (this.$experiments.experiments.PROGRESSIVE_UI) {
        this.$app.componentLoading = false;
      }
      return gallery;
    },
    socketRegister(
      uploads:
        | { upload: Upload; url: string }
        | { upload: Upload; url: string }[]
    ) {
      if (this.page !== 1) return;
      if (Array.isArray(uploads)) {
        for (const upload of uploads) {
          this.gallery = {
            items: [upload.upload, ...this.gallery.items],
            pager: this.gallery.pager
          };
        }
      } else {
        this.gallery.items.unshift(uploads.upload);
      }
    },
    init() {
      this.$app.title = this.name || "Gallery";
      this.page = parseInt(<string>this.$route.params.page) || 1;
      this.getGallery();
      this.generateSubscription();
    },
    generateSubscription() {
      this.createSubscription?.stop();
      this.createSubscription = useSubscription(
        UploadsSubscription,
        {
          input: {
            type: this.type,
            collectionId: typeof this.id === "number" ? this.id : undefined
          }
        },
        {
          context: {
            noToast: true
          }
        }
      );

      this.updateSubscription?.stop();
      this.updateSubscription = useSubscription(
        UpdateUploadsSubscription,
        {},
        {
          context: {
            noToast: true
          }
        }
      );
    }
  },
  mounted() {
    this.init();
  },
  unmounted() {
    this.createSubscription?.stop();
    this.updateSubscription?.stop();
  },
  watch: {
    "createSubscription.result"(val) {
      if (this.page !== 1 || !val) return;
      this.gallery.items = [val.onCreateUpload.upload, ...this.gallery.items];
    },
    "updateSubscription.result"(val) {
      if (!val) return;
      for (const upload of val.onUpdateUploads) {
        const index = this.gallery.items.findIndex(
          (i: any) => i.id === upload.id
        );
        if (index === -1) return;
        this.gallery.items[index] = {
          ...this.gallery.items[index],
          ...upload
        };
      }
    },
    "$route.params.page"(page) {
      this.page = parseInt(page) || 1;
      this.getGallery();
    },
    type() {
      this.init();
    },
    endpoint() {
      this.init();
    },
    id() {
      this.init();
    }
  }
});
</script>
