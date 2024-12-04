import { gql } from "@apollo/client/core";

const MailStateQuery = gql`
  query MailStateQuery {
    unreadMail
    mailboxes {
      path
      name
      delimiter
      flags
      specialUse
      listed
      subscribed
    }
  }
`;
