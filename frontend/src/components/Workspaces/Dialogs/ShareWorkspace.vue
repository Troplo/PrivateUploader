<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>Workspace Sharing (BETA)</template>
    <v-card-text>
      <v-row>
        <v-col>
          <v-autocomplete
            :items="$friends.friends"
            item-title="user.username"
            item-value="user.id"
            v-model="sharing.id"
            label="Friend"
          />
        </v-col>
        <v-col>
          <v-select
            v-model="sharing.role"
            :items="sharing.roles"
            item-title="name"
            item-value="value"
            label="Role"
          />
        </v-col>
        <v-col sm="2">
          <v-btn @click="addUser">Add</v-btn>
        </v-col>
      </v-row>
      <v-data-table :headers="sharing.headers" :items="workspace.users">
        <template #item="row: any">
          <tr>
            <td>{{ row.item.user?.username }}</td>
            <td>
              <v-checkbox :model-value="row.item.read" disabled />
            </td>
            <td>
              <v-checkbox
                :model-value="row.item.write"
                :disabled="row.item.configure"
                @update:model-value="updateUser({ ...row.item, write: $event })"
              />
            </td>
            <td>
              <v-checkbox
                :model-value="row.item.configure"
                :disabled="row.item.recipientId === $user.user?.id"
                @update:model-value="
                  updateUser({ ...row.item, configure: $event })
                "
              />
            </td>
            <td>
              <v-btn
                :disabled="row.item.userId === $user.user?.id"
                icon
                @click="deleteUser(row.item)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
        <template #no-data>No data</template>
      </v-data-table>
      * Configure will allow the user to manage users, and delete notes.
      <br />
      * Write will allow the user to view and edit notes, but not create or
      delete them.
      <br />
      * Read will allow the user to view notes, but not edit or delete them.
      <br />
      EXPERIMENTAL!
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('update:modelValue', false)">Close</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { UpdateCollectionMutation } from "@/graphql/collections/updateCollection.graphql";
import { AddWorkspaceUserMutation } from "@/graphql/workspaces/user.graphql";

export default defineComponent({
  components: { CoreDialog },
  props: ["modelValue", "workspace"],
  emits: ["update:modelValue", "collectionUsersPush", "getCollection"],
  data() {
    return {
      sharing: {
        dialog: false,
        headers: [
          {
            title: "Username",
            key: "username"
          },
          {
            title: "Read",
            key: "read"
          },
          {
            title: "Write",
            key: "write"
          },
          {
            title: "Configure",
            key: "configure"
          },
          {
            title: "Actions",
            key: "actions"
          }
        ],
        roles: [
          {
            name: "Configure (rwc)",
            value: "rwc"
          },
          {
            name: "Write (rw)",
            value: "rw"
          },
          {
            name: "Read (r)",
            value: "ro"
          }
        ],
        role: "ro",
        id: null,
        users: [],
        public: "nobody",
        publicOptions: [
          {
            name: "Nobody",
            value: "nobody"
          },
          {
            name: "Anyone with the link",
            value: "link"
          }
        ],
        loading: false
      }
    };
  },
  methods: {
    async addUser() {
      const { data } = await this.$apollo.mutate({
        mutation: AddWorkspaceUserMutation,
        variables: {
          input: {
            userId: this.sharing.id,
            workspaceId: this.workspace.id,
            read: true,
            write: this.sharing.role === "rw" || this.sharing.role === "rwc",
            configure: this.sharing.role === "rwc"
          }
        }
      });
      this.$toast.success("Added. Does not refresh automatically for now.");
      this.$emit("collectionUsersPush", data);
      this.sharing.username = "";
      this.sharing.role = "ro";
    },
    async updateUser(item: any) {
      return this.$toast.info("Not implemented.");
      if (item.configure && !item.write) {
        item.write = true;
      }
      await this.axios.patch(`/collections/${this.collection.id}/user`, {
        id: item.recipientId,
        read: item.read,
        write: item.write,
        configure: item.configure
      });
    },
    async deleteUser(item: any) {
      return this.$toast.info("Not implemented.");
      await this.axios.delete(
        `/collections/${this.collection.id}/user/${item.recipientId}`
      );
      this.$toast.success("User removed successfully.");
      this.$emit("getCollection");
    }
  }
});
</script>
