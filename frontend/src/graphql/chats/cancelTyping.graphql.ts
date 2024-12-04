import { gql } from "@apollo/client/core";

const CancelTyping = gql`
  mutation CancelTyping($input: Int!) {
    cancelTyping(input: $input)
  }
`;
