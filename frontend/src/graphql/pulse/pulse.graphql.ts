import { gql } from "@apollo/client/core";

export const PulseMutation = gql`
  mutation CreatePulse($input: PulseInput!) {
    createPulse(input: $input)
  }
`;

export const SinglePulseMutation = gql`
  mutation CreateSinglePulse($input: SinglePulseInput!) {
    createSinglePulse(input: $input)
  }
`;

export const UpdatePulseMutation = gql`
  mutation UpdatePulse($input: PulseUpdateInput!) {
    updatePulse(input: $input)
  }
`;
