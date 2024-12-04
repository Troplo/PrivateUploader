import { gql } from "@apollo/client/core";

export const AuditLogQuery = gql`
  query ChatAuditLog($input: AuditLogInput!) {
    chatAuditLog(input: $input) {
      items {
        id
        userId
        chatId
        category
        actionType
        message
        createdAt
        updatedAt
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
