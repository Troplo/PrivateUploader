<template>
  <div
    v-if="platform !== 'Android'"
    class="v-btn-group v-btn-group--divided v-btn-group--density-default v-btn-toggle"
  >
    <v-btn
      v-if="platform !== 'iOS'"
      class="download-button"
      style="height: 100%"
      :variant="outlined ? 'outlined' : 'tonal'"
      :href="
        downloadUrls[platform]?.filter(
          (item) => item.ext === defaults[platform]
        )[0]?.url
      "
    >
      <v-icon class="mr-3">{{ functions.platformIcon(platform) }}</v-icon>
      Download for {{ platform }} ({{ defaults[platform] }})
    </v-btn>
    <v-btn v-else class="download-button" disabled variant="tonal">
      Unavailable for iOS
    </v-btn>
    <v-btn
      class="download-button"
      :variant="outlined ? 'outlined' : 'tonal'"
      style="height: 100%"
      :disabled="platform === 'iOS'"
      v-if="downloadUrls[platform].length > 1"
    >
      <v-menu
        :close-on-content-click="false"
        offset-y
        location="right"
        activator="parent"
      >
        <v-card>
          <v-list>
            <v-list-item v-for="item in downloadUrls[platform]" :key="item.ext">
              <v-list-item-title>
                <a :href="item.url" target="_blank">Download {{ item.ext }}</a>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-icon>mdi-chevron-down</v-icon>
    </v-btn>
  </div>
  <a
    v-else
    href="https://play.google.com/store/apps/details?id=com.troplo.privateuploader"
  >
    <img
      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      target="_blank"
      width="200"
      class="align-center text-center"
    />
  </a>
</template>

<script lang="ts" setup>
import functions from "@/plugins/functions";
import axios from "axios";
import { onMounted, ref } from "vue";

defineProps({
  outlined: Boolean
});

const platform = functions.getPlatform();
const downloadUrls = ref({
  Windows: [],
  Linux: [],
  Mac: [],
  Android: []
});
const defaults = {
  Windows: "exe",
  Linux: "tar.gz",
  Mac: "dmg",
  Android: "Google Play"
};
const version = ref("");

async function getVersions() {
  const { data } = await axios.get(
    "https://updates.flowinity.com/versions/sorted"
  );

  downloadUrls.value = {
    Windows: [],
    Linux: [],
    Mac: [],
    Android: []
  };

  for (const ver of data.items) {
    if (ver.channel.name === "stable") {
      version.value = ver.name;

      for (const item of ver.assets) {
        switch (item.filetype) {
          case ".msi":
          case ".exe":
            downloadUrls.value.Windows.push({
              ext: item.filetype.replace(".", ""),
              url: `https://updates.flowinity.com/download/flavor/default/${version.value}/windows_64/${item.name}`
            });
            break;
          case ".AppImage":
          case ".deb":
          case ".rpm":
            downloadUrls.value.Linux.push({
              ext: item.filetype.replace(".", ""),
              url: `https://updates.flowinity.com/download/flavor/default/${version.value}/linux_64/${item.name}`
            });
            break;
          case ".gz":
            downloadUrls.value.Linux.push({
              ext: "tar.gz",
              url: `https://updates.flowinity.com/download/flavor/default/${version.value}/linux_64/${item.name}`
            });
            break;
          case ".pkg":
          case ".dmg":
            downloadUrls.value.Mac.push({
              ext: item.filetype.replace(".", ""),
              url: `https://updates.flowinity.com/download/flavor/default/${version.value}/mac/${item.name}`
            });
            break;
          default:
            break;
        }
      }
      break;
    }
  }

  downloadUrls.value.Android.push({
    ext: "Google Play",
    url: `https://play.google.com/store/apps/details?id=com.troplo.privateuploader`
  });

  return data;
}

onMounted(async () => {
  await getVersions();
});
</script>

<style scoped></style>
