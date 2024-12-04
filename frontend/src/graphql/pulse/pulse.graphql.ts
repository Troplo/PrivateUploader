import { gql } from "@apollo/client/core";

const PulseMutation = gql`
  mutation CreatePulse($input: PulseInput!) {
    createPulse(input: $input)
  }
`;

const SinglePulseMutation = gql`
  mutation CreateSinglePulse($input: SinglePulseInput!) {
    createSinglePulse(input: $input)
  }
`;

const UpdatePulseMutation = gql`
  mutation UpdatePulse($input: PulseUpdateInput!) {
    updatePulse(input: $input)
  }
`;
