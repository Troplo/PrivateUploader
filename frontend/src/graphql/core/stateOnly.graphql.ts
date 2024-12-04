import { gql } from "@apollo/client/core";

export const CoreStateQuery = gql`
  query CoreStateQuery {
    experiments {
      id
      value
      description
      createdAt
      versions
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
  }
`;
