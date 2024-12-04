<template>
  <CoreDialog
    v-if="banWizard.user"
    v-model="banWizard.dialog"
    max-width="600px"
    class="user-content"
  >
    <template #title>
      Ban {{ banWizard.user.username }} / {{ banWizard.user.id }}
    </template>

    <v-container>
      <strong>ID: {{ banWizard.user.id }}</strong>
      <br />
      <strong>Username: {{ banWizard.user.username }}</strong>
      <br />
      <strong>Email: {{ banWizard.user.email }}</strong>
      <br />

      <v-checkbox v-model="banWizard.user.banned" label="Banned" class="mt-2" />
      <v-textarea
        v-model="banWizard.user.banReason"
        label="Reason (Shown to user, GUI does not show Reason Type if filled)"
        outlined
        rows="1"
      ></v-textarea>
      <v-select
        v-model="banWizard.user.banReasonType"
        :items="banReasonTypes"
        label="Reason Type (Shown to user if no Reason is filled)"
        outlined
      />
      <date-picker-input
        v-model="banWizard.user.pendingDeletionDate"
        label="Permanent account deletion date"
        outlined
        class="mb-2"
      />
      <small class="text-red">
        This will delete all their Flowinity data after this date, the same
        system is used for account deletion in Settings > Account. If a user
        requested their account deleted immediately, you can use this and set
        "PENDING_MANUAL_ACCOUNT_DELETION" as the reason, this acts identically
        to Settings account deletion, and the user will be able to reactivate
        their account until the date passes. Any other types will not permit the
        user to reactivate their account.
      </small>
      <br />
      <small>ALL FIELDS ARE REQUIRED</small>
    </v-container>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        @click="
          banWizard.dialog = false;
          banWizard.user = undefined;
        "
      >
        Cancel
      </v-btn>
      <v-btn color="red" @click="ban()">Ban</v-btn>
    </v-card-actions>
  </CoreDialog>
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
        <v-data-table :headers="headers" :items="users">
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

export default defineComponent({
  components: { DatePickerInput, CoreDialog },
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
        }
      ],
      banWizard: {
        dialog: false,
        user: undefined as undefined | User
      },
      banReasonTypes: [
        BanReason.PendingManualAccountDeletion,
        BanReason.Spam,
        BanReason.Harassment,
        BanReason.IllegalContent,
        BanReason.UnderAge,
        BanReason.Other
      ],
      subWizard: {
        dialog: false,
        user: undefined as undefined | User,
        expiredAt: undefined as undefined | string
      },
      plans: []
    };
  },
  mounted() {
    this.getUsers();
    this.getPlans();
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
    async ban() {
      await this.axios.patch("/admin/ban", {
        id: this.banWizard.user.id,
        banned: this.banWizard.user.banned,
        banReason: this.banWizard.user.banReason,
        banReasonType: this.banWizard.user.banReasonType,
        pendingDeletionDate: this.banWizard.user.pendingDeletionDate
      });
      this.$toast.success("User banned.");
      this.banWizard.dialog = false;
    },
    async getUsers() {
      const { data } = await this.axios.get("/admin/users");
      this.users = data;
    },
    async verify(id: number, emailVerified: boolean) {
      await this.axios.patch("/admin/verify", { id, emailVerified });
      this.$toast.success("User email verified status updated.");
    }
  }
});
</script>
