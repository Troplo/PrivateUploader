import { gql } from "@apollo/client/core";

const DomainQuery = gql`
  query Domains {
    domains {
      domain
      id
      userId
      user {
        username
        id
        avatar
      }
    }
  }
`;
