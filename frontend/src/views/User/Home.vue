<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" sm="12">
        <v-text-field
          v-model="search"
          append-inner-icon="search-line"
          label="Search"
          placeholder="Search for a user"
          @keydown.enter="getUsers"
          @click:append-inner="getUsers"
        />
      </v-col>
      <v-col cols="12" md="4" sm="12">
        <v-select
          v-model="sortVal"
          :items="sortOptions"
          item-title="text"
          item-value="value"
          label="Sort by"
          @change="getUsers"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="user in users" :key="user.id" cols="12" md="3" sm="6">
        <v-card class="rounded-xl" elevation="7" height="215">
          <v-container class="justify-center align-center">
            <div class="justify-center align-center text-center">
              <router-link
                :to="'/u/' + user.username"
                style="text-decoration: none"
              >
                <UserAvatar
                  :no-badges="true"
                  :size="80"
                  :status="true"
                  :status-x-offset="10"
                  :status-y-offset="25"
                  :user="user"
                />
              </router-link>
            </div>
            <v-card-title class="text-center user-content">
              <router-link
                :to="'/u/' + user.username"
                style="text-decoration: none; color: unset"
              >
                <v-tooltip
                  v-if="$friends.getName(user.id, true)"
                  :eager="false"
                  activator="parent"
                  location="top"
                >
                  {{ user.username }}
                </v-tooltip>
                {{ $friends.getName(user.id) || user.username }}
              </router-link>
            </v-card-title>
            <UserBadges :user="user" class="justify-center mt-n1 mb-2" />
            <div class="ml-n1 text-center justify-center limit user-content">
              {{ user.description }}
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <Paginate
      v-if="users.length"
      v-model="page"
      :per-page="20"
      :total-pages="pagination.totalPages"
      class="mt-4"
    />
    <PromoNoContent
      v-if="!$app.componentLoading && !users.length"
      description="Try searching for something else."
      icon="search-line"
      title="No users found"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PromoNoContent from "@/components/Core/PromoNoContent.vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import UserBadges from "@/components/Users/UserBadges.vue";
import Paginate from "@/components/Core/Paginate.vue";
import { PartialUserPublic } from "@/gql/graphql";

export default defineComponent({
  name: "UserHome",
  components: { Paginate, UserBadges, UserAvatar, PromoNoContent },
  data() {
    return {
      users: [] as PartialUserPublic[],
      pagination: {
        totalItems: 0,
        totalPages: 0,
        pageSize: 20,
        currentPage: 1
      },
      sort: "createdAt",
      order: "desc",
      search: "",
      page: 1,
      sortOptions: [
        {
          text: "Newest users",
          value: "createdAt desc"
        },
        {
          text: "Oldest users",
          value: "createdAt asc"
        },
        {
          text: "Username (A-Z)",
          value: "username asc"
        },
        {
          text: "Username (Z-A)",
          value: "username desc"
        }
      ]
    };
  },
  computed: {
    sortVal: {
      get() {
        return this.sort + " " + this.order;
      },
      set(val: string) {
        const [sort, order] = val.split(" ");
        this.sort = sort;
        this.order = order;
        this.getUsers();
      }
    }
  },
  watch: {
    page() {
      this.getUsers();
    }
  },
  mounted() {
    this.$app.title = "Users";
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.$app.componentLoading = true;
      const { data } = await this.axios.get("/user/all", {
        params: {
          sort: this.sort,
          order: this.order,
          search: this.search,
          page: this.page
        }
      });
      this.users = data.users;
      this.pagination = data.pager;
      this.$app.componentLoading = false;
    }
  }
});
</script>
