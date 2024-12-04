import { buildSchema, Int } from "type-graphql"
import {
  BadgeResolver,
  PartialUserBaseResolver,
  PartialUserFriendResolver,
  PartialUserPublicResolver,
  UserResolver
} from "@app/controllers/graphql/user.resolver"
import { AuthResolver } from "@app/controllers/graphql/auth.resolver"
import { CoreResolver } from "@app/controllers/graphql/core.resolver"
import {
  CollectionResolver,
  CollectionUserResolver
} from "@app/controllers/graphql/collection.resolver"
import { DomainResolver } from "@app/controllers/graphql/domain.resolver"
import { GalleryResolver } from "@app/controllers/graphql/gallery.resolver"
import { ChatResolver } from "@app/controllers/graphql/chat.resolver"
import { ChatAssociationResolver } from "@app/controllers/graphql/chatAssociation.resolver"
import { WorkspaceResolver } from "@app/controllers/graphql/workspace.resolver"
import { WorkspaceFolderResolver } from "@app/controllers/graphql/workspaceFolder.resolver"
import { NoteResolver } from "@app/controllers/graphql/note.resolver"
import { FriendResolver } from "@app/controllers/graphql/friend.resolver"
import { MessageResolver } from "@app/controllers/graphql/message.resolver"
import { ChatRankResolver } from "@app/controllers/graphql/chatRank.resolver"
import { AutoCollectApprovalResolver } from "@app/controllers/graphql/autoCollectApproval.resolver"
import { CollectionItemResolver } from "@app/controllers/graphql/collectionItem.resolver"
import { UploadResolver } from "@app/controllers/graphql/upload.resolver"
import { AdminResolver } from "@app/controllers/graphql/admin.resolver"
import { BlockedUserResolver } from "@app/controllers/graphql/blockedUser.resolver"
import { ChatInviteResolver } from "@app/controllers/graphql/chatInvite.resolver"
import { MailResolver } from "@app/controllers/graphql/mail.resolver"
import {
  OAuthAppResolver,
  OauthConsentAppResolver,
  OAuthUserResolver
} from "@app/controllers/graphql/oAuthApp.resolver"
import { ChatEmojiResolver } from "@app/controllers/graphql/chatEmoji.resolver"
import { ChatAuditLogResolver } from "@app/controllers/graphql/chatAuditLog.resolver"
import { AutoCollectRuleResolver } from "@app/controllers/graphql/autoCollectRule.resolver"
import { Container } from "typedi"
import { authChecker } from "@app/lib/graphql/AuthChecker"
import { pubSub } from "@app/lib/graphql/pubsub"
import { PulseResolver } from "@app/controllers/graphql/pulse.resolver"
import {
  EmbedDataV2Resolver,
  EmbedMediaResolver
} from "@app/controllers/graphql/messageEmbed.resolver"
import { WorkspaceUserResolver } from "@app/controllers/graphql/workspaceUser.resolver"
import { NotificationResolver } from "@app/controllers/graphql/notification.resolver"
import { ExperimentsResolver } from "@app/controllers/graphql/experiments.resolver"

export const generateSchema = () => {
  const centralSchema = buildSchema({
    resolvers: [
      UserResolver,
      AuthResolver,
      CoreResolver,
      CollectionResolver,
      DomainResolver,
      GalleryResolver,
      CollectionUserResolver,
      BadgeResolver,
      PartialUserPublicResolver,
      ChatResolver,
      ChatAssociationResolver,
      WorkspaceResolver,
      WorkspaceFolderResolver,
      NoteResolver,
      FriendResolver,
      MessageResolver,
      PartialUserFriendResolver,
      ChatRankResolver,
      AutoCollectApprovalResolver,
      CollectionItemResolver,
      UploadResolver,
      AdminResolver,
      BlockedUserResolver,
      ChatInviteResolver,
      MailResolver,
      OAuthAppResolver,
      OAuthUserResolver,
      ChatEmojiResolver,
      ChatAuditLogResolver,
      OauthConsentAppResolver,
      AutoCollectRuleResolver,
      PulseResolver,
      EmbedDataV2Resolver,
      PartialUserBaseResolver,
      EmbedMediaResolver,
      WorkspaceUserResolver,
      NotificationResolver,
      ExperimentsResolver
    ],
    container: Container,
    authChecker: authChecker,
    validate: true,
    pubSub: pubSub,
    // set default number to int
    scalarsMap: [{ type: Number, scalar: Int }]
  })

  return centralSchema
}
