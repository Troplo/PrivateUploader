// Utilities
import { defineStore } from "pinia";
import {
  ExperimentsQuery,
  SetExperimentMutation
} from "@/graphql/core/experiments.graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { ref, watch } from "vue";
import { gql } from "@apollo/client/core";
import { ExperimentOverrideInput } from "@/gql/graphql";

export interface ExperimentsState {
  experiments: Record<string, string | number | boolean | object>;
  experimentsInherit: Record<string, string | number | boolean | object>;
}

export const useExperimentsStore = defineStore("experiments", () => {
  const experiments = ref<Record<string, number | boolean | object>>({
    API_VERSION: 3,
    FLOWINITY: 1,
    DISABLE_ANIMATIONS: 0
  });
  const experimentsInherit = ref<Record<string, number | boolean | object>>({});

  async function setExperiment(key: string, value: number, userId?: number) {
    this.experiments[key] = value;
    await useApolloClient().client.mutate({
      mutation: SetExperimentMutation,
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
      query: ExperimentsQuery,
      variables:
        version !== undefined
          ? {
              version
            }
          : undefined,
      fetchPolicy: "network-only"
    });
    for (const experiment of getExperiments) {
      console.log(`Loaded: ${experiment.id}`);
      experiments.value[experiment.id] = experiment.value;
      if (!experiments.value["meta"]) experiments.value.meta = {};
      experiments.value["meta"][experiment.id] = experiment;
    }
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
