import { gql } from "@apollo/client/core";

const LookupBotPrefix = gql`
  query LookupBotPrefix($input: LookupPrefixInput!) {
    lookupBotPrefix(input: $input) {
      prefix
      commands {
        command
        description
        botId
      }
    }
  }
`;
