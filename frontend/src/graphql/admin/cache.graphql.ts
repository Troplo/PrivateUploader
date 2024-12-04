import { gql } from "@apollo/client/core";

export const ClearCacheMutation = gql`
  mutation AdminClearCache($input: ClearCacheInput!) {
    adminClearCache(input: $input) {
      success
    }
  }
`;
