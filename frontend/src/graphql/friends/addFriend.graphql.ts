import { gql } from "@apollo/client/core";

const AddFriendMutation = gql`
  mutation AddFriend($input: AddFriendInput!) {
    friend(input: $input)
  }
`;
