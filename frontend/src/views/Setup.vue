<template>
  <NotFound v-if="step === -1" />
  <v-container
    style="align-items: center; height: 100%"
    class="d-flex justify-center align-center"
    v-if="step !== -1"
  >
    <transition-group name="slide-fade">
      <template v-if="step === 0">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <div class="flex flex-col items-center">
            <FlowinityBanner style="width: 300px" class="mt-6" />
            <v-container>
              <v-card-text>
                {{ $t("setup.step0.description") }}
              </v-card-text>
              <v-card-text class="text-grey">
                {{ $t("setup.step0.subtitle") }}
              </v-card-text>
            </v-container>
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn :loading="loading" color="primary" @click="step++">
              {{ $t("generic.next") }}
              <v-icon class="ml-1">arrow-right-s-line</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <template v-if="step === 1">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <v-card-title>
            {{ $t("setup.step1.title") }}
          </v-card-title>
          <v-card-text class="overflow text-grey">
            {{ $t("setup.step1.subtitle") }}
          </v-card-text>
          <v-form @submit="testMariaDBConnection">
            <v-card-text>
              <v-text-field
                v-model="database.host"
                :label="$t('setup.step1.host')"
                @keyup.enter="testMariaDBConnection"
              />
              <v-text-field
                v-model="database.port"
                :label="$t('setup.step1.port')"
                @keyup.enter="testMariaDBConnection"
              />
              <v-text-field
                v-model="database.database"
                :label="$t('setup.step1.database')"
                @keyup.enter="testMariaDBConnection"
              />
              <v-text-field
                v-model="database.username"
                :label="$t('setup.step1.username')"
                @keyup.enter="testMariaDBConnection"
              />
              <v-text-field
                v-model="database.password"
                :label="$t('setup.step1.password')"
                type="password"
                @keyup.enter="testMariaDBConnection"
              />
              <small class="text-red">
                <strong>IMPORTANT:</strong>
                {{ $t("setup.step1.mariaHint") }}
              </small>
            </v-card-text>
          </v-form>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="loading"
              color="primary"
              @click="testMariaDBConnection"
            >
              {{ $t("generic.next") }}
              <v-icon class="ml-1">arrow-right-s-line</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <template v-if="step === 2">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <v-card-title>
            {{ $t("setup.step5.title") }}
          </v-card-title>
          <v-card-text class="text-grey">
            {{ $t("setup.step5.subtitle") }}
          </v-card-text>
          <v-form @submit="createDefaultPlan">
            <v-card-text>
              <v-text-field
                v-model="plan.quotaMax"
                :label="$t('setup.step5.storage')"
                type="number"
              />
              <v-text-field
                v-model="plan.maxFileSize"
                :label="$t('setup.step5.maxUploadSize')"
                type="number"
              />
            </v-card-text>
          </v-form>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="loading"
              color="primary"
              @click="createDefaultPlan"
            >
              {{ $t("generic.next") }}
              <v-icon class="ml-1">arrow-right-s-line</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <template v-if="step === 3">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <v-card-title>
            {{ $t("setup.step2.title") }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t("setup.step2.subtitle") }}
          </v-card-subtitle>
          <v-form @submit="createAdminAccount">
            <v-card-text>
              <v-text-field
                v-model="admin.username"
                :label="$t('setup.step2.username')"
                :rules="$validation.user.username"
              />
              <v-text-field
                v-model="admin.email"
                :label="$t('setup.step2.email')"
                :rules="$validation.user.email"
              />
              <v-text-field
                v-model="admin.password"
                :label="$t('setup.step2.password')"
                :rules="$validation.user.password"
                type="password"
              />
              <v-text-field
                v-model="admin.passwordConfirm"
                :label="$t('setup.step2.passwordConfirm')"
                :rules="$validation.user.password"
                type="password"
              />
            </v-card-text>
          </v-form>
          <v-card-actions>
            <v-spacer />
            <v-btn
              :loading="loading"
              color="primary"
              @click="createAdminAccount"
            >
              {{ $t("generic.next") }}
              <v-icon class="ml-1">arrow-right-s-line</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <template v-if="step === 4">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <v-card-title>
            {{ $t("setup.step3.title") }}
          </v-card-title>
          <v-card-subtitle>
            {{ $t("setup.step3.subtitle") }}
          </v-card-subtitle>
          <v-form @submit="step++">
            <v-card-text>
              <v-text-field
                v-model="instance.name"
                :label="$t('setup.step3.name')"
              />
              <v-text-field
                v-model="instance.hostname"
                :label="$t('setup.step3.hostname')"
                placeholder="flowinity.com"
              />
              <v-text-field
                v-model="instance.hostnameWithProtocol"
                :label="$t('setup.step3.hostnameWithProtocol')"
                placeholder="https://flowinity.com"
              />
              <v-text-field
                v-model="instance.port"
                :label="$t('setup.step3.port')"
              />
              <v-text-field
                v-model="instance.multiThreaded"
                :label="$t('setup.step3.multiThreaded')"
              />
              <tpu-switch
                v-model="instance.allowRegistrations"
                :label="$t('setup.step3.allowRegistration')"
              />
              <v-text-field
                v-model="instance.redisHostname"
                :label="$t('setup.step3.redisHostname')"
              />
              <v-text-field
                v-model="instance.redisDatabase"
                :label="$t('setup.step3.redisDatabase')"
              />
              <v-text-field
                v-model="instance.redisPort"
                :label="$t('setup.step3.redisPort')"
              />
              <small class="text-red">
                <strong>IMPORTANT:</strong>
                {{ $t("setup.step3.redisHint") }}
              </small>
            </v-card-text>
          </v-form>
          <v-card-actions>
            <v-spacer />
            <v-btn :loading="loading" color="primary" @click="step++">
              {{ $t("generic.next") }}
              <v-icon class="ml-1">arrow-right-s-line</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <template v-if="step === 5">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <v-card-title>
            {{ $t("setup.step4.title") }}
          </v-card-title>
          <v-card-text class="text-grey overflow">
            {{ $t("setup.step4.subtitle") }}
          </v-card-text>
          <PromoCard
            :title="$t('setup.step4.collections.title')"
            class="my-3"
            image="https://i.troplo.com/i/3276e55f5ce4.png"
          >
            {{ $t("setup.step4.collections.description") }}
            <tpu-switch
              v-model="features.collections"
              hide-details
              style="display: flex; justify-content: center"
            />
          </PromoCard>
          <PromoCard
            :title="$t('setup.step4.autoCollects.title')"
            class="my-3"
            image="https://i.troplo.com/i/f8e3d77d3128.png"
          >
            {{ $t("setup.step4.autoCollects.description") }}
            <tpu-switch
              v-model="features.autoCollects"
              hide-details
              style="display: flex; justify-content: center"
            />
          </PromoCard>
          <PromoCard
            :title="$t('setup.step4.communications.title')"
            class="my-3"
            image="https://i.troplo.com/i/356a95ba22ff.png"
          >
            {{ $t("setup.step4.communications.description") }}
            <tpu-switch
              v-model="features.communications"
              hide-details
              style="display: flex; justify-content: center"
            />
          </PromoCard>
          <PromoCard
            :title="$t('setup.step4.insights.title')"
            class="my-3"
            image="https://i.troplo.com/i/ff3eda567a8e.png"
          >
            {{ $t("setup.step4.insights.description") }}
            <tpu-switch
              v-model="features.insights"
              hide-details
              style="display: flex; justify-content: center"
            />
          </PromoCard>
          <PromoCard
            :title="$t('setup.step4.workspaces.title')"
            class="my-3"
            image="https://i.troplo.com/i/d251cd7d08af.png"
          >
            {{ $t("setup.step4.workspaces.description") }}
            <tpu-switch
              v-model="features.workspaces"
              hide-details
              style="display: flex; justify-content: center"
            />
          </PromoCard>
          <v-card-actions>
            <v-btn @click="step--">Back</v-btn>
            <v-spacer />
            <v-btn
              :loading="loading"
              color="primary"
              @click="configureInstance"
            >
              {{ $t("generic.next") }}
              <v-icon class="ml-1">arrow-right-s-line</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <template v-if="step === 6">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
          :width="800"
        >
          <v-card-title>
            {{ $t("setup.step6.title") }}
          </v-card-title>
          <v-card-text class="text-grey overflow">
            {{ $t("setup.step6.subtitle") }}
          </v-card-text>

          <v-form>
            <v-card-text>
              <tpu-switch
                v-model="mail.enabled"
                :label="$t('setup.step6.enabled')"
              />
              <v-text-field
                v-model="mail.host"
                :label="$t('setup.step6.host')"
                required
              />
              <v-text-field
                v-model="mail.port"
                :label="$t('setup.step6.port')"
                required
              />
              <v-text-field
                v-model="mail.username"
                :label="$t('setup.step6.username')"
                required
              />
              <v-text-field
                v-model="mail.password"
                :label="$t('setup.step6.password')"
                required
                type="password"
              />
              <v-text-field
                v-model="mail.from"
                :label="$t('setup.step6.from')"
                required
              />
              <tpu-switch
                v-model="mail.secure"
                :label="$t('setup.step6.secure')"
              />
              <v-text-field
                v-model="mail.testEmail"
                :label="$t('setup.step6.testEmail')"
              />
            </v-card-text>
          </v-form>

          <v-card-actions>
            <v-spacer />
            <v-btn :loading="loading" @click="testMail">
              {{ $t("setup.step6.test") }}
            </v-btn>
            <v-btn :loading="loading" color="primary" @click="configureMail">
              {{ $t("generic.next") }}
              <v-icon class="ml-1">arrow-right-s-line</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </template>
      <template v-if="step === 7">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <v-card-title>
            {{ $t("setup.step9.title") }}
          </v-card-title>
          <v-card-text class="text-grey overflow">
            {{ $t("setup.step9.subtitle") }}
          </v-card-text>
          <v-form @submit.prevent.stop="setupDomain">
            <v-card-text>
              <v-text-field
                v-model="domain.domain"
                :label="$t('setup.step9.domain')"
                :placeholder="$t('setup.step9.example')"
                required
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn :loading="loading" @click="setupDomain">
                {{ $t("generic.next") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </template>
      <template v-if="step === 8">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <div class="flex flex-col items-center">
            <FlowinityBanner style="width: 300px" class="mt-6" />
            <v-container>
              <v-card-title>
                {{ $t("setup.step7.title") }}
              </v-card-title>
              <v-card-text class="text-grey overflow">
                {{ $t("setup.step7.subtitle") }}
              </v-card-text>
              <v-btn
                :loading="loading"
                class="mb-4"
                color="primary"
                @click="restartTPU"
              >
                {{ $t("setup.step7.restart") }}
              </v-btn>
            </v-container>
          </div>
        </v-card>
      </template>
      <template v-if="step === 9">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
          variant="outlined"
        >
          <div class="flex flex-col items-center">
            <FlowinityBanner style="width: 300px" class="mt-6" />
            <v-container>
              <v-card-text>
                {{ $t("setup.step8.title") }}
              </v-card-text>
            </v-container>
          </div>
        </v-card>
      </template>
    </transition-group>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoCard from "@/components/Home/PromoCard.vue";
import { gql } from "@apollo/client/core";
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";
import NotFound from "@/views/Errors/404.vue";

enum Step {
  Welcome = 0,
  DatabaseConfig,
  Plan,
  AdminUser,
  InstanceSetup,
  Features,
  Mail,
  Domain,
  Finish,
  Restarting
}

export default defineComponent({
  name: "InstanceSetupWizard",
  components: { NotFound, FlowinityBanner, PromoCard },
  data() {
    return {
      // TODO: GQL
      step: 0, // (this.$app.site?.step as Step) || (0 as Step),
      loading: false,
      database: {
        host: "localhost",
        port: 3306,
        database: "",
        username: "",
        password: ""
      },
      admin: {
        username: "",
        password: "",
        passwordConfirm: "",
        email: ""
      },
      instance: {
        name: "Flowinity",
        hostname: "",
        hostnameWithProtocol: "",
        port: 34582,
        allowRegistrations: true,
        multiThreaded: 0,
        redisHostname: "localhost",
        redisPort: "6379",
        redisDatabase: "0"
      },
      features: {
        autoCollects: true,
        collections: true,
        workspaces: true,
        insights: true,
        communications: true
      },
      plan: {
        quotaMax: "75866302316544",
        maxFileSize: "9223372036854775805"
      },
      mail: {
        host: "",
        port: "465",
        username: "",
        password: "",
        from: '"TroploPrivateUploader" <noreply@privateuploader.com>',
        secure: true,
        testEmail: "",
        enabled: true
      },
      domain: {
        domain: ""
      }
    };
  },
  watch: {
    "$app.site.step": {
      immediate: true,
      handler: function (step: Step) {
        this.step = step;
      }
    },
    "$app.site.dbHost": {
      immediate: true,
      handler: function () {
        // Interpret recommended database settings for Docker
        this.instance.redisHostname = this.$app.site.redisHost || "localhost";
        this.database.host = this.$app.site.dbHost || "localhost";
      }
    }
  },
  mounted() {
    this.getCurrentStep();
    this.$app.title = "Setup Wizard";
  },
  methods: {
    async setupDomain() {
      this.loading = true;
      try {
        await this.axios.post("/setup/domain", {
          domain: this.domain.domain
        });
        this.step++;
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async pollTPU() {
      this.loading = false;
      try {
        const { data } = (await this.axios.get("/core", {
          headers: {
            noToast: true
          }
        } as any)) as {
          data: {
            finishedSetup: boolean;
            step?: number;
          };
        };
        if (data.finishedSetup) {
          await this.$app.init();
          this.$router.push("/");
        } else if (data.step !== 0 && data.step !== 8) {
          this.step = data.step;
        } else {
          setTimeout(this.pollTPU, 1000);
        }
      } catch {
        setTimeout(this.pollTPU, 1000);
      }
    },
    async restartTPU() {
      this.loading = true;
      try {
        await this.axios.post("/setup/restart");
        this.step++;
        this.pollTPU();
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async testMail() {
      this.loading = true;
      try {
        await this.axios.post("/setup/mail/test", {
          host: this.mail.host,
          port: parseInt(this.mail.port),
          username: this.mail.username,
          password: this.mail.password,
          from: this.mail.from,
          secure: this.mail.secure,
          testEmail: this.mail.testEmail
        });
        this.$toast("Test email sent successfully.");
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async configureMail() {
      try {
        this.loading = true;
        await this.axios.post("/setup/mail", {
          host: this.mail.host,
          port: parseInt(this.mail.port),
          username: this.mail.username,
          password: this.mail.password,
          from: this.mail.from,
          secure: this.mail.secure,
          enabled: this.mail.enabled
        });
        this.step++;
        this.$toast("Successfully configured mail");
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async configureInstance() {
      try {
        this.loading = true;
        await this.axios.post("/setup/instance", {
          siteName: this.instance.name,
          hostname: this.instance.hostname,
          hostnameWithProtocol: this.instance.hostnameWithProtocol,
          port: this.instance.port,
          registrations: this.instance.allowRegistrations,
          threads: parseInt(this.instance.multiThreaded),
          features: this.features,
          redis: {
            db: parseInt(this.instance.redisDatabase),
            host: this.instance.redisHostname,
            port: parseInt(this.instance.redisPort)
          }
        });
        this.step++;
        this.$toast("Successfully configured instance");
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async testMariaDBConnection() {
      try {
        this.loading = true;
        await this.axios.post("/setup/database", {
          host: this.database.host,
          port: this.database.port,
          database: this.database.database,
          username: this.database.username,
          password: this.database.password
        });
        this.step = Step.Finish;
        this.$toast("Successfully connected to MariaDB server");
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async createAdminAccount() {
      try {
        this.loading = true;
        await this.axios.post("/setup/admin", {
          username: this.admin.username,
          password: this.admin.password,
          email: this.admin.email
        });
        this.step++;
        this.$toast("Successfully created admin account");
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async createDefaultPlan() {
      try {
        this.loading = true;
        await this.axios.post("/setup/plan", {
          name: "Free",
          quotaMax: parseInt(this.plan.quotaMax),
          maxFileSize: parseInt(this.plan.maxFileSize)
        });
        this.step++;
        this.$toast("Successfully created default plan");
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async getCurrentStep() {
      try {
        const { data } = await this.$apollo.query({
          query: gql`
            query GetSetupStep {
              setupStep
            }
          `
        });
        this.step = data.setupStep;
      } catch {}
    }
  }
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  display: none;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

:deep(.promo-card) {
  border-radius: 0 !important;
}
</style>
