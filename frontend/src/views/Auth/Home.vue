<template>
  <ColubrinaRedirect v-model="$app.dialogs.colubrina"/>
  <div class="register-hero">
    <div :class="{ 'mx-5 mobile': $vuetify.display.mobile }" class="hero-body">
      <div class="title">
        <accessible-transition name="slide-y-transition" mode="out-in">
          <p :key="slogan" class="text-6xl font-bold">
            {{ slogan }}
          </p>
        </accessible-transition>
      </div>
      <div class="subtitle">
        The
        <strong>versatile</strong>
        all-in-one online platform, for
        <strong>everyone.</strong>
      </div>
      <div class="mt-4">
        <div class="d-flex justify-center" style="height: 48px; gap: 10px" :class="{'mb-8': $vuetify.display.mobile}">
          <v-btn variant="outlined" style="height: 100%" to="/register">
            Register now
          </v-btn>
          <DownloadButton
            v-if="$app.platform === Platform.WEB && platform !== 'Android' && platform !== 'iOS' && !$vuetify.display.mobile"
            :outlined="true"/>
        </div>
        <p v-if="!$app.site.officialInstance" class="mb-n2 mt-4">
          This is a
          <a
            class="text-white font-weight-bold"
            rel="noopener"
            target="_blank"
            href="https://github.com/Flowinity/Flowinity"
          >
            Flowinity
          </a>
          instance.
        </p>
      </div>
    </div>
  </div>
  <v-container id="content">
    <v-card-title class="text-center mb-3 initial" style="font-size: 30px">Why <span
      class="text-gradient">{{ $app.site.name }}</span>?
    </v-card-title>
    <div class="d-flex flex-column" style="gap: 10px;">
      <PromoCard width="100%" title="Chat with friends in an instant!" image="https://i.flowinity.com/i/6bc5f9f7f4d3.png">
        As a fully-fledged chatting application, you can instantly contact your friends with direct messages and in
        groups.
      </PromoCard>
      <PromoCard width="100%" title="Have Full Control" image="https://i.flowinity.com/i/8ec635313416.png" :right="true">
        With {{ $app.site.name }} Communications you can now create "Ranks" which can be assigned to individual users
        with a vast number of different permissions to choose from.<br>
        <v-chip class="mt-1" variant="outlined">New in version 4</v-chip>
      </PromoCard>
      <PromoCard width="100%" title="Safely Store Your Files" image="https://i.flowinity.com/i/815f20a6f39e.png">
        With the Gallery, you can securely store files such as screenshots, images, videos, and other
        files.<br><br>{{ $app.site.name }} also integrates with ShareX, and has APIs to create various other
        integrations.
      </PromoCard>
      <PromoCard width="100%" title="Organization Made Easy" image="https://i.flowinity.com/i/8e62bab88002.png"
                 :right="true">
        You can add as many files as you please into Collections, which can be shared publicly, or to other
        {{ $app.site.name }} users with different permissions.
      </PromoCard>
      <PromoCard width="100%" title="Security First" image="https://i.flowinity.com/i/34f6a6a57bc9.png">
        With {{ $app.site.name }}, you can easily create as many API keys as you want, all with different account access
        permissions.<br><br>You can even create Alternate Passwords which have different account permissions when used.
      </PromoCard>
      <PromoCard width="100%" title="100% Open Source" image="https://i.flowinity.com/i/1ff020441915.png" :right="true">
        {{ $app.site.name }} is completely open source on GitHub, and can also be easily self-hosted bare-metal or under
        Docker (Only Linux supported).<br><br>
        <v-btn variant="outlined" href="https://github.com/Flowinity/Flowinity">
          <v-icon class="mr-2">mdi-star</v-icon>
          Star on GitHub
        </v-btn>
      </PromoCard>
    </div>
    <PromoCard
      :left="true"
      class="mb-6 mt-4"
      title="Report an Upload"
    >
      <p>
        Is there a file hosted on {{ $app.site.name }} that you believe violates
        our
        <router-link to="/policies/content">Content Policy?</router-link>
        Please report it here.
      </p>
      <div class="mt-4 mb-n2">
        <v-text-field
          v-model="report.tpuLink"
          color="white"
          label="URL to Report"
          outlined
          placeholder="https://i.flowinity.com/i/aae2fb2c0cf8.png"
          variant="filled"
          @keyup.enter="reportUpload"
        />
        <v-text-field
          v-model="report.content"
          auto-grow
          color="white"
          label="Reporting reason"
          placeholder="This upload violates the Content Policy because..."
          variant="filled"
          @keyup.enter="reportUpload"
        />
        <v-text-field
          v-model="report.email"
          color="white"
          label="Email to get back to you (optional)"
          outlined
          placeholder="troplo@troplo.com"
          variant="filled"
          @keyup.enter="reportUpload"
        />
        <v-card-actions>
          <v-spacer/>
          <v-btn
            :loading="report.loading"
            color="primary"
            @click="reportUpload"
          >
            Report
          </v-btn>
        </v-card-actions>
      </div>
    </PromoCard>
    <div v-if="$app.site.officialInstance" class="text-center">
      <small>Flowinity, formerly PrivateUploader.</small>
    </div>
  </v-container>
</template>

<script lang="ts">
import PromoCard from "@/components/Home/PromoCard.vue";
import {defineComponent} from "vue";
import DownloadButton from "@/components/Downloads/DownloadButton.vue";
import {Platform} from "@/store/app.store";
import functions from "@/plugins/functions";
import ColubrinaRedirect from "@/components/Home/ColubrinaRedirect.vue";
import AccessibleTransition from "@/components/Core/AccessibleTransition.vue";

export default defineComponent({
  name: "UnauthHome",
  components: {AccessibleTransition , ColubrinaRedirect, DownloadButton, PromoCard},
  data() {
    return {
      email: "",
      report: {
        tpuLink: "",
        content: "",
        email: "",
        loading: false
      },
      slogan: "Chat.",
      slogans: [
        "Chat.",
        "Share.",
        "Upload.",
        "Collaborate.",
        "Work.",
        "Flowinity."
      ],
      sloganInterval: undefined as number | undefined,
      platform: functions.getPlatform()
    };
  },
  computed: {
    Platform() {
      return Platform
    }
  },
  async mounted() {
    this.$ui.currentNavItem = null
    this.sloganInterval = setInterval(() => {
      this.slogan = this.slogans[(this.slogans.indexOf(this.slogan) + 1) % this.slogans.length];
    }, 2500);


    // Check $app.site.hostnames and window.location.hostname to see if we should redirect
    if (this.$app.site.release !== "dev") {
      await this.$app.init()
      if (
        this.$app.site.hostnames &&
        !this.$app.site.hostnames.includes(window.location.hostname)
      ) {
        window.location.href =
          (this.$app.site.hostnameWithProtocol ??
            "https://flowinity.com") + "/?redirected=true";
      }
    }
    this.$app.title = "Welcome";
    if (this.$route.query.ref === "colubrina") {
      this.$app.dialogs.colubrina = true;
    }
  },
  beforeUnmount() {
    if (this.sloganInterval !== undefined) {
      clearInterval(this.sloganInterval);
    }
  },
  methods: {
    async reportUpload() {
      this.report.loading = true;
      try {
        await this.axios.post("/core/report", this.report);
        this.report.loading = false;
        this.$toast.success(
          "Upload reported successfully! We will review it as soon as possible."
        );
        this.report.tpuLink = "";
        this.report.content = "";
        this.report.email = "";
      } catch {
        this.report.loading = false;
      }
    },
    getStarted() {
      this.$router.push({
        name: "Register",
        query: {
          email: this.email
        }
      });
    },
    scrollDown() {
      const content = document.getElementById("content");
      if (content) {
        content.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest"
        });
      }
    }
  }
});
</script>

<style lang="scss">
.register-hero {
  height: 400px;
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: rgba(0, 67, 143, 0.8);
  color: white !important;
}

.register-hero .v-btn__content {
  color: white !important;
}

.register-hero .hero-body {
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.register-hero .hero-body .title {
  font-size: 4rem;
  font-weight: 700;
}

.register-hero .mobile .title {
  font-size: 2.5rem;
}

.register-hero .subtitle {
  font-size: 1.5rem;
  font-weight: 500;
}

.register-hero .mobile .subtitle {
  font-size: 1.25rem;
}

.register-hero .learn-more {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
