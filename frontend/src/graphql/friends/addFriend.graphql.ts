import { gql } from "@apollo/client/core";

export const AddFriendMutation = gql`
  mutation AddFriend($input: AddFriendInput!) {
    friend(input: $input)
  }
`;
