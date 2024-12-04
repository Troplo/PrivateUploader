import { gql } from "@apollo/client/core";

export const AutoCollectRulesQuery = gql`
  query AutoCollectRules {
    autoCollectRules {
      id
      name
      enabled
      collectionId
    }
  }
`;

export const AutoCollectRuleQuery = gql`
  query AutoCollectRule($input: AutoCollectRuleQueryInput!) {
    autoCollectRule(input: $input) {
      id
      name
      enabled
      collectionId
      requireApproval
      rules {
        id
        rules {
          id
          type
          value
          operator
        }
      }
    }
  }
`;
