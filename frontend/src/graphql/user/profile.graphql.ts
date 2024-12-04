import { gql } from "@apollo/client/core";

const ProfileQuery = gql`
  query User($input: UserProfileInput!) {
    user(input: $input) {
      username
      id
      createdAt
      administrator
      moderator
      avatar
      bot
      badges {
        id
        name
        description
        tooltip
        image
        icon
        color
        unlocked
        priority
      }
      banned
      banner
      description
      friend
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
        }
        otherUser {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
      }
      insights
      plan {
        id
        name
        quotaMax
        price
        features
        color
        internalName
        purchasable
        internalFeatures
        icon
      }
      platforms {
        platform
        id
        lastSeen
        status
      }
      profileLayout {
        layout {
          columns {
            rows {
              name
              id
              props {
                height
                friendsOnly
                display
                type
                links {
                  name
                  url
                  color
                }
                children {
                  name
                  id
                  props {
                    height
                    friendsOnly
                    display
                    type
                    links {
                      name
                      url
                      color
                    }
                  }
                }
              }
            }
          }
        }
        config {
          containerMargin
          showStatsSidebar
        }
        version
      }
      publicProfile
      quota
      stats {
        hours
        messages
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
        pulse
        pulses
        docs
      }
      xp
      mutualCollections {
        id
        shareLink
        avatar
        itemCount
        image
        name
        banner
      }
      themeEngine
    }
  }
`;
