import { gql } from "@apollo/client/core";

const Experiments = gql`
  query Experiments($experiments: [String!], $version: Int) {
    experiments(version: $version, experiments: $experiments) {
      id
      value
    }
  }
`;

const FullExperiments = gql`
  query FullExperiments($experiments: [String!], $version: Int) {
    experiments(version: $version, experiments: $experiments) {
      id
      value
      description
      createdAt
      refresh
      versions
      override
      force
    }
  }
`;

const SetExperimentMutation = gql`
  mutation SetExperiment($input: SetExperimentInput!) {
    setExperiment(input: $input) {
      value
      key
    }
  }
`;
