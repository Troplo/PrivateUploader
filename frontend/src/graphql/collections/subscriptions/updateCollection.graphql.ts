import { gql } from "@apollo/client/core";

const CollectionUpdatedSubscription = gql`
  subscription OnCollectionUpdated($input: FilterCollectionInput) {
    onCollectionUpdated(input: $input) {
      id
      name
      banner
      avatar
      shareLink
      userId
      itemCount
    }
  }
`;

const CollectionUserAddSubscription = gql`
  subscription OnCollectionUserAdded($input: FilterCollectionInput) {
    onCollectionUserAdded(input: $input) {
      id
    }
  }
`;

const CollectionUserRemoveSubscription = gql`
  subscription OnCollectionUserRemoved($input: FilterCollectionInput) {
    onCollectionUserRemoved(input: $input) {
      id
    }
  }
`;

const CollectionUserUpdateSubscription = gql`
  subscription OnCollectionUserUpdated($input: FilterCollectionInput) {
    onCollectionUserUpdated(input: $input) {
      id
    }
  }
`;

const CollectionCreatedSubscription = gql`
  subscription OnCollectionCreated {
    onCollectionCreated {
      id
      name
      banner
      avatar
      shareLink
      userId
      itemCount
      new
      permissionsMetadata {
        read
        write
        configure
      }
    }
  }
`;

const CollectionRemovedSubscription = gql`
  subscription OnCollectionRemoved($input: FilterCollectionInput) {
    onCollectionRemoved(input: $input)
  }
`;
