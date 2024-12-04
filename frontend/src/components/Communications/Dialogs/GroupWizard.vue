<template>
  <CoreDialog v-model="model" :max-width="600" class="wizard-transition">
    <template #toolbar>
      <div class="position-relative">
        <div
          class="d-flex justify-space-between flex-1 mt-3 ml-2 position-absolute"
          style="width: 100%"
        >
          <v-btn
            class="mr-2"
            icon
            size="small"
            v-if="selection"
            @click="selection = null"
          >
            <v-icon>arrow-left-s-line</v-icon>
          </v-btn>
          <div v-else />
          <v-btn class="mr-4" icon size="small" @click="model = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="flex-grow text-center mt-4">
          <p class="text-h5 font-weight-bold">
            <template v-if="step === Step.Invite">
              Invite others to your group
            </template>
            <template v-else>Get in on the conversation</template>
          </p>
          <v-card-subtitle
            v-if="
              selection === 'create' &&
              step === Step.Create &&
              type === ChatType.Group
            "
          >
            Get started by selecting some friends, or creating an empty group.
          </v-card-subtitle>
          <v-card-subtitle
            v-else-if="
              selection === 'create' &&
              step === Step.Create &&
              type === ChatType.Direct
            "
          >
            Start a new conversation with a friend
          </v-card-subtitle>
          <v-card-subtitle
            v-else-if="selection === 'join' && step === Step.Create"
          >
            Join an existing group
          </v-card-subtitle>
          <v-card-subtitle v-else-if="step === Step.Invite">
            Share this link with any other friends you want to join your group
          </v-card-subtitle>
        </div>
      </div>
    </template>
    <div>
      <transition-group name="scroll-x-reverse-transition">
        <template v-if="!selection">
          <div>
            <div
              class="d-flex justify-center"
              :class="{ 'flex-column': $vuetify.display.mobile }"
            >
              <v-card
                variant="outlined"
                elevation="0"
                class="d-flex justify-center mx-4 my-4 py-4"
                width="100%"
                @click="
                  selection = 'create';
                  type = ChatType.Group;
                  step = Step.Create;
                "
              >
                <div class="d-flex flex-column align-center">
                  <v-btn variant="outlined" icon size="96" :ripple="false">
                    <v-icon class="mr-1" size="48">chat-new-line</v-icon>
                  </v-btn>
                  <v-card-title class="text-h6">
                    Create a new group
                  </v-card-title>
                  <v-card-subtitle class="text-caption">
                    Create a new group with your friends
                  </v-card-subtitle>
                </div>
              </v-card>
              <v-card
                variant="outlined"
                elevation="0"
                class="d-flex justify-center mx-4 my-4 py-4"
                width="100%"
                @click="
                  selection = 'join';
                  step = Step.Create;
                "
              >
                <div class="d-flex flex-column align-center">
                  <v-btn variant="outlined" icon size="96" :ripple="false">
                    <v-icon class="mr-1" size="48">group-line</v-icon>
                  </v-btn>
                  <v-card-title class="text-h6">Have an invite?</v-card-title>
                  <v-card-subtitle class="text-caption">
                    Join an existing group
                  </v-card-subtitle>
                </div>
              </v-card>
            </div>
            <v-card
              variant="outlined"
              elevation="0"
              class="d-flex justify-center mx-4 mb-4"
              @click="
                selection = 'create';
                type = ChatType.Direct;
                step = Step.Create;
              "
            >
              <div class="d-flex align-center justify-center">
                <v-icon>user-add-line</v-icon>
                <v-card-title>Start a direct message</v-card-title>
              </div>
            </v-card>
          </div>
        </template>
        <template v-else-if="selection === 'create' && step === Step.Create">
          <CreateChatWizard
            :type="type"
            class="mt-4"
            @done="
              createdChat = $event;
              generateInvite();
              step = Step.Invite;
            "
          />
        </template>
        <template v-else-if="step === Step.Invite">
          <v-text-field
            readonly
            variant="outlined"
            class="blur-hover my-4 mx-4"
            color="white"
            :model-value="`${$app.site.hostnameWithProtocol}/invite/${generatedInvite}`"
            append-icon="file-copy-line"
            @click:append="
              $functions.copy(
                `${$app.site.hostnameWithProtocol}/invite/${generatedInvite}`
              )
            "
          ></v-text-field>
        </template>
        <template v-else-if="step === Step.Create && selection === 'join'">
          <v-text-field
            v-model="invite"
            label="Invite code"
            hint="Enter the invite code you received"
            class="mx-5 my-4"
            autofocus
            placeholder="200847c91a"
            @keydown.enter="loading ? () => {} : joinChat()"
          />
          <p class="text-wrap text-subtitle-2 mx-5">
            An invite code will look like one of the following:
            <br />
            -
            <code class="text-grey">
              {{ $app.site.hostnameWithProtocol }}/invite/200847c91a
            </code>
            <br />
            -
            <code class="text-grey">200847c91a</code>
            <br />
            -
            <code class="text-grey">flowinity</code>
          </p>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="joinChat()" :loading="loading">
              Join
            </v-btn>
          </v-card-actions>
        </template>
      </transition-group>
      <v-card-actions v-if="step === Step.Invite">
        <v-spacer />
        <v-btn color="primary" @click="model = false">Finish</v-btn>
      </v-card-actions>
    </div>
  </CoreDialog>
</template>

<script lang="ts" setup>
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { ref, watch } from "vue";
import CreateChatWizard from "@/components/Communications/Dialogs/GroupWizard/CreateChatWizard.vue";
import { Chat, ChatType, CreateChatInviteDocument } from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { useChatStore } from "@/store/chat.store";
import { useRouter } from "vue-router";

enum Step {
  Home,
  Create,
  Invite
}

const model = defineModel({
  type: Boolean,
  default: false
});
const selection = ref<"create" | "join" | null>(null);
const step = ref<Step>(Step.Home);
const type = ref<ChatType | null>(null);
const createdChat = ref<Chat | null>(null);
const loading = ref(false);
const generatedInvite = ref<string | null>(null);
const invite = ref<string>("");
const apolloClient = useApolloClient();
const chatStore = useChatStore();
const router = useRouter();

watch(model, (value) => {
  if (value) {
    selection.value = null;
    step.value = Step.Home;
    type.value = null;
    createdChat.value = null;
    loading.value = false;
    generatedInvite.value = null;
    invite.value = "";
  }
});

async function generateInvite() {
  if (type.value === ChatType.Direct) {
    model.value = false;
    return;
  }
  if (!createdChat.value) return;
  try {
    loading.value = true;
    const {
      data: { createChatInvite }
    } = await apolloClient.client.mutate({
      mutation: CreateChatInviteDocument,
      variables: {
        input: {
          associationId: createdChat.value.association.id
        }
      }
    });
    generatedInvite.value = createChatInvite.id;
  } finally {
    loading.value = false;
  }
}

async function joinChat() {
  if (!invite.value) return;
  try {
    const data = await chatStore.joinInvite(invite.value);
    router.push(`/communications/${data.id}`);
    model.value = false;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.scroll-x-reverse-transition-leave-active {
  position: absolute;
}
</style>

<style>
.wizard-transition * {
  scrollbar-width: none;
}
</style>

<!--
<style>
.blur-hover .v-field__field {
  filter: blur(5px);
  transition: filter 0.2s;
}

.blur-hover .v-input__append {
  filter: blur(0);
}

.blur-hover .v-field__field:hover .v-field__field {
  filter: blur(0);
}
</style>
-->
