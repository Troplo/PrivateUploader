<template>
  <v-container class="center-container" :fluid="true">
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
        >
          <template v-if="!ban">
            <div
              v-if="$experiments.experiments.FLOWINITY"
              class="d-flex justify-center mt-4"
            >
              <FlowinityBanner
                style="width: 256px; height: auto"
              ></FlowinityBanner>
            </div>
            <p
              v-else
              class="text-center text-gradient mt-2"
              :style="
                $vuetify.display.mobile ? 'font-size: 38px' : 'font-size: 48px'
              "
            >
              {{ $app.site?.name || "Flowinity" }}
            </p>
            <v-container>
              <v-form>
                <v-text-field
                  v-model="username"
                  :autofocus="true"
                  label="Username or Email"
                  @keydown.enter="login"
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  @keydown.enter="login"
                />
                <v-text-field
                  v-model="totp"
                  label="2FA Code (if enabled)"
                  type="number"
                  @keydown.enter="login"
                />
              </v-form>
            </v-container>
            <v-card-actions class="mt-n9 mr-2">
              <v-spacer />
              <a class="pointer" @click="forgotPassword">
                I forgot my password
              </a>
            </v-card-actions>
            <v-card-actions>
              <v-btn to="/register">Register</v-btn>
              <v-spacer />
              <v-btn :loading="loading" color="primary" @click="login">
                Login
              </v-btn>
            </v-card-actions>
          </template>
          <template
            v-else-if="ban.type === BanReason.PendingManualAccountDeletion"
          >
            <v-card-title class="text-center" style="white-space: pre-line">
              <h2>Your account is pending deletion</h2>
            </v-card-title>
            <v-card-text>
              <p>
                You have requested the removal of your
                {{ $app.site.name }} account. Please contact
                {{ $app.site.name }} support at
                <a href="mailto:help@flowinity.com">help@flowinity.com</a>
                if you have any questions.
              </p>
              <p>
                <strong>Change your mind?</strong>
                Click the reactivate button to regain access to your account in
                an instant.
              </p>
              <p>
                <strong>Permanent account deletion:</strong>
                {{ $date(ban.pendingDeletionDate).format("MMMM Do, YYYY") }}
              </p>
              <v-btn
                variant="tonal"
                color="primary"
                class="mt-2"
                :loading="loading"
                @click="reactivate"
              >
                Reactivate
              </v-btn>
            </v-card-text>
          </template>
          <template v-else>
            <v-card-title class="text-center" style="white-space: pre-line">
              <h2>Your account has been banned</h2>
            </v-card-title>
            <v-card-text>
              <strong>
                Please contact Flowinity support at
                <a href="mailto:help@flowinity.com">help@flowinity.com</a>
                before the date below to appeal your ban.
              </strong>
              <p>
                <strong>Reason:</strong>
                {{ ban.message }}
              </p>
              <p>
                <strong>Permanent account deletion:</strong>
                {{ $date(ban.pendingDeletionDate).format("MMMM Do, YYYY") }}
              </p>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LoginMutation } from "@/graphql/auth/login.graphql";
import { BanReason, BanResponse, LoginMutationVariables } from "@/gql/graphql";
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";

export default defineComponent({
  name: "Login",
  computed: {
    BanReason() {
      return BanReason;
    }
  },
  components: { FlowinityBanner },
  data() {
    return {
      username: "",
      password: "",
      totp: "",
      loading: false,
      ban: null as BanResponse | null
    };
  },
  mounted() {
    this.$ui.currentNavItem = null;
    this.$app.title = "Login";
  },
  methods: {
    async forgotPassword() {
      this.loading = true;
      try {
        await this.axios.post("/auth/recover", {
          email: this.username
        });
        this.$toast.success(
          "Password reset email sent successfully, check your emails!"
        );
        this.loading = false;
      } catch {
        this.loading = false;
      }
    },
    async login() {
      this.loading = true;
      try {
        const { data } = await this.axios.post("/auth/login", {
          email: this.username,
          password: this.password,
          code: this.totp
        });
        await localStorage.setItem("token", data.token);
        this.axios.defaults.headers.common["Authorization"] = data.token;
        this.$app.token = data.token;
        if (!data.ban) {
          this.$user.loggedOut = false;
          await this.$app.init();
          if (!this.$route.query.redirect) {
            this.$router.push("/");
          } else {
            try {
              this.$router.push(this.$route.query.redirect);
            } catch {
              this.$router.push("/");
            }
          }
        } else {
          this.ban = data.ban;
        }
        this.$app.reconnectSocket(data.token);
        this.loading = false;
      } catch (e) {
        console.log(e);
        this.loading = false;
      }
    },
    async reactivate() {
      this.loading = true;
      try {
        await this.axios.patch("/auth/reactivate");
        this.$user.loggedOut = false;
        await this.$app.init();
        this.$app.reconnectSocket(this.$app.token);
        this.$toast.success("Account reactivated successfully");
        this.$router.push("/");
      } catch {
        this.loading = false;
      }
    }
  }
});
</script>
