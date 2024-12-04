import { gql } from "@apollo/client/core";

const AdminPlansQuery = gql`
  query AdminGetPlans {
    adminPlans {
      id
      name
      quotaMax
      color
      internalName
      icon
    }
  }
`;
