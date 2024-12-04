import { gql } from "@apollo/client/core";

export const MyAppsQuery = gql`
  query DevApps {
    oauthApps {
      id
      name
      icon
      shortCode
      verified
      redirectUri
      secret
      description
      scopes
      userId
      private
      user {
        username
      }
    }
  }
`;

export const MyAppQuery = gql`
  query DevApp($input: MyAppInput!) {
    oauthApp(input: $input) {
      id
      name
      icon
      shortCode
      verified
      redirectUri
      secret
      description
      scopes
      userId
      private
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
        bot
      }
      oauthUsers {
        id
        userId
        oauthAppId
        manage
        active
        createdAt
        user {
          username
          id
        }
      }
      bot {
        username
        id
        createdAt
        avatar
        bot
      }
    }
  }
`;
