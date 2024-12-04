import { gql } from "@apollo/client/core";

export const ECoreStateQuery = gql`
  query ExtraStateQuery {
    friends {
      id
      status
      userId
      friendId
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
        status
      }
    }
    experiments {
      id
      value
      description
      createdAt
    }
    workspaces {
      id
      name
      userId
      createdAt
      updatedAt
      icon
      folders {
        id
        createdAt
        updatedAt
        name
        workspaceId
        folderId
        children {
          id
          createdAt
          updatedAt
          name
          workspaceFolderId
          shareLink
        }
      }
    }
    chats {
      id
      description
      type
      background
      unread
      name
      userId
      icon
      createdAt
      updatedAt
      invites {
        id
        userId
        createdAt
        rankId
        updatedAt
        expiredAt
        invalidated
      }
      association {
        id
        hidden
        chatId
        permissions
        userId
        rank
        createdAt
        lastRead
        notifications
      }
      users {
        id
        chatId
        userId
        rank
        createdAt
        lastRead
        ranksMap
      }
      _redisSortDate
      recipient {
        id
      }
      ranks {
        id
        color
        name
        userId
        createdAt
        chatId
        updatedAt
        managed
        index
        permissionsMap
      }
    }
    coreState {
      connection {
        ip
      }
      name
      release
      hostname
      hostnameWithProtocol
      announcements {
        userId
        content
        type
        id
        createdAt
        updatedAt
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
      }
      stats {
        users
        announcements
        usage
        collections
        collectionItems
        uploadGraph {
          data
          labels
        }
        messageGraph {
          data
          labels
        }
        pulseGraph {
          data
          labels
        }
        uploads
        invites
        inviteMilestone
        pulse
        pulses
        docs
        messages
        chats
        hours
      }
      maintenance {
        enabled
        message
        statusPage
      }
      registrations
      officialInstance
      providers {
        anilist
        lastfm
        mal
      }
      termsNoteId
      privacyNoteId
      features {
        communications
        collections
        autoCollects
        workspaces
        insights
      }
      inviteAFriend
      preTrustedDomains
      hostnames
      _redis
      server
      finishedSetup
      domain
      uptime
      uptimeSys
      commitVersion
    }
    collections {
      items {
        id
        permissionsMetadata {
          write
          read
          configure
        }
        name
      }
    }
    currentUser {
      username
      email
      pulse
      groupPrivacy
      friendRequests
      profileLayout
      description
      administrator
      darkTheme
      emailVerified
      banned
      createdAt
      inviteId
      discordPrecache
      avatar
      domainId
      totpEnable
      quota
      moderator
      subscriptionId
      itemsPerPage
      banner
      pendingAutoCollects
      scopes
      alternatePasswords {
        scopes
        totp
        name
      }
      status
      storedStatus
      weatherUnit
      themeEngine
      xp
      publicProfile
      privacyPolicyAccepted
      plan {
        quotaMax
        color
        internalName
        name
        icon
        id
      }
      domain {
        active
        domain
        id
      }
      badges {
        color
        icon
        id
        image
        name
        priority
        tooltip
      }
      excludedCollections
      id
      language
      nameColor
      subscription {
        metadata {
          hours
        }
        cancelled
      }
      insights
      notifications {
        id
        dismissed
        message
        route
        createdAt
      }
      integrations {
        type
        providerUsername
        providerUserId
        id
        error
        expiresAt
      }
    }
    trackedUsers {
      username
      id
      createdAt
      administrator
      moderator
      avatar
      blocked
      status
      nameColor
      bot
      nickname {
        nickname
      }
    }
    blockedUsers {
      id
      userId
      createdAt
      updatedAt
      blockedUserId
      silent
    }
    userEmoji {
      id
      userId
      chatId
      icon
      name
      createdAt
      updatedAt
    }
  }
`;
