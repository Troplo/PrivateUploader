<template>
  <BanUser v-model:ban-wizard="banWizard" />
  <CoreDialog
    v-if="subWizard.user"
    v-model="subWizard.dialog"
    max-width="600px"
    class="user-content"
  >
    <template #title>
      Subscription for {{ subWizard.user.username }} / {{ subWizard.user.id }}
    </template>

    <v-container>
      <strong>ID: {{ subWizard.user.id }}</strong>
      <br />
      <strong>Username: {{ subWizard.user.username }}</strong>
      <br />
      <strong>Email: {{ subWizard.user.email }}</strong>
      <br />
      <v-select
        v-model="subWizard.user.planId"
        :items="plans"
        label="Plan"
        item-title="name"
        item-value="id"
        outlined
      >
        <template #item="{ item, props }">
          <v-list-item v-bind="props">
            {{ item.raw.internalName }} / {{ item.raw.id }}
            <template v-if="item.raw.id === 6">
              <v-icon color="gold">mdi-star</v-icon>
            </template>
            <template v-if="item.raw.id === 7">
              <v-icon color="grey">mdi-star</v-icon>
            </template>
          </v-list-item>
        </template>
      </v-select>
      <small>
        Gold star refers to default paid subscription plan. Grey star refers to
        default free plan.
      </small>
      <div
        class="bg-red"
        v-if="
          !subWizard.user.subscription &&
          subWizard.user.planId !== 7 &&
          subWizard.user.planId !== 1
        "
      >
        <strong>
          WARNING: User does not have a subscription. Changing settings WILL
          create a subscription!
        </strong>
      </div>
      <date-picker-input v-model="subWizard.expiredAt" label="End" />
      <template v-if="subWizard.user.subscription">
        Payment method:
        {{ subWizard.user.subscription.metadata?.hours ? "Jitsi" : "Stripe" }}
      </template>
    </v-container>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        @click="
          subWizard.dialog = false;
          subWizard.user = undefined;
        "
      >
        Cancel
      </v-btn>
      <v-btn color="red" @click="gold">Save</v-btn>
    </v-card-actions>
  </CoreDialog>

  <v-container class="user-content">
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Users</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-text-field label="Search" v-model="search"></v-text-field>
        <v-data-table :headers="headers" :items="filteredUsers">
          <template #[`item.banned`]="{ item }: any">
            {{ item.banned ? "Yes" : "No" }}
            <template v-if="item.pendingDeletionDate">
              <v-kbd>
                DEL:
                {{ $date(item.pendingDeletionDate).format("YYYY/MM/DD") }}
              </v-kbd>
            </template>
            <br />
            <v-btn
              variant="tonal"
              @click="
                banWizard.user = item;
                banWizard.dialog = true;
              "
            >
              Ban...
            </v-btn>
          </template>
          <template #[`item.administrator`]="{ item }: any">
            <v-checkbox :model-value="item.administrator" :disabled="true" />
          </template>
          <template #[`item.plan.name`]="{ item }: any">
            {{ item.plan.name }}
            <br />
            <v-btn
              variant="tonal"
              class="gold-promo"
              @click="
                subWizard.user = item;
                subWizard.expiredAt = item.subscription?.expiredAt;
                subWizard.dialog = true;
              "
            >
              Sub...
            </v-btn>
          </template>
          <template #[`item.createdAt`]="{ item }: any">
            {{ $date(item.createdAt).format("YYYY/MM/DD hh:mm:ss A") }}
          </template>
          <template #[`item.emailVerified`]="{ item }: any">
            <v-checkbox
              v-model="item.emailVerified"
              @change="verify(item.id, $event.target.checked)"
            />
          </template>
          <template #[`item.trusted`]="{ item }: any">
            <v-checkbox
              :model-value="item.trusted"
              @change="setTrusted(item.id, $event.target.checked)"
            />
          </template>
        </v-data-table>
      </v-container>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { BanReason, User } from "@/gql/graphql";
import DatePickerInput from "@/components/Core/DatePickerInput.vue";
import { AdminPlansQuery } from "@/graphql/admin/getPlans.graphql";
import gql from "graphql-tag";
import BanUser from "@/components/Admin/Dialogs/BanUser.vue";
export default defineComponent({
  components: { BanUser, DatePickerInput, CoreDialog },
  data() {
    return {
      users: [],
      headers: [
        {
          title: "ID",
          key: "id"
        },
        {
          title: "Username",
          key: "username"
        },
        {
          title: "Email",
          key: "email"
        },
        {
          title: "Banned",
          key: "banned"
        },
        {
          title: "High level",
          key: "administrator"
        },
        {
          title: "Gold",
          key: "plan.name"
        },
        {
          title: "Email Verified",
          key: "emailVerified"
        },
        {
          title: "Created",
          key: "createdAt"
        },
        {
          title: "Uploads",
          key: "uploadsCount"
        },
        {
          title: "Messages",
          key: "messagesCount"
        },
        {
          title: "Risk Score",
          key: "riskScore"
        },
        {
          title: "Trusted",
          key: "trusted"
        }
      ],
      banWizard: {
        dialog: false,
        user: undefined as undefined | User
      },
      subWizard: {
        dialog: false,
        user: undefined as undefined | User,
        expiredAt: undefined as undefined | string
      },
      plans: [],
      search: ""
    };
  },
  mounted() {
    this.getUsers();
    this.getPlans();
  },
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        return (
          user.username.toLowerCase().includes(this.search.toLowerCase()) ||
          user.email.toLowerCase().includes(this.search.toLowerCase()) ||
          user.id.toString().includes(this.search)
        );
      });
    }
  },
  methods: {
    async getPlans() {
      const {
        data: { adminPlans }
      } = await this.$apollo.query({
        query: AdminPlansQuery
      });
      this.plans = adminPlans;
    },
    async gold() {
      await this.axios.patch("/admin/gold", {
        id: this.subWizard.user.id,
        planId: this.subWizard.user.planId,
        expiredAt: this.subWizard.expiredAt
      });
      this.$toast.success("User gold status updated.");
      this.subWizard.dialog = false;
    },
    async getUsers() {
      const { data } = await this.axios.get("/admin/users");
      this.users = data;
    },
    async verify(id: number, emailVerified: boolean) {
      await this.axios.patch("/admin/verify", { id, emailVerified });
      this.$toast.success("User email verified status updated.");
    },
    async setTrusted(id: number, trusted: boolean) {
      try {
        await this.$admin.setTrusted(id, trusted);
      } catch (e) {
        console.error(e);
      } finally {
        await this.getUsers();
      }
    }
  }
});
</script>
