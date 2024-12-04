import { gql } from "@apollo/client/core";

const CancelTyping = gql`
  mutation Typing($input: Int!) {
    typing(input: $input)
  }
`;
