import { gql } from "@apollo/client/core";

export const AutoCollectsQuery = gql`
  query AutoCollects($input: UserCollectionsInput!) {
    autoCollects(input: $input) {
      items {
        name
        id
        image
        preview {
          attachment {
            attachment
          }
        }
        shareLink
        userId
        users {
          id
          user {
            username
            id
          }
        }
        itemCount
        autoCollectApprovals {
          attachment {
            attachment
            id
            name
            originalFilename
            type
            userId
            createdAt
            fileSize
            textMetadata
            collections {
              name
              id
            }
            starred {
              id
            }
          }
          id
          autoCollectRuleId
          autoCollectRule {
            name
          }
        }
      }
      pager {
        totalItems
        currentPage
        pageSize
        totalPages
        startPage
        endPage
        startIndex
        endIndex
        pages
      }
    }
  }
`;
