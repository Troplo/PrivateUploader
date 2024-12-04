import { gql } from "@apollo/client/core";

const StarUploadMutation = gql`
  mutation StarUpload($input: StarUploadInput!) {
    starUpload(input: $input) {
      status
    }
  }
`;
