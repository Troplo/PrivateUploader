import { gql } from "@apollo/client/core";

const ClearCacheMutation = gql`
  mutation AdminClearCache($input: ClearCacheInput!) {
    adminClearCache(input: $input) {
      success
    }
  }
`;
