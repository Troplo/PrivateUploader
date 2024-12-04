<template>
  <v-container
    v-if="inviter || $app.site.registrations"
    class="center-container"
    :fluid="true"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
        >
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
            <v-form v-model="form">
              <v-text-field
                v-model="username"
                :rules="$validation.user.username"
                :autofocus="true"
                label="Username"
                @keydown.enter="register"
              />
              <v-text-field
                v-model="email"
                :rules="$validation.user.email"
                label="Email"
                @keydown.enter="register"
              />
              <v-text-field
                v-model="password"
                :rules="$validation.user.password"
                label="Password"
                type="password"
                @keydown.enter="register"
              />
              <div class="d-flex mt-n4">
                <v-checkbox v-model="terms" class="flex-0 flex-grow-0" />
                <span
                  class="ml-4 mt-4 flex-grow-1 unselectable pointer"
                  @click="terms = !terms"
                >
                  <span>I agree to the</span>
                  <router-link
                    style="text-decoration: none; color: #0190ea"
                    to="/policies/content"
                  >
                    Content Policy
                  </router-link>
                  and the
                  <router-link
                    style="text-decoration: none; color: #0190ea"
                    to="/policies/privacy"
                  >
                    Privacy Policy
                  </router-link>
                </span>
              </div>
            </v-form>
            <small v-if="fact">Fun fact: {{ fact }}</small>
          </v-container>
          <v-card-actions :class="!fact ? 'mt-n10' : ''">
            <v-btn to="/login">
              <v-icon class="mr-1">mdi-arrow-left</v-icon>
              Login
            </v-btn>
            <v-spacer />
            <v-btn
              :disabled="!form || !terms"
              :loading="loading"
              color="primary"
              @click="register"
            >
              Register
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container
    v-else-if="!$app.componentLoading"
    class="center-container"
    :fluid="true"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" md="7" sm="8" xl="5">
        <v-card
          :color="$vuetify.display.mobile ? 'transparent' : 'card'"
          :elevation="$vuetify.display.mobile ? 0 : 8"
          :flat="$vuetify.display.mobile"
          class="text-center"
        >
          <p class="text-center text-gradient mb-n5" style="font-size: 64px">
            {{ $app.site?.name || "PrivateUploader" }}
          </p>
          <v-card-text>
            {{ $app.site?.name || "PrivateUploader" }} is not currently
            accepting registrations.
            <br />
            If you'd like to join, you need to be invited by a current member.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { TYPE } from "vue-toastification";
import { RegisterMutationVariables } from "@/gql/graphql";
import { RegisterMutation } from "@/graphql/auth/register.graphql";
import FlowinityBanner from "@/components/Brand/FlowinityBanner.vue";

export default defineComponent({
  name: "Register",
  components: { FlowinityBanner },
  data() {
    return {
      terms: false,
      form: false,
      username: "",
      password: "",
      email: "",
      inviteKey: "",
      loading: false,
      inviter: null as { username: string; id: number } | null,
      facts: [] as string[],
      fact: ""
    };
  },
  mounted() {
    this.$ui.currentNavItem = null;
    this.$app.title = "Register";
    this.inviteKey = this.$route.params.key as string;
    this.getInviteKey();
    if (this.$route.query.email) {
      this.email = this.$route.query.email as string;
    }
  },
  methods: {
    async getInviteKey() {
      if (this.$route.params.key) {
        this.$app.componentLoading = true;
        const { data } = await this.axios.get(
          `/invites/${this.$route.params.key}`
        );
        this.email = data.email;
        this.inviter = {
          username: data.user.username,
          id: data.user.id
        };
        this.facts = data.facts;
        this.fact = this.facts[Math.floor(Math.random() * this.facts.length)];
        setInterval(() => {
          const fact = this.fact;
          this.fact = this.facts[Math.floor(Math.random() * this.facts.length)];
          if (fact === this.fact) {
            this.fact =
              this.facts[Math.floor(Math.random() * this.facts.length)];
          }
        }, 5000);
        this.$app.componentLoading = false;
      }
    },
    async register() {
      if (!this.terms) return;
      this.loading = true;
      try {
        const { data } = await this.axios.post("/auth/register", {
          email: this.email,
          username: this.username,
          password: this.password,
          inviteKey: this.inviteKey
        });
        await localStorage.setItem("token", data.token);
        this.axios.defaults.headers.common["Authorization"] = data.token;
        this.$app.token = data.token;
        this.$user.loggedOut = false;
        await this.$app.init();
        this.$app.reconnectSocket(data.token);
        this.$router.push("/");
        this.$toast.success(
          `You have been registered, welcome to ${this.$app.site.name}!`,
          {
            timeout: 3000,
            type: TYPE.SUCCESS
          }
        );
        this.$user.resendVerificationEmail();
      } catch {
        this.loading = false;
      }
    }
  }
});
</script>
