import { gql } from "@apollo/client/core";

export const CollectionUpdatedSubscription = gql`
  subscription CollectionUpdated($input: FilterCollectionInput) {
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

export const CollectionUserAddSubscription = gql`
  subscription CollectionUserAdded($input: FilterCollectionInput) {
    onCollectionUserAdded(input: $input) {
      id
    }
  }
`;

export const CollectionUserRemoveSubscription = gql`
  subscription CollectionUserRemoved($input: FilterCollectionInput) {
    onCollectionUserRemoved(input: $input) {
      id
    }
  }
`;

export const CollectionUserUpdateSubscription = gql`
  subscription CollectionUserUpdated($input: FilterCollectionInput) {
    onCollectionUserUpdated(input: $input) {
      id
    }
  }
`;

export const CollectionCreatedSubscription = gql`
  subscription CollectionCreated {
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

export const CollectionRemovedSubscription = gql`
  subscription CollectionRemoved($input: FilterCollectionInput) {
    onCollectionRemoved(input: $input)
  }
`;
