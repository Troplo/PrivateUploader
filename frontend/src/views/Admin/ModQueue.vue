<template>
  <p v-if="!$experiments.experiments.PROGRESSIVE_UI">!!NEW UI ONLY!!</p>
  <BanUser v-model:ban-wizard="banWizard" />
  <DangerZoneDialog
    v-model="dialogs.report.dangerZone.dialog"
    @confirm="deleteAccount"
    :require-both="true"
  >
    <template #title>Enter your password or TOTP to delete</template>
    <template #actions="{ confirm }">
      <v-btn color="red" @click="confirm">Delete Account</v-btn>
    </template>
  </DangerZoneDialog>
  <CoreDialog
    v-model="dialogs.report.value"
    @close="dialogs.report.value = false"
    max-width="400"
  >
    <template #title>Punish User: {{ dialogs.report.user.username }}</template>
    <v-card-text>
      <v-autocomplete
        v-model="dialogs.report.action"
        :items="actions"
        item-title="name"
        item-value="id"
        label="Action"
        outlined
        dense
      />
      <v-autocomplete
        v-if="
          dialogs.report.action === AdminPunishmentType.DeleteAccountImmediately
        "
        v-model="dialogs.report.banReason"
        :items="banReasonTypes"
        label="Ban Reason"
        outlined
        dense
      />
    </v-card-text>
    <v-card-actions>
      <v-btn @click="dialogs.report.value = false">Cancel</v-btn>
      <v-btn color="red" @click="punish">Do action</v-btn>
    </v-card-actions>
  </CoreDialog>
  <CoreDialog
    v-model="dialogs.trusted.value"
    title="Trust User"
    @close="dialogs.trusted.value = false"
    max-width="400"
  >
    <template #title>Trust User: {{ dialogs.trusted.username }}</template>
    <v-card-text>
      Are you sure you want to trust this user? Undo from admin panel
    </v-card-text>
    <v-card-actions>
      <v-btn @click="dialogs.trusted.value = false">Cancel</v-btn>
      <v-btn
        color="green"
        @click="
          $admin.setTrusted(dialogs.trusted.id, true);
          dialogs.trusted.value = false;
        "
      >
        Trust
      </v-btn>
    </v-card-actions>
  </CoreDialog>
  <Gallery
    ref="gallery"
    :type="GalleryType.Mqueue"
    path="/admin/queue"
    name="MQueue"
    :supports="{
      filter: true,
      metadata: true,
      search: true,
      upload: false,
      sort: true,
      multiSelect: true,
      permissions: {
        read: true,
        write: false,
        configure: false
      }
    }"
    :filter-types="filterTypes"
  >
    <template
      #appbar-options-selected="{ selected, $emit, deselectAll, select }"
    >
      <v-btn icon size="small" color="red">
        <v-tooltip
          activator="parent"
          location="bottom"
          @click="
            act(
              selected.map((item) => ({
                uploadId: item.id,
                approved: false,
                flagged: true
              }))
            );
            deselectAll();
          "
          :loading="loading"
        >
          Flag selected
        </v-tooltip>
        <RiFlagLine class="action-bar-item" />
      </v-btn>
      <v-btn icon size="small" color="green">
        <v-tooltip activator="parent" location="bottom">
          Approve selected
        </v-tooltip>
        <RiCheckLine
          class="action-bar-item"
          @click="
            act(
              selected.map((item) => ({
                uploadId: item.id,
                approved: true,
                flagged: false
              }))
            );
            deselectAll();
          "
          :loading="loading"
        />
      </v-btn>
    </template>
    <template #custom-values="{ item }">
      <v-card-subtitle>
        Uploaded by:
        <router-link :to="`/u/${item.user.username}`" target="_blank">
          {{ item.user.username }}
        </router-link>
      </v-card-subtitle>
    </template>
    <template #actions="{ item }">
      <HoverChip
        color="green"
        :icon="RiCheckLine"
        text="Approve"
        @click="
          act([
            {
              uploadId: item.id,
              approved: true,
              flagged: false
            }
          ])
        "
      />
      <HoverChip
        color="red"
        :icon="RiAuctionLine"
        text="Rejection Actions..."
        @click="
          dialogs.report.value = true;
          dialogs.report.id = item.id;
          dialogs.report.user = item.user;
        "
      />
      <HoverChip
        color="red"
        :icon="item.flagged ? RiFlagFill : RiFlagLine"
        text="Flag for later"
        @click="
          act([
            {
              uploadId: item.id,
              approved: false,
              flagged: true
            }
          ])
        "
      />
      <HoverChip
        class="my-1"
        color="teal"
        :icon="RiFileCopyLine"
        text="Link"
        @click="$functions.copy($app.domain + item.attachment)"
      />
      <HoverChip
        :aria-label="$t('gallery.actions.download.aria')"
        :href="$app.domain + item.attachment + '?force=true'"
        :text="$t('gallery.actions.download.text')"
        target="_blank"
        class="my-1"
        color="primary"
        :icon="RiDownloadLine"
      />
      <HoverChip
        color="green"
        :icon="RiCheckDoubleLine"
        text="Trust user (exclude from queue)..."
        @click="
          dialogs.trusted.value = true;
          dialogs.trusted.id = item.userId;
          dialogs.trusted.username = item.user.username;
        "
      />
    </template>
  </Gallery>
</template>

<script setup lang="ts">
import {
  AdminPunishmentType,
  BanReason,
  GalleryType,
  UpdateAdminUploadInput,
  User,
  GalleryFilter
} from "@/gql/graphql";
import Gallery from "@/views/Gallery.vue";
import HoverChip from "@/components/Core/HoverChip.vue";
import {
  RiAdminLine,
  RiAuctionLine,
  RiCheckDoubleLine,
  RiCheckLine,
  RiClipboardLine,
  RiDownloadLine,
  RiFileCopyLine,
  RiFlagFill,
  RiFlagLine
} from "@remixicon/vue";
import { ref, useTemplateRef, watch } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { useAdminStore } from "@/store/admin.store";
import BanUser from "@/components/Admin/Dialogs/BanUser.vue";
import { useToast } from "vue-toastification";
import DangerZoneDialog from "@/components/Core/DangerZoneDialog.vue";

const adminStore = useAdminStore();

const gallery = useTemplateRef<any>("gallery");
const toast = useToast();
async function punish() {
  switch (dialogs.value.report.action) {
    case "FLAG":
      await adminStore.setApproval([
        {
          uploadId: dialogs.value.report.id,
          approved: false,
          flagged: true
        }
      ]);
      break;
    case "CUSTOM_BAN":
      toast.error("You must use the ban dialog instead.");
      break;
    case AdminPunishmentType.DeleteAccountImmediately:
      dialogs.value.report.dangerZone.dialog = true;
      break;
    case AdminPunishmentType.DeleteUpload:
      await adminStore.adminPunishment({
        uploadId: dialogs.value.report.id,
        type: dialogs.value.report.action,
        banReason: dialogs.value.report.banReason,
        password: "",
        totp: ""
      });
      break;
  }
  dialogs.value.report.value = false;
}

const loading = ref(false);

async function act(input: UpdateAdminUploadInput[]) {
  loading.value = true;
  await adminStore.setApproval(input);
  gallery.value.gallery.gallery.items =
    gallery.value.gallery.gallery.items.filter(
      (item) => !input.some((i) => i.uploadId === item.id)
    );
  const items = gallery.value.gallery.gallery.items;
  if (items.length <= 1) {
    await gallery.value.gallery.getGallery();
  }
  loading.value = false;
}

const dialogs = ref({
  trusted: {
    value: false,
    id: 0,
    username: ""
  },
  report: {
    value: false,
    id: 0,
    user: null as User | null,
    action: null as AdminPunishmentType | "FLAG" | "CUSTOM_BAN" | null,
    banReason: BanReason.Other,
    dangerZone: {
      dialog: false
    }
  }
});

const actions = [
  {
    id: "FLAG",
    name: "Flag"
  },
  {
    id: AdminPunishmentType.DeleteUpload,
    name: "Delete Upload"
  },
  {
    id: "CUSTOM_BAN",
    name: "Custom Ban (this will not remove the upload)..."
  },
  {
    id: AdminPunishmentType.DeleteAccountImmediately,
    name: "Delete Account Immediately"
  }
];

async function deleteAccount(event: {
  password: string;
  totp: string;
  passwordMode: boolean;
}) {
  await adminStore.adminPunishment({
    uploadId: dialogs.value.report.id,
    type: AdminPunishmentType.DeleteAccountImmediately,
    banReason: dialogs.value.report.banReason,
    password: event.password,
    totp: event.totp
  });
  dialogs.value.report.dangerZone.dialog = false;
  dialogs.value.report.value = false;
}

const banReasonTypes = [
  BanReason.PendingManualAccountDeletion,
  BanReason.Spam,
  BanReason.Harassment,
  BanReason.IllegalContent,
  BanReason.UnderAge,
  BanReason.Other
];

const banWizard = ref({
  dialog: false,
  user: null
});

watch(
  () => dialogs.value.report.action,
  (val) => {
    console.log(val);
    if (val === "CUSTOM_BAN") {
      banWizard.value.user = dialogs.value.report.user;
      banWizard.value.dialog = true;
    }
  }
);

function events(e) {
  if (e.key === "r") {
    console.log("Report selected");
  } else if (e.key === "a") {
    console.log("Approve selected");
  }
}

const filterTypes = [
  {
    name: "Admin Flagged",
    internalName: GalleryFilter.AdminFlagged
  },
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
</script>

<style scoped></style>
