// Utilities
import { defineStore } from "pinia";
import { useApolloClient } from "@vue/apollo-composable";
import { computed, ref, watch } from "vue";
import { gql } from "@apollo/client/core";
import {
  ExperimentOverrideInput,
  Experiments,
  ExperimentsDocument,
  SetExperimentDocument,
  ExperimentsQuery
} from "@/gql/graphql";

export const useExperimentsStore = defineStore("experiments", () => {
  const experimentsConfig = ref<ExperimentsQuery["experiments"]>([
    {
      id: Experiments.NEW_BRANDING,
      value: 1
    },
    {
      id: Experiments.EDITOR_V2,
      value: 0
    },
    {
      id: Experiments.WIDGETS,
      value: 0
    },
    {
      id: Experiments.BADGES,
      value: 0
    },
    {
      id: Experiments.NATIVE_BADGES,
      value: 1
    },
    {
      id: Experiments.REMOVE_LEGACY_SOCKET,
      value: 1
    },
    {
      id: Experiments.CHAT_CACHING,
      value: 10
    },
    {
      id: Experiments.COPY_MSG_ID,
      value: 0
    },
    {
      id: Experiments.WEATHER,
      value: 1
    },
    {
      id: Experiments.BREADCRUMB_SHOW_PARENT,
      value: 0
    },
    {
      id: Experiments.COMMS_SUPERBAR,
      value: 1
    },
    {
      id: Experiments.PROGRESSIVE_HOME,
      value: 0
    },
    {
      id: Experiments.DISABLE_ANIMATIONS,
      value: 0
    },
    {
      id: Experiments.PROGRESSIVE_UI,
      value: 1
    },
    {
      id: Experiments.CHAT_GUIDED_WIZARD,
      value: 1
    },
    {
      id: Experiments.NOTE_COLLAB,
      value: 0
    },
    {
      id: Experiments.IAF_NAG,
      value: 0
    },
    {
      id: Experiments.DOWNLOAD_THE_APP_NAG,
      value: 0
    },
    {
      id: Experiments.ENABLE_AUTOSTART_APP_NAG,
      value: 0
    },
    {
      id: Experiments.DEBUG_FAVICON,
      value: 0
    },
    {
      id: Experiments.FLOWINITY,
      value: 1
    },
    {
      id: Experiments.PRIDE,
      value: 0
    },
    {
      id: Experiments.NOTIFICATION_SOUND,
      value: 1
    },
    {
      id: Experiments.RESIZABLE_SIDEBARS,
      value: 0
    },
    {
      id: Experiments.OFFICIAL_INSTANCE,
      value: 1
    },
    {
      id: Experiments.USER_V3_EDITOR,
      value: 0
    },
    {
      id: Experiments.USER_V3_MODIFY,
      value: 1
    },
    {
      id: Experiments.PINNED_MESSAGES,
      value: 1
    },
    {
      id: Experiments.COMMUNICATIONS,
      value: 1
    },
    {
      id: Experiments.WEBMAIL,
      value: 0
    },
    {
      id: Experiments.ACCOUNT_DEV_ELIGIBLE,
      value: 0
    },
    {
      id: Experiments.SFX_KFX,
      value: 0
    },
    {
      id: Experiments.SFX_KOLF,
      value: 0
    }
  ]);
  const experiments = computed<Record<Experiments, number>>(() => {
    return experimentsConfig.value.reduce((acc, cur) => {
      acc[cur.id] = cur.value;
      return acc;
    }, []) as unknown as Record<Experiments, number>;
  });
  const experimentsInherit = ref<Record<string, number | boolean | object>>({});

  async function setExperiment(
    key: Experiments,
    value: number,
    userId?: number
  ) {
    if (!experimentsConfig.value.find((e) => e.id === key)) {
      throw new Error("Invalid experiment key or it is not loaded.");
    }
    experimentsConfig.value.find((e) => e.id === key)!.value = value;
    await useApolloClient().client.mutate({
      mutation: SetExperimentDocument,
      variables: {
        input: {
          key,
          value,
          userId
        }
      }
    });
  }

  watch(
    () => experiments.value.DISABLE_ANIMATIONS,
    (value) => {
      if (value) {
        document.body.classList.add("disable-animations");
      } else {
        document.body.classList.remove("disable-animations");
      }
    }
  );

  watch(
    () => experiments.value.PRIDE,
    (value) => {
      if (value) {
        document.body.classList.add("rainbow");
      } else {
        document.body.classList.remove("rainbow");
      }
    }
  );

  async function init(version?: number) {
    let localExperiments: any = localStorage.getItem("experimentsStore");
    if (localExperiments) {
      try {
        localExperiments = JSON.parse(localExperiments);
        for (const experiment of localExperiments) {
          experiments.value[experiment.id] = experiment.value;
        }
      } catch {
        //
      }
    }
    const {
      data: { experiments: getExperiments }
    } = await useApolloClient().client.query({
      query: ExperimentsDocument,
      variables:
        version !== undefined
          ? {
              version
            }
          : {
              experiments: experimentsConfig.value.map((e) => e.id)
            },
      fetchPolicy: "network-only"
    });
    experimentsConfig.value = getExperiments;
    localStorage.setItem("experimentsStore", JSON.stringify(experiments.value));
  }

  async function getEmergencyOverrides(userId?: number) {
    const {
      data: { adminGetExperimentOverrides }
    } = await useApolloClient().client.query({
      query: gql`
        query AdminGetExperimentOverrides($userId: Int!) {
          adminGetExperimentOverrides(userId: $userId) {
            id
            value
            force
            userId
          }
        }
      `,
      variables: { userId },
      fetchPolicy: "network-only"
    });
    return adminGetExperimentOverrides;
  }

  async function deleteEmergencyOverride(id: string, userId?: number) {
    await useApolloClient().client.mutate({
      mutation: gql`
        mutation AdminDeleteExperimentOverride($id: String!, $userId: Int) {
          adminDeleteExperimentOverride(id: $id, userId: $userId) {
            success
          }
        }
      `,
      variables: {
        id,
        userId
      }
    });
  }

  async function createEmergencyOverride(override: ExperimentOverrideInput) {
    await useApolloClient().client.mutate({
      mutation: gql`
        mutation AdminSetExperimentOverride($input: ExperimentOverrideInput!) {
          adminSetExperimentOverride(input: $input) {
            id
          }
        }
      `,
      variables: {
        input: override
      }
    });
  }

  return {
    experiments,
    setExperiment,
    init,
    experimentsInherit,
    getEmergencyOverrides,
    deleteEmergencyOverride,
    createEmergencyOverride
  };
});
