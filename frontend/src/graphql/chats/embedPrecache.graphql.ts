import { gql } from "@apollo/client/core";
import { StandardEmbedFragment } from "@/graphql/chats/messages.graphql";

const EmbedPrecacheMutation = gql`
  ${StandardEmbedFragment}
  mutation EmbedResolutionPrecache($input: EmbedPrecacheInput!) {
    embedResolutionPrecache(input: $input) {
      ...StandardEmbed
    }
  }
`;
