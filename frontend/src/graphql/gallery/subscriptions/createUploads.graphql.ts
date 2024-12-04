import { gql } from "@apollo/client/core";

const UploadsSubscription = gql`
  subscription OnCreateUploads {
    onCreateUpload {
      upload {
        id
        createdAt
        updatedAt
        attachment
        userId
        name
        originalFilename
        type
        fileSize
        deletable
        textMetadata
        user {
          username
          id
        }
        item {
          id
        }
        collections {
          name
          id
        }
        starred {
          id
        }
      }
    }
  }
`;
