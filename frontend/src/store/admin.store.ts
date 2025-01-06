// Reusable admin utilities
// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useUserStore } from "@/store/user.store";
import { User } from "@/models/user";
import { gql } from "@apollo/client/core";
import { computed, onMounted, ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { useToast } from "vue-toastification";
import {
  AdminPunishmentUploadInput,
  UpdateAdminUploadInput
} from "@/gql/graphql";

export interface AdminState {}

export enum AccessLevel {
  "USER",
  "ADMIN",
  "MODERATOR",
  "NO_ACCESS"
}

export const useAdminStore = defineStore("admin", () => {
  async function getUsers() {
    const { data } = await axios().get("/admin/users");
    return data as User[];
  }
  async function getExperimentValues(
    userId: number
  ): Promise<Record<string, any>[]> {
    const { data } = await axios().get(`/admin/experiment/${userId}`);
    return data;
  }
  async function setTrusted(userId: number, trusted: boolean) {
    const apollo = useApolloClient();
    await apollo.client.mutate({
      mutation: gql`
        mutation AdminSetTrusted($userId: Int!, $trusted: Boolean!) {
          adminSetTrusted(userId: $userId, trusted: $trusted) {
            success
          }
        }
      `,
      variables: { userId, trusted }
    });
    const toast = useToast();
    toast.success("User trusted status updated.");
  }
  async function setApproval(input: UpdateAdminUploadInput[]) {
    const apollo = useApolloClient();
    await apollo.client.mutate({
      mutation: gql`
        mutation AdminUpdateApprovedState($input: [UpdateAdminUploadInput!]!) {
          adminUpdateApprovedState(input: $input) {
            id
          }
        }
      `,
      variables: { input }
    });
    const toast = useToast();
    toast.success("Upload approval status updated.");
  }
  async function adminPunishment(input: AdminPunishmentUploadInput) {
    const apollo = useApolloClient();
    await apollo.client.mutate({
      mutation: gql`
        mutation AdminUploadPunishment($input: AdminPunishmentUploadInput!) {
          adminUploadPunishment(input: $input) {
            success
          }
        }
      `,
      variables: { input }
    });
    const toast = useToast();
    toast.success("Punishment applied.");
  }
  async function getCountApprovals() {
    const apollo = useApolloClient();
    const { data } = await apollo.client.query({
      query: gql`
        query AdminMQueueCount {
          adminMQueueCount
        }
      `
    });
    approvalCount.value = data.adminMQueueCount;
    return data.adminMQueueCount;
  }
  const approvalCount = ref(0);

  const accessLevel = computed(() => {
    const user = useUserStore();
    if (!user.user) return AccessLevel.NO_ACCESS;
    if (user.user.administrator) return AccessLevel.ADMIN;
    if (user.user.moderator) return AccessLevel.MODERATOR;
    return AccessLevel.USER;
  });

  return {
    getUsers,
    getExperimentValues,
    setTrusted,
    accessLevel,
    setApproval,
    adminPunishment,
    getCountApprovals,
    approvalCount
  };
});
