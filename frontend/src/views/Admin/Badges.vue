<template>
  <v-container>
    <CoreDialog v-model="dialog.value" max-width="600">
      <template #title>Edit badge</template>
      <v-col>
        <v-text-field v-model="dialog.item.name" label="Name" />
      </v-col>
      <v-col>
        <v-text-field v-model="dialog.item.tooltip" label="Tooltip" />
      </v-col>
      <v-col>
        <v-text-field v-model="dialog.item.color" label="Color" />
      </v-col>
      <v-col>
        <v-text-field v-model="dialog.item.description" label="Description" />
      </v-col>
      <v-col>
        <v-text-field v-model="dialog.item.icon" label="Icon" />
      </v-col>
      <v-col>
        <v-text-field v-model="dialog.item.image" label="Image" />
      </v-col>
      <v-col>
        <v-checkbox v-model="dialog.item.unlocked" label="Unlocked" />
      </v-col>
      <v-col>
        <v-text-field
          v-model="dialog.item.planId"
          label="Plan ID"
          type="number"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="dialog.item.priority"
          label="Priority"
          type="number"
        />
      </v-col>
      <v-btn @click="updateItem">Update</v-btn>
    </CoreDialog>
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Badges</v-toolbar-title>
      </v-toolbar>
      <v-container>
        <v-card-title>Add badges to user</v-card-title>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="selectedBadge"
              :items="badges"
              item-title="name"
              item-value="id"
              label="Badges"
            />
          </v-col>
          <v-col>
            <v-autocomplete
              v-model="selectedUser"
              :items="users"
              item-title="username"
              item-value="id"
              label="Users"
              multiple
            />
          </v-col>
        </v-row>
        <v-btn @click="addBadges">Add badges</v-btn>
        <v-btn class="ml-2" @click="removeBadges">Remove badges</v-btn>
        <v-card-title>Create badge</v-card-title>
        <v-row>
          <v-col>
            <v-text-field v-model="create.name" label="Name" />
          </v-col>
          <v-col>
            <v-text-field v-model="create.tooltip" label="Tooltip" />
          </v-col>
          <v-col>
            <v-text-field v-model="create.color" label="Color" />
          </v-col>
          <v-col>
            <v-text-field v-model="create.description" label="Description" />
          </v-col>
          <v-col>
            <v-text-field v-model="create.icon" label="Icon" />
          </v-col>
          <v-col>
            <v-text-field v-model="create.image" label="Image" />
          </v-col>
          <v-col>
            <v-checkbox v-model="create.unlocked" label="Unlocked" />
          </v-col>
          <v-col>
            <v-text-field
              v-model="create.planId"
              label="Plan ID"
              type="number"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="create.priority"
              label="Prority"
              type="number"
            />
          </v-col>
        </v-row>
        <v-btn @click="createBadge">Create badge</v-btn>
      </v-container>
      <v-data-table :headers="headers" :items="badges" :items-per-page="-1">
        <template #[`item.actions`]="{ item }: any">
          <v-btn
            icon
            @click="
              dialog.value = true;
              dialog.item = item;
            "
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="deleteItem(item.id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";

export default defineComponent({
  name: "Badges",
  components: { CoreDialog },
  data() {
    return {
      dialog: {
        value: false,
        item: null as any
      },
      badges: [],
      users: [],
      selectedBadge: undefined as number | undefined,
      selectedUser: [] as number[],
      headers: [
        { title: "ID", key: "id" },
        { title: "Name", key: "name" },
        { title: "Tooltip", key: "tooltip" },
        { title: "Color", key: "color" },
        { title: "Description", key: "description" },
        { title: "Icon", key: "icon" },
        { title: "Image", key: "image" },
        { title: "Unlocked", key: "unlocked" },
        { title: "Plan ID", key: "planId" },
        {
          title: "Users count",
          key: "users.length"
        },
        {
          title: "Actions",
          key: "actions"
        }
      ],
      create: {
        name: "",
        tooltip: "",
        color: "",
        description: "",
        icon: "",
        image: "",
        unlocked: false,
        planId: null,
        priority: 0
      }
    };
  },
  mounted() {
    this.getUsers();
    this.getBadges();
  },
  methods: {
    async removeBadges() {
      await this.axios.post("/admin/badge/users/delete", {
        id: this.selectedBadge,
        userIds: this.selectedUser
      });
      await this.getBadges();
    },
    async deleteItem(id: number) {
      await this.axios.delete(`/admin/badge/${id}`);
      await this.getBadges();
      this.$toast.success("yes");
    },
    async updateItem() {
      await this.axios.put("/admin/badge", this.dialog.item);
      await this.getBadges();
      this.dialog.value = false;
      this.$toast.success("yes");
    },
    async getBadges() {
      const { data } = await this.axios.get("/admin/badges");
      this.badges = data;
    },
    async getUsers() {
      const { data } = await this.axios.get("/admin/users");
      this.users = data;
    },
    async addBadges() {
      await this.axios.post("/admin/badge/users", {
        id: this.selectedBadge,
        userIds: this.selectedUser
      });
      await this.getBadges();
      this.$toast.success("yes");
      this.selectedBadge = undefined;
      this.selectedUser = [];
    },
    async createBadge() {
      await this.axios.post("/admin/badge", this.create);
      await this.getBadges();
      this.$toast.success("yes");
      this.create = {
        name: "",
        tooltip: "",
        color: "",
        description: "",
        icon: "",
        image: "",
        unlocked: false,
        planId: null,
        priority: 0
      };
    }
  }
});
</script>
