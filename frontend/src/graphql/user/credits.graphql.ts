import { gql } from "@apollo/client/core";

const CreditsQuery = gql`
  query Credits {
    Troplo: user(input: { username: "Troplo" }) {
      username
      id
      avatar
      banner
    }
    goose: user(input: { username: "goose" }) {
      username
      id
      avatar
      banner
    }
    bytedefined: user(input: { username: "bytedefined" }) {
      username
      id
      avatar
      banner
    }
    electrics01: user(input: { username: "electrics01" }) {
      username
      id
      avatar
      banner
    }
    Jolt707: user(input: { username: "Jolt707" }) {
      username
      id
      avatar
      banner
    }
    Avinera: user(input: { username: "Avinera" }) {
      username
      id
      avatar
      banner
    }
    Spy: user(input: { username: "Spy" }) {
      username
      id
      avatar
      banner
    }
  }
`;
