import { gql } from "@apollo/client/core";

export const ExperimentsQuery = gql`
  query GetExperiments($version: Int) {
    experiments(version: $version) {
      id
      value
      description
      createdAt
      versions
    }
  }
`;

export const SetExperimentMutation = gql`
  mutation SetExperiment($input: SetExperimentInput!) {
    setExperiment(input: $input) {
      value
      key
    }
  }
`;
