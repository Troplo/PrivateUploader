<template>
  <v-row>
    <v-col v-if="supports.search">
      <GalleryTextField
        v-model="search"
        @update:model-value="$emit('update:search', search)"
        @submit="$emit('refreshGallery')"
      />
    </v-col>
    <v-col v-if="supports.sort" cols="12" md="4">
      <v-select
        v-model="sort"
        :items="[]"
        :label="$t('generic.options')"
        item-title="name"
        item-value="internalName"
      >
        <template #no-data>
          <overline position="start">
            {{ $t("generic.sortDirection") }}
          </overline>
          <v-list-item
            v-for="item in orderTypes"
            :key="item.internalName"
            :active="order === item.internalName"
            @click="
              order = item.internalName;
              $emit('update:order', order);
              $emit('refreshGallery');
            "
          >
            {{ item.name }}
          </v-list-item>
          <template v-if="supports.sort">
            <overline position="start">
              {{ $t("generic.sort") }}
            </overline>
            <v-list-item
              v-for="item in sortTypes"
              :key="item.internalName"
              :active="sort === item.internalName"
              @click="
                sort = item.internalName;
                $emit('update:sort', sort);
                $emit('refreshGallery');
              "
            >
              {{ item.name }}
            </v-list-item>
          </template>
          <template v-if="supports.filter">
            <overline position="start">{{ $t("generic.filter") }}</overline>
            <v-list-item
              v-for="item in types"
              :key="item.internalName"
              :active="filter.includes(item.internalName)"
              @click="
                filter.find((f) => f === item.internalName)
                  ? filter.splice(filter.indexOf(item.internalName), 1)
                  : filter.push(item.internalName);
                $emit('update:filter', filter);
                $emit('refreshGallery');
              "
            >
              {{ item.name }}
            </v-list-item>
          </template>
        </template>
        <template #selection>
          {{
            $t("generic.option", {
              count: filter.length
            })
          }}
        </template>
      </v-select>
    </v-col>
    <v-col
      v-if="supports.upload && !$experiments.experiments.PROGRESSIVE_UI"
      sm="auto"
      align-self="center"
    >
      <v-btn block @click="$app.dialogs.upload.value = true">
        <v-icon class="mr-1">mdi-upload</v-icon>
        {{ $t("generic.upload") }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GalleryFilter, GalleryOrder, GallerySort } from "@/gql/graphql";
import GalleryTextField from "@/components/Gallery/GalleryTextField.vue";
import Overline from "@/components/Core/Typography/Overline.vue";

export default defineComponent({
  components: { Overline, GalleryTextField },
  props: {
    supports: {
      type: Object,
      required: false,
      default() {
        return {
          filter: true,
          metadata: true,
          search: true,
          upload: false,
          sort: true
        };
      }
    },
    orderTypes: {
      type: Array as () => {
        name: string;
        internalName: GalleryOrder;
      }[],
      required: false,
      default() {
        return [
          {
            name: "Ascending",
            internalName: GalleryOrder.Asc
          },
          {
            name: "Descending",
            internalName: GalleryOrder.Desc
          },
          {
            name: "Random",
            internalName: GalleryOrder.Random
          }
        ];
      }
    },
    sortTypes: {
      type: Array as () => {
        name: string;
        internalName: GallerySort;
      }[],
      required: false,
      default() {
        return [
          {
            name: "Created at",
            internalName: GallerySort.CreatedAt
          },
          {
            name: "Name",
            internalName: GallerySort.Name
          },
          {
            name: "Size",
            internalName: GallerySort.Size
          }
        ];
      }
    },
    types: {
      type: Array as () => {
        name: string;
        internalName: GalleryFilter;
      }[],
      required: false,
      default() {
        return [
          {
            name: "Search in screenshots",
            internalName: GalleryFilter.IncludeMetadata
          },
          {
            name: "Not collectivized",
            internalName: GalleryFilter.NoCollection
          },
          {
            name: "Images",
            internalName: GalleryFilter.Images
          },
          {
            name: "Videos",
            internalName: GalleryFilter.Videos
          },
          {
            name: "Audio",
            internalName: GalleryFilter.Audio
          },
          {
            name: "Text",
            internalName: GalleryFilter.Text
          },
          {
            name: "Other",
            internalName: GalleryFilter.Other
          },
          {
            name: "Undeletable",
            internalName: GalleryFilter.OnlyUndeletable
          },
          {
            name: "Owned items",
            internalName: GalleryFilter.Owned
          },
          {
            name: "Not owned items",
            internalName: GalleryFilter.Shared
          }
        ];
      }
    }
  },
  emits: [
    "update:filter",
    "update:search",
    "update:metadata",
    "refreshGallery",
    "update:sort",
    "update:order"
  ],
  data() {
    return {
      metadata: true,
      filter: [GalleryFilter.IncludeMetadata],
      sort: GallerySort.CreatedAt,
      order: GalleryOrder.Desc,
      search: ""
    };
  },
  computed: {
    GalleryFilter() {
      return GalleryFilter;
    }
  }
});
</script>
