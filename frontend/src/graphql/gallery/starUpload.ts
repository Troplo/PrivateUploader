import { gql } from "@apollo/client/core";

export const StarUploadMutation = gql`
  mutation StarUpload($input: StarUploadInput!) {
    starUpload(input: $input) {
      status
    }
  }
`;
