// Reusable admin utilities
// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios";
import { useUserStore } from "@/store/user.store";
import { User } from "@/models/user";

export interface AdminState {}

export enum AccessLevel {
  "USER",
  "ADMIN",
  "MODERATOR",
  "NO_ACCESS"
}

export const useAdminStore = defineStore("admin", {
  state: () => ({} as AdminState),
  actions: {
    async getUsers() {
      const { data } = await axios().get("/admin/users");
      return data as User[];
    },
    async getExperimentValues(userId: number): Promise<Record<string, any>[]> {
      const { data } = await axios().get(`/admin/experiment/${userId}`);
      return data;
    }
  },
  getters: {
    accessLevel() {
      const user = useUserStore();
      if (!user.user) return AccessLevel.NO_ACCESS;
      if (user.user.administrator) return AccessLevel.ADMIN;
      if (user.user.moderator) return AccessLevel.MODERATOR;
      return AccessLevel.USER;
    }
  }
});
