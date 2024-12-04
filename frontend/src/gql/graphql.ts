/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `BigInt` scalar type represents non-fractional signed whole numeric values. */
  BigInt: { input: any; output: any; }
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AcceptCollectionInviteInput = {
  accept: Scalars['Boolean']['input'];
  collectionId: Scalars['Int']['input'];
};

export type AccessedFrom = {
  __typename?: 'AccessedFrom';
  asn?: Maybe<Scalars['Int']['output']>;
  date: Scalars['String']['output'];
  ip: Scalars['String']['output'];
  isp?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type ActOnAutoCollectsInput = {
  action: AutoCollectAction;
  items: Array<Scalars['Int']['input']>;
};

export type AddAppUserInput = {
  manage?: InputMaybe<Scalars['Boolean']['input']>;
  oauthAppId: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type AddBotToChatInput = {
  associationId: Scalars['Int']['input'];
  botAppId: Scalars['String']['input'];
  permissions: Array<Scalars['String']['input']>;
};

export type AddChatUser = {
  action: ToggleUser;
  chatAssociationId: Scalars['Int']['input'];
  users: Array<Scalars['Int']['input']>;
};

export type AddFriendInput = {
  /** If null, it works as a toggle. This is for explicit actions. */
  action?: InputMaybe<FriendAction>;
  /** Can use `userId` or `username` */
  userId?: InputMaybe<Scalars['Int']['input']>;
  /** Can use `userId` or `username` */
  username?: InputMaybe<Scalars['String']['input']>;
};

export type AddRank = {
  chatAssociationId: Scalars['Int']['input'];
  rankId: Scalars['String']['input'];
  updatingChatAssociationId: Scalars['Int']['input'];
};

export type AddToCollectionInput = {
  collectionId: Scalars['Int']['input'];
  items: Array<Scalars['Int']['input']>;
};

/** The type of cache to clear */
export enum AdminCacheType {
  Autocollects = 'autocollects',
  Chats = 'chats',
  Collections = 'collections',
  Everything = 'everything',
  Insights = 'insights',
  Invites = 'invites',
  Lastfm = 'lastfm',
  Mal = 'mal',
  Sessions = 'sessions',
  Sharelinks = 'sharelinks',
  State = 'state',
  TrackedUsers = 'trackedUsers',
  Users = 'users',
  Userstats = 'userstats'
}

export type AlternatePassword = {
  __typename?: 'AlternatePassword';
  name: Scalars['String']['output'];
  scopes: Scalars['String']['output'];
  totp: Scalars['Boolean']['output'];
};

export type Announcement = {
  __typename?: 'Announcement';
  content: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['Int']['output'];
  type?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
};

/** Used for chat audit log to determine what type of action was performed. */
export enum AuditLogActionType {
  Add = 'ADD',
  Modify = 'MODIFY',
  Remove = 'REMOVE'
}

/** Used for chat audit log. */
export enum AuditLogCategory {
  Bot = 'BOT',
  Emoji = 'EMOJI',
  Invite = 'INVITE',
  Message = 'MESSAGE',
  PinMessage = 'PIN_MESSAGE',
  Rank = 'RANK',
  Settings = 'SETTINGS',
  User = 'USER'
}

export type AuditLogInput = {
  associationId: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
};

export type AuthorizeAppInput = {
  id: Scalars['String']['input'];
  /** Used for bots. */
  permissions?: InputMaybe<Array<Scalars['String']['input']>>;
  scopes: Scalars['String']['input'];
};

export type AuthorizeAppResponse = {
  __typename?: 'AuthorizeAppResponse';
  token?: Maybe<Scalars['String']['output']>;
};

export enum AutoCollectAction {
  Approve = 'APPROVE',
  Reject = 'REJECT'
}

export type AutoCollectApproval = {
  __typename?: 'AutoCollectApproval';
  approved: Scalars['Boolean']['output'];
  attachment?: Maybe<Upload>;
  autoCollectRule?: Maybe<AutoCollectRule>;
  autoCollectRuleId: Scalars['Int']['output'];
  collection?: Maybe<Collection>;
  collectionId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  uploadId: Scalars['Int']['output'];
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type AutoCollectApprovalEvent = {
  __typename?: 'AutoCollectApprovalEvent';
  autoCollectApproval: AutoCollectApproval;
  type: AutoCollectApprovalType;
};

export enum AutoCollectApprovalType {
  Approved = 'APPROVED',
  Denied = 'DENIED',
  New = 'NEW'
}

export type AutoCollectParentRule = {
  __typename?: 'AutoCollectParentRule';
  id: Scalars['Int']['output'];
  rules: Array<SubRule>;
};

export type AutoCollectRule = {
  __typename?: 'AutoCollectRule';
  collectionId: Scalars['Int']['output'];
  enabled: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  requireApproval: Scalars['Boolean']['output'];
  rules: Array<AutoCollectParentRule>;
};

export type AutoCollectRuleQueryInput = {
  id: Scalars['Int']['input'];
};

export type Badge = {
  __typename?: 'Badge';
  color?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  plan: Plan;
  priority?: Maybe<Scalars['Int']['output']>;
  tooltip?: Maybe<Scalars['String']['output']>;
  unlocked: Scalars['Boolean']['output'];
  users: Array<PartialUserBase>;
};

/** Reasons for banning a user. */
export enum BanReason {
  Harassment = 'HARASSMENT',
  IllegalContent = 'ILLEGAL_CONTENT',
  Other = 'OTHER',
  PendingManualAccountDeletion = 'PENDING_MANUAL_ACCOUNT_DELETION',
  Spam = 'SPAM',
  UnderAge = 'UNDER_AGE'
}

export type BanResponse = {
  __typename?: 'BanResponse';
  message?: Maybe<Scalars['String']['output']>;
  pendingDeletionDate?: Maybe<Scalars['Date']['output']>;
  type: Scalars['String']['output'];
};

export type BlockUserInput = {
  silent: Scalars['Boolean']['input'];
  userId: Scalars['Int']['input'];
};

export type BlockedUser = {
  __typename?: 'BlockedUser';
  blockedUser?: Maybe<PartialUserBase>;
  blockedUserId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  /** To the blocked user it appears as though they're unblocked, however the blocker will not receive any messages from them, and their messages will be hidden inside of group chats. */
  silent: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type ChangeEmailInput = {
  email: Scalars['String']['input'];
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
  totp?: InputMaybe<Scalars['String']['input']>;
};

export type ChangeUsernameInput = {
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type Chat = {
  __typename?: 'Chat';
  _redisSortDate?: Maybe<Scalars['String']['output']>;
  association?: Maybe<ChatAssociation>;
  background?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  emoji?: Maybe<Array<ChatEmoji>>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  /** Array is empty if you don't have the `OVERVIEW` permission in the chat. */
  invites: Array<ChatInvite>;
  messages: Array<Message>;
  name: Scalars['String']['output'];
  onlineCount: Scalars['Int']['output'];
  ranks: Array<ChatRank>;
  recipient?: Maybe<PartialUserBase>;
  type: Scalars['String']['output'];
  unread?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  /** Null if the chat is owned by a Colubrina legacy user, or the account was deleted. */
  user?: Maybe<PartialUserBase>;
  /** Null if the chat is owned by a Colubrina legacy user, or the account was deleted. */
  userId?: Maybe<Scalars['Int']['output']>;
  users: Array<ChatAssociation>;
  usersCount: Scalars['Int']['output'];
};

export type ChatAssociation = {
  __typename?: 'ChatAssociation';
  chatId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  /** Only true/false for current user, null for other ChatAssociations. This determines whether the chat is visible in the sidebar (open or closed). */
  hidden?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  invite?: Maybe<ChatInvite>;
  inviteUsed?: Maybe<Scalars['String']['output']>;
  lastRead?: Maybe<Scalars['Int']['output']>;
  notifications: Scalars['String']['output'];
  permissions: Array<Scalars['String']['output']>;
  /** @deprecated `ChatRank` has replaced legacy rank for granular permission control. */
  rank: Scalars['String']['output'];
  ranks: Array<ChatRank>;
  ranksMap: Array<Scalars['String']['output']>;
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type ChatAuditLog = {
  __typename?: 'ChatAuditLog';
  actionType: AuditLogActionType;
  category: AuditLogCategory;
  chatId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  message: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
};

export type ChatEmoji = {
  __typename?: 'ChatEmoji';
  chatId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  deleted: Scalars['Boolean']['output'];
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
};

export type ChatInput = {
  associationId?: InputMaybe<Scalars['Int']['input']>;
  chatId?: InputMaybe<Scalars['Int']['input']>;
};

export type ChatInvite = {
  __typename?: 'ChatInvite';
  chat: Chat;
  chatId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  expiredAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['String']['output'];
  invalidated: Scalars['Boolean']['output'];
  rank?: Maybe<ChatRank>;
  /** Automatically assigns rank to user when joining. If unset the backend will set the `managed` Members role. */
  rankId?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type ChatPermission = {
  __typename?: 'ChatPermission';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description: Scalars['String']['output'];
  group: RankPermissionGroup;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type ChatRank = {
  __typename?: 'ChatRank';
  associations: Array<ChatAssociation>;
  chatId: Scalars['Int']['output'];
  color?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  managed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  permissions: Array<ChatPermission>;
  permissionsMap: Array<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export enum ChatType {
  Direct = 'DIRECT',
  Group = 'GROUP'
}

export type ChatTypingEvent = {
  __typename?: 'ChatTypingEvent';
  chatId: Scalars['Int']['output'];
  expires?: Maybe<Scalars['Float']['output']>;
  user: PartialUserFriend;
};

export type ChatsInput = {
  hidden?: Scalars['Boolean']['input'];
};

export type ClearCacheInput = {
  await?: InputMaybe<Scalars['Boolean']['input']>;
  type: AdminCacheType;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export enum CollabEventType {
  Join = 'JOIN',
  Leave = 'LEAVE'
}

export type Collection = {
  __typename?: 'Collection';
  attachments: Array<Upload>;
  autoCollectApprovals: Array<AutoCollectApproval>;
  avatar?: Maybe<Scalars['String']['output']>;
  /** The recommended way to obtain the banner for a collection, it uses field `image`, and if null, falls back to the last added image preview. */
  banner?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  /** Please use field `banner` instead if you want to obtain the banner for a collection. */
  image?: Maybe<Scalars['String']['output']>;
  itemCount?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  /** Used for the frontend for new collections on WebSocket event. */
  new?: Maybe<Scalars['Boolean']['output']>;
  permissionsMetadata: PermissionsMetadata;
  preview?: Maybe<CollectionItem>;
  recipient?: Maybe<CollectionUser>;
  shareLink?: Maybe<Scalars['String']['output']>;
  shared?: Maybe<Scalars['Boolean']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
  users: Array<CollectionUser>;
};

/** The type of collection */
export enum CollectionFilter {
  All = 'ALL',
  Configure = 'CONFIGURE',
  Owned = 'OWNED',
  Read = 'READ',
  Shared = 'SHARED',
  Write = 'WRITE'
}

export type CollectionInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shareLink?: InputMaybe<Scalars['String']['input']>;
};

export type CollectionItem = {
  __typename?: 'CollectionItem';
  attachment: Upload;
  attachmentId: Scalars['Int']['output'];
  collection: Collection;
  collectionId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  /** Used to prevent duplicates by forming `uploadId-collectionId`. Can be null for items created before October 2022. */
  identifier?: Maybe<Scalars['String']['output']>;
  pinned: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

export type CollectionUser = {
  __typename?: 'CollectionUser';
  accepted: Scalars['Boolean']['output'];
  collection?: Maybe<Collection>;
  collectionId: Scalars['Int']['output'];
  configure: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  identifier?: Maybe<Scalars['String']['output']>;
  read: Scalars['Boolean']['output'];
  recipientId?: Maybe<Scalars['Int']['output']>;
  sender?: Maybe<PartialUserBase>;
  senderId?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  write: Scalars['Boolean']['output'];
};

export type Connection = {
  __typename?: 'Connection';
  ip: Scalars['String']['output'];
  /** @deprecated No longer used in v4. */
  whitelist: Scalars['Boolean']['output'];
};

export type CoreState = {
  __typename?: 'CoreState';
  _redis: Scalars['String']['output'];
  announcements: Array<Announcement>;
  commitVersion: Scalars['String']['output'];
  connection: Connection;
  domain: Scalars['String']['output'];
  /** List of enabled features for TPU instance */
  features: Features;
  finishedSetup: Scalars['Boolean']['output'];
  hostname: Scalars['String']['output'];
  hostnameWithProtocol: Scalars['String']['output'];
  hostnames: Array<Scalars['String']['output']>;
  inviteAFriend: Scalars['Boolean']['output'];
  maintenance: Maintenance;
  name: Scalars['String']['output'];
  /** Whether the TPU instance is the officially run instance on privateuploader.com. This can be enabled on any instance but can enable unwanted features. */
  officialInstance: Scalars['Boolean']['output'];
  /** List of domains that are pre-trusted for user-generated hyperlinks such as Communications messages which don't require a confirmation to proceed. */
  preTrustedDomains: Array<Scalars['String']['output']>;
  /** Workspaces Note ID for the Privacy Policy. */
  privacyNoteId?: Maybe<Scalars['String']['output']>;
  providers: Providers;
  registrations: Scalars['Boolean']['output'];
  /** Whether the app is running in production mode. */
  release: Scalars['String']['output'];
  server: Scalars['String']['output'];
  stats: CoreStats;
  /** If finishedSetup is false, this will be the step the setup is on. If the setup is completed, it will return `-1` */
  step: Scalars['Int']['output'];
  /** Workspaces Note ID for the Terms of Service. */
  termsNoteId?: Maybe<Scalars['String']['output']>;
  /** Uptime of the TPU Server in seconds. */
  uptime: Scalars['Int']['output'];
  /** Uptime of the system in seconds. */
  uptimeSys: Scalars['Int']['output'];
  weather: Weather;
};

export type CoreStats = {
  __typename?: 'CoreStats';
  announcements: Scalars['Int']['output'];
  chats: Scalars['Int']['output'];
  collectionItems: Scalars['Int']['output'];
  collections: Scalars['Int']['output'];
  docs: Scalars['Int']['output'];
  hours?: Maybe<Scalars['JSON']['output']>;
  inviteMilestone: Scalars['Int']['output'];
  invites: Scalars['Int']['output'];
  messageGraph?: Maybe<DataLabelsGraph>;
  messages: Scalars['Int']['output'];
  pulse: Scalars['Int']['output'];
  pulseGraph?: Maybe<DataLabelsGraph>;
  pulses: Scalars['Int']['output'];
  uploadGraph?: Maybe<DataLabelsGraph>;
  uploads: Scalars['Int']['output'];
  usage?: Maybe<Scalars['BigInt']['output']>;
  users: Scalars['Int']['output'];
};

export type CreateAppInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  private: Scalars['Boolean']['input'];
  redirectUri?: InputMaybe<Scalars['String']['input']>;
  verified: Scalars['Boolean']['input'];
};

export type CreateBotInput = {
  id: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type CreateChatInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ChatType>;
  users: Array<Scalars['Int']['input']>;
};

export type CreateCollectionInput = {
  name: Scalars['String']['input'];
};

export type CreateInviteInput = {
  associationId: Scalars['Int']['input'];
  /** In hours. */
  expiry?: InputMaybe<Scalars['Int']['input']>;
  /** Auto assign rank on join. */
  rankId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateNoteInput = {
  name: Scalars['String']['input'];
  workspaceFolderId: Scalars['Int']['input'];
};

export type CreateRank = {
  associationId: Scalars['Int']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateUploadEvent = {
  __typename?: 'CreateUploadEvent';
  upload: Upload;
  url: Scalars['String']['output'];
};

export type CreateWorkspaceFolderInput = {
  name: Scalars['String']['input'];
  workspaceId: Scalars['Int']['input'];
};

/** Used for deleting chats and transferring ownership. */
export type DangerZoneChatInput = {
  associationId: Scalars['Int']['input'];
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
};

/** Used for dangerous operations. */
export type DangerZoneInput = {
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
};

export type DataLabelsGraph = {
  __typename?: 'DataLabelsGraph';
  data: Array<Scalars['Float']['output']>;
  labels: Array<Scalars['String']['output']>;
};

export type DeleteEmojiInput = {
  associationId: Scalars['Int']['input'];
  id: Scalars['String']['input'];
};

export type DeleteMessage = {
  __typename?: 'DeleteMessage';
  associationId: Scalars['Int']['output'];
  chatId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
};

export type DeleteMessageInput = {
  associationId: Scalars['Int']['input'];
  messageId: Scalars['Int']['input'];
};

export type DeleteRank = {
  associationId: Scalars['Int']['input'];
  rankId: Scalars['String']['input'];
};

export type DeleteUploadInput = {
  items: Array<Scalars['Int']['input']>;
};

export type DeleteWorkspaceItemInput = {
  id: Scalars['Int']['input'];
  type: WorkspaceItemType;
};

export type Domain = {
  __typename?: 'Domain';
  /** @deprecated Use `active` instead. */
  DNSProvisioned: Scalars['Boolean']['output'];
  active: Scalars['Boolean']['output'];
  /** @deprecated Cloudflare integration was removed in TPUv2. */
  advanced?: Maybe<Scalars['Int']['output']>;
  /** @deprecated Granular user control was removed in TPUv2. */
  customUserEligibility?: Maybe<Array<Scalars['Int']['output']>>;
  domain: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** @deprecated Granular user control was removed in TPUv2. */
  restricted: Scalars['String']['output'];
  /** @deprecated Subdomains were removed in TPUv2. */
  subdomains: Scalars['Boolean']['output'];
  /** @deprecated Subdomains were removed in TPUv2. */
  subdomainsCreate: Scalars['Boolean']['output'];
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
  /** Only populated in some admin contexts */
  users?: Maybe<Array<PartialUserBase>>;
  /** @deprecated Cloudflare integration was removed in TPUv2. */
  zone?: Maybe<Scalars['String']['output']>;
};

export type EditMessageEvent = {
  __typename?: 'EditMessageEvent';
  associationId: Scalars['Int']['output'];
  message: Message;
};

export type EditMessageInput = {
  associationId: Scalars['Int']['input'];
  attachments?: Array<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  embeds?: InputMaybe<Array<EmbedInput>>;
  messageId: Scalars['Int']['input'];
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EmbedDataV2 = {
  __typename?: 'EmbedDataV2';
  media?: Maybe<Array<EmbedMedia>>;
  metadata: EmbedMetadata;
  text?: Maybe<Array<EmbedText>>;
  version: EmbedVersion;
};

export type EmbedInput = {
  color?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  graph?: InputMaybe<InteractiveGraphInput>;
  image?: InputMaybe<Scalars['String']['input']>;
  siteName?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type EmbedMedia = {
  __typename?: 'EmbedMedia';
  attachment?: Maybe<Scalars['String']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  isInternal: Scalars['Boolean']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  proxyUrl?: Maybe<Scalars['String']['output']>;
  type: EmbedMediaType;
  upload?: Maybe<Upload>;
  url?: Maybe<Scalars['String']['output']>;
  /** Used for trusted video embed sources, such as YouTube. */
  videoEmbedUrl?: Maybe<Scalars['String']['output']>;
  width?: Maybe<Scalars['Int']['output']>;
};

export enum EmbedMediaType {
  Audio = 'AUDIO',
  File = 'FILE',
  Image = 'IMAGE',
  Video = 'VIDEO'
}

export type EmbedMetadata = {
  __typename?: 'EmbedMetadata';
  footer?: Maybe<Scalars['String']['output']>;
  /** Used for chat invites, and other embeds. */
  id?: Maybe<Scalars['String']['output']>;
  /** Used for NSFW embeds and content. */
  restricted?: Maybe<Scalars['Boolean']['output']>;
  siteIcon?: Maybe<Scalars['String']['output']>;
  siteName?: Maybe<Scalars['String']['output']>;
  type: EmbedType;
  url?: Maybe<Scalars['String']['output']>;
};

export type EmbedPrecacheInput = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type EmbedText = {
  __typename?: 'EmbedText';
  heading?: Maybe<Scalars['Boolean']['output']>;
  imageProxyUrl?: Maybe<Scalars['String']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  text: Scalars['String']['output'];
};

export enum EmbedType {
  ChatInvite = 'CHAT_INVITE',
  Direct = 'DIRECT',
  Regular = 'REGULAR'
}

export enum EmbedVersion {
  Colubrina = 'COLUBRINA',
  V1 = 'V1',
  V2 = 'V2'
}

export type Experiment = {
  __typename?: 'Experiment';
  key: Scalars['String']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
  value: Scalars['String']['output'];
};

export type ExperimentOverride = {
  __typename?: 'ExperimentOverride';
  force: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
  value: Scalars['Int']['output'];
};

export type ExperimentOverrideInput = {
  force?: Scalars['Boolean']['input'];
  id: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['Int']['input'];
};

export type ExperimentType = {
  __typename?: 'ExperimentType';
  createdAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  force: Scalars['Boolean']['output'];
  id: Scalars['String']['output'];
  override: Scalars['Boolean']['output'];
  refresh?: Maybe<Scalars['Boolean']['output']>;
  value: Scalars['Int']['output'];
  versions: Array<Scalars['Int']['output']>;
};

export type Features = {
  __typename?: 'Features';
  autoCollects: Scalars['Boolean']['output'];
  collections: Scalars['Boolean']['output'];
  communications: Scalars['Boolean']['output'];
  insights: Scalars['Boolean']['output'];
  workspaces: Scalars['Boolean']['output'];
};

export type FilterCollectionInput = {
  collectionId?: InputMaybe<Scalars['Int']['input']>;
};

export type Friend = {
  __typename?: 'Friend';
  createdAt: Scalars['Date']['output'];
  friendId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  otherUser: PartialUserFriend;
  status: FriendStatus;
  updatedAt: Scalars['Date']['output'];
  user: PartialUserFriend;
  userId?: Maybe<Scalars['Int']['output']>;
};

export enum FriendAction {
  Accept = 'ACCEPT',
  Remove = 'REMOVE',
  Send = 'SEND'
}

export type FriendNickname = {
  __typename?: 'FriendNickname';
  createdAt: Scalars['Date']['output'];
  friend?: Maybe<PartialUserBase>;
  friendId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  nickname: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

/** Friend request status. */
export enum FriendStatus {
  Accepted = 'ACCEPTED',
  Incoming = 'INCOMING',
  None = 'NONE',
  Outgoing = 'OUTGOING'
}

export type FriendsInput = {
  status?: InputMaybe<FriendStatus>;
};

/** The filter to apply to the gallery request */
export enum GalleryFilter {
  All = 'ALL',
  Audio = 'AUDIO',
  Gifs = 'GIFS',
  Images = 'IMAGES',
  IncludeMetadata = 'INCLUDE_METADATA',
  IncludeUndeletable = 'INCLUDE_UNDELETABLE',
  NoCollection = 'NO_COLLECTION',
  OnlyUndeletable = 'ONLY_UNDELETABLE',
  Other = 'OTHER',
  Owned = 'OWNED',
  Paste = 'PASTE',
  Shared = 'SHARED',
  Text = 'TEXT',
  Videos = 'VIDEOS'
}

export type GalleryInput = {
  advanced?: InputMaybe<Array<SearchModeInput>>;
  /** Requires Type to be COLLECTION */
  collectionId?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<Array<GalleryFilter>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GalleryOrder>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  /** Requires Type to be COLLECTION */
  shareLink?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<GallerySort>;
  type?: InputMaybe<GalleryType>;
};

/** The order to apply to the gallery request */
export enum GalleryOrder {
  Asc = 'ASC',
  Desc = 'DESC',
  Random = 'RANDOM'
}

/** The advanced search mode. */
export enum GallerySearchMode {
  After = 'AFTER',
  Before = 'BEFORE',
  Collection = 'COLLECTION',
  During = 'DURING',
  Meta = 'META',
  Name = 'NAME',
  Order = 'ORDER',
  Size = 'SIZE',
  Type = 'TYPE',
  User = 'USER'
}

/** The sort to apply to the gallery request */
export enum GallerySort {
  AddedAt = 'ADDED_AT',
  CreatedAt = 'CREATED_AT',
  Name = 'NAME',
  Size = 'SIZE',
  UpdatedAt = 'UPDATED_AT'
}

/** The type of gallery request, for example if it's the personal gallery page, or a Collection */
export enum GalleryType {
  AutoCollect = 'AUTO_COLLECT',
  Collection = 'COLLECTION',
  Personal = 'PERSONAL',
  Starred = 'STARRED'
}

export type GenericSuccessObject = {
  __typename?: 'GenericSuccessObject';
  success: Scalars['Boolean']['output'];
};

export type GetMailInput = {
  mailbox: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['Int']['input'];
};

export type HomeRow = {
  __typename?: 'HomeRow';
  /** In UUID format. */
  id: Scalars['String']['output'];
  widgets: Array<HomeWidget>;
};

export type HomeWidget = {
  __typename?: 'HomeWidget';
  /** In UUID format. */
  id: Scalars['String']['output'];
  props?: Maybe<Scalars['JSON']['output']>;
  type: HomeWidgetType;
};

/** The type of home widget */
export enum HomeWidgetType {
  Announcements = 'ANNOUNCEMENTS',
  AtAGlance = 'AT_A_GLANCE',
  RecentChats = 'RECENT_CHATS',
  RecentCollections = 'RECENT_COLLECTIONS',
  RecentNotes = 'RECENT_NOTES',
  RecentUploads = 'RECENT_UPLOADS',
  SiteStats = 'SITE_STATS',
  SiteStatsGraph = 'SITE_STATS_GRAPH',
  UserStats = 'USER_STATS',
  UserStatsGraph = 'USER_STATS_GRAPH'
}

export type HomeWidgets = {
  __typename?: 'HomeWidgets';
  default?: Maybe<Scalars['Boolean']['output']>;
  rows: Array<HomeRow>;
};

export type InfiniteMessagesInput = {
  associationId: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  position?: InputMaybe<ScrollPosition>;
  search?: InputMaybe<MessagesSearch>;
};

export type Integration = {
  __typename?: 'Integration';
  createdAt: Scalars['Date']['output'];
  error?: Maybe<Scalars['String']['output']>;
  expiresAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['Int']['output'];
  providerUserCache?: Maybe<Scalars['JSON']['output']>;
  providerUserId?: Maybe<Scalars['Float']['output']>;
  providerUsername?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

export type InteractiveGraphInput = {
  type: Scalars['String']['input'];
};

export type InvalidateInviteInput = {
  associationId: Scalars['Int']['input'];
  inviteId: Scalars['String']['input'];
};

export type InviteInput = {
  inviteId: Scalars['String']['input'];
};

export type JoinChatFromInviteInput = {
  inviteId: Scalars['String']['input'];
};

export type LeaveChatInput = {
  associationId: Scalars['Int']['input'];
};

export type LeaveCollectionInput = {
  collectionId: Scalars['Int']['input'];
};

export type ListResponse = {
  __typename?: 'ListResponse';
  delimiter: Scalars['String']['output'];
  flags: Array<Scalars['String']['output']>;
  listed: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  path: Scalars['String']['output'];
  specialUse?: Maybe<Scalars['String']['output']>;
  subscribed?: Maybe<Scalars['Boolean']['output']>;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  /** TOTP/2FA code if enabled. */
  totp?: InputMaybe<Scalars['String']['input']>;
  /** Username or email */
  username: Scalars['String']['input'];
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  ban?: Maybe<BanResponse>;
  token: Scalars['String']['output'];
  user: LoginUser;
};

export type LoginUser = {
  __typename?: 'LoginUser';
  banned: Scalars['Boolean']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};

export type LookupPrefix = {
  __typename?: 'LookupPrefix';
  botId: Scalars['Int']['output'];
  command: Scalars['String']['output'];
  description: Scalars['String']['output'];
};

export type LookupPrefixInput = {
  chatAssociationId: Scalars['Int']['input'];
  prefix: Scalars['String']['input'];
};

export type Maintenance = {
  __typename?: 'Maintenance';
  enabled: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  statusPage?: Maybe<Scalars['String']['output']>;
};

export type Message = {
  __typename?: 'Message';
  chat: Chat;
  chatId: Scalars['Int']['output'];
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  edited: Scalars['Boolean']['output'];
  editedAt?: Maybe<Scalars['Date']['output']>;
  embeds: Array<EmbedDataV2>;
  emoji?: Maybe<Array<ChatEmoji>>;
  error: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  pending: Scalars['Boolean']['output'];
  pinned: Scalars['Boolean']['output'];
  readReceipts: Array<ReadReceipt>;
  reply?: Maybe<Message>;
  replyId?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<MessageType>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
};

export type MessageSubscription = {
  __typename?: 'MessageSubscription';
  associationId: Scalars['Int']['output'];
  chat: Chat;
  mention: Scalars['Boolean']['output'];
  message: Message;
};

/** The type of message. Can be null for legacy (Colubrina) messages where `MESSAGE` should be inferred. */
export enum MessageType {
  Administrator = 'ADMINISTRATOR',
  Join = 'JOIN',
  Leave = 'LEAVE',
  Message = 'MESSAGE',
  Pin = 'PIN',
  Rename = 'RENAME',
  System = 'SYSTEM'
}

export type MessagesSearch = {
  after?: InputMaybe<Scalars['Date']['input']>;
  before?: InputMaybe<Scalars['Date']['input']>;
  pins?: InputMaybe<Scalars['Boolean']['input']>;
  query?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  actOnAutoCollects: GenericSuccessObject;
  actOnCollectionInvite: GenericSuccessObject;
  addBotToChat: ChatAssociation;
  addChatRank: ChatRank;
  addChatUsers: GenericSuccessObject;
  addCollectionUser: CollectionUser;
  addOauthUser: OauthUser;
  addToCollection: Array<CollectionItem>;
  /** Currently in beta and only available to people with experiment opt-in. */
  addWorkspaceUser: WorkspaceUser;
  adminClearCache: GenericSuccessObject;
  adminDebugBatch: GenericSuccessObject;
  adminDeleteExperimentOverride: GenericSuccessObject;
  adminGenerateInsights: GenericSuccessObject;
  adminGenerateMimeTypeMap: GenericSuccessObject;
  adminMigrateLegacyRanksForChat: GenericSuccessObject;
  adminMigrateToS3: GenericSuccessObject;
  adminSendEmailForUnverifiedUsers: GenericSuccessObject;
  adminSetExperimentOverride: ExperimentOverride;
  applyDomain: Domain;
  blockUser: GenericSuccessObject;
  cancelTyping: Scalars['Boolean']['output'];
  changeUserEmail: Scalars['Boolean']['output'];
  changeUserPassword: Scalars['Boolean']['output'];
  changeUsername: Scalars['Boolean']['output'];
  confirmDateOfBirth: Scalars['Boolean']['output'];
  createBotOauthApp: PartialUserBase;
  createChat: Chat;
  createChatInvite: ChatInvite;
  createCollection: Collection;
  createNote: Note;
  createOauthApp: OauthApp;
  createPulse: Scalars['String']['output'];
  createSinglePulse: Scalars['String']['output'];
  /** Create workspace */
  createWorkspace: Workspace;
  /** Create a new Workspace Folder. */
  createWorkspaceFolder: WorkspaceFolder;
  deleteAccount: Scalars['Boolean']['output'];
  deleteChatRank: GenericSuccessObject;
  deleteEmoji: GenericSuccessObject;
  deleteGallery: Scalars['Boolean']['output'];
  deleteGroup: GenericSuccessObject;
  deleteMessage: Scalars['Boolean']['output'];
  deleteOauthApp: GenericSuccessObject;
  deleteUploads: GenericSuccessObject;
  /** Delete a Note. */
  deleteWorkspaceItem: Scalars['Boolean']['output'];
  editMessage?: Maybe<Message>;
  embedResolutionPrecache?: Maybe<EmbedDataV2>;
  friend: Scalars['Boolean']['output'];
  invalidateChatInvite: GenericSuccessObject;
  joinChatFromInvite: ChatAssociation;
  leaveChat: GenericSuccessObject;
  leaveCollection: GenericSuccessObject;
  login: LoginResponse;
  logout: Scalars['Boolean']['output'];
  markNotificationsAsRead: Array<Notification>;
  oauthAppAuthorize: AuthorizeAppResponse;
  oauthAppDeauthorize: GenericSuccessObject;
  reactivateAccount: Scalars['Boolean']['output'];
  readChat: GenericSuccessObject;
  register: LoginResponse;
  registerBotCommands: GenericSuccessObject;
  registerBotPrefix: GenericSuccessObject;
  removeCollectionUser: GenericSuccessObject;
  removeFromCollection: Scalars['Int']['output'];
  resendVerificationEmail: Scalars['Boolean']['output'];
  resetOauthSecret: GenericSuccessObject;
  /** @deprecated Use `saveNoteBlock` instead to support collaborative editing. */
  saveNote: Note;
  saveNoteBlock: Scalars['Boolean']['output'];
  saveNoteCollabPosition: Scalars['Boolean']['output'];
  sendMessage: Message;
  setExperiment: Experiment;
  starUpload: StarUploadResponse;
  /** Toggle the ShareLink for a Note. */
  toggleNoteShare: Note;
  toggleUserRank: GenericSuccessObject;
  transferCollectionOwnership: GenericSuccessObject;
  transferGroupOwnership: Chat;
  typing: Scalars['Boolean']['output'];
  updateChat: Chat;
  updateChatRank: ChatRank;
  updateChatRankOrder: Array<ChatRank>;
  updateCollection: Collection;
  updateCollectionUserPermissions: CollectionUser;
  updateEmoji: ChatEmoji;
  updateOauthApp: GenericSuccessObject;
  updateOauthUser: OauthUser;
  updatePulse: Scalars['String']['output'];
  updateStatus?: Maybe<UserStoredStatus>;
  updateUpload: Upload;
  updateUser: Scalars['Boolean']['output'];
  verifyEmail: Scalars['Boolean']['output'];
};


export type MutationActOnAutoCollectsArgs = {
  input: ActOnAutoCollectsInput;
};


export type MutationActOnCollectionInviteArgs = {
  input: AcceptCollectionInviteInput;
};


export type MutationAddBotToChatArgs = {
  input: AddBotToChatInput;
};


export type MutationAddChatRankArgs = {
  input: CreateRank;
};


export type MutationAddChatUsersArgs = {
  input: AddChatUser;
};


export type MutationAddCollectionUserArgs = {
  input: UpdateCollectionUserPermissionsInput;
};


export type MutationAddOauthUserArgs = {
  input: AddAppUserInput;
};


export type MutationAddToCollectionArgs = {
  input: AddToCollectionInput;
};


export type MutationAddWorkspaceUserArgs = {
  input: WorkspaceUserInput;
};


export type MutationAdminClearCacheArgs = {
  input: ClearCacheInput;
};


export type MutationAdminDeleteExperimentOverrideArgs = {
  id: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationAdminGenerateInsightsArgs = {
  customGte?: InputMaybe<Scalars['String']['input']>;
  type: Scalars['String']['input'];
  userId: Scalars['Int']['input'];
};


export type MutationAdminSetExperimentOverrideArgs = {
  input: ExperimentOverrideInput;
};


export type MutationApplyDomainArgs = {
  domainId: Scalars['Int']['input'];
};


export type MutationBlockUserArgs = {
  input: BlockUserInput;
};


export type MutationCancelTypingArgs = {
  input: Scalars['Int']['input'];
};


export type MutationChangeUserEmailArgs = {
  input: ChangeEmailInput;
};


export type MutationChangeUserPasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationChangeUsernameArgs = {
  input: ChangeUsernameInput;
};


export type MutationConfirmDateOfBirthArgs = {
  dateOfBirth: Scalars['String']['input'];
};


export type MutationCreateBotOauthAppArgs = {
  input: CreateBotInput;
};


export type MutationCreateChatArgs = {
  input: CreateChatInput;
};


export type MutationCreateChatInviteArgs = {
  input: CreateInviteInput;
};


export type MutationCreateCollectionArgs = {
  input: CreateCollectionInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationCreateOauthAppArgs = {
  input: CreateAppInput;
};


export type MutationCreatePulseArgs = {
  input: PulseInput;
};


export type MutationCreateSinglePulseArgs = {
  input: SinglePulseInput;
};


export type MutationCreateWorkspaceArgs = {
  input: Scalars['String']['input'];
};


export type MutationCreateWorkspaceFolderArgs = {
  input: CreateWorkspaceFolderInput;
};


export type MutationDeleteAccountArgs = {
  input: DangerZoneInput;
};


export type MutationDeleteChatRankArgs = {
  input: DeleteRank;
};


export type MutationDeleteEmojiArgs = {
  input: DeleteEmojiInput;
};


export type MutationDeleteGalleryArgs = {
  input: DangerZoneInput;
};


export type MutationDeleteGroupArgs = {
  input: DangerZoneChatInput;
};


export type MutationDeleteMessageArgs = {
  input: DeleteMessageInput;
};


export type MutationDeleteOauthAppArgs = {
  input: MyAppInput;
};


export type MutationDeleteUploadsArgs = {
  input: DeleteUploadInput;
};


export type MutationDeleteWorkspaceItemArgs = {
  input: DeleteWorkspaceItemInput;
};


export type MutationEditMessageArgs = {
  input: EditMessageInput;
};


export type MutationEmbedResolutionPrecacheArgs = {
  input: EmbedPrecacheInput;
};


export type MutationFriendArgs = {
  input: AddFriendInput;
};


export type MutationInvalidateChatInviteArgs = {
  input: InvalidateInviteInput;
};


export type MutationJoinChatFromInviteArgs = {
  input: JoinChatFromInviteInput;
};


export type MutationLeaveChatArgs = {
  input: LeaveChatInput;
};


export type MutationLeaveCollectionArgs = {
  input: LeaveCollectionInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationOauthAppAuthorizeArgs = {
  input: AuthorizeAppInput;
};


export type MutationOauthAppDeauthorizeArgs = {
  input: MyAppInput;
};


export type MutationReadChatArgs = {
  input: ReadChatInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationRegisterBotCommandsArgs = {
  input: RegisterCommands;
};


export type MutationRegisterBotPrefixArgs = {
  input: RegisterPrefix;
};


export type MutationRemoveCollectionUserArgs = {
  input: RemoveCollectionUserInput;
};


export type MutationRemoveFromCollectionArgs = {
  input: AddToCollectionInput;
};


export type MutationResetOauthSecretArgs = {
  input: MyAppInput;
};


export type MutationSaveNoteArgs = {
  input: SaveNoteInput;
};


export type MutationSaveNoteBlockArgs = {
  input: UpdateNoteEventInput;
};


export type MutationSaveNoteCollabPositionArgs = {
  input: NoteCollabPositionInput;
};


export type MutationSendMessageArgs = {
  input: SendMessageInput;
};


export type MutationSetExperimentArgs = {
  input: SetExperimentInput;
};


export type MutationStarUploadArgs = {
  input: StarUploadInput;
};


export type MutationToggleNoteShareArgs = {
  input: Scalars['Int']['input'];
};


export type MutationToggleUserRankArgs = {
  input: AddRank;
};


export type MutationTransferCollectionOwnershipArgs = {
  input: TransferCollectionOwnershipInput;
};


export type MutationTransferGroupOwnershipArgs = {
  input: TransferOwnershipInput;
};


export type MutationTypingArgs = {
  input: Scalars['Int']['input'];
};


export type MutationUpdateChatArgs = {
  input: UpdateChatInput;
};


export type MutationUpdateChatRankArgs = {
  input: UpdateRank;
};


export type MutationUpdateChatRankOrderArgs = {
  input: UpdateRankOrder;
};


export type MutationUpdateCollectionArgs = {
  input: UpdateCollectionInput;
};


export type MutationUpdateCollectionUserPermissionsArgs = {
  input: UpdateCollectionUserPermissionsInput;
};


export type MutationUpdateEmojiArgs = {
  input: UpdateEmojiInput;
};


export type MutationUpdateOauthAppArgs = {
  input: UpdateAppInput;
};


export type MutationUpdateOauthUserArgs = {
  input: UpdateAppUserInput;
};


export type MutationUpdatePulseArgs = {
  input: PulseUpdateInput;
};


export type MutationUpdateStatusArgs = {
  input: UpdateUserStatusInput;
};


export type MutationUpdateUploadArgs = {
  input: UpdateUploadInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type MyAppInput = {
  id: Scalars['String']['input'];
};

export type Note = {
  __typename?: 'Note';
  createdAt: Scalars['Date']['output'];
  data?: Maybe<WorkspaceNote>;
  id: Scalars['Int']['output'];
  metadata?: Maybe<WorkspaceNoteMetadata>;
  name: Scalars['String']['output'];
  permissions?: Maybe<NotePermissionsMetadata>;
  shareLink?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  versions: Array<NoteVersion>;
  workspaceFolderId: Scalars['Int']['output'];
};

export type NoteCollabPosition = {
  __typename?: 'NoteCollabPosition';
  blockIndex: Scalars['Int']['output'];
  noteId: Scalars['Int']['output'];
  position: Scalars['Int']['output'];
  shareLink?: Maybe<Scalars['String']['output']>;
  type: CollabEventType;
  userId: Scalars['Int']['output'];
};

export type NoteCollabPositionInput = {
  blockIndex: Scalars['Int']['input'];
  noteId: Scalars['Int']['input'];
  position: Scalars['Int']['input'];
};

export type NoteInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shareLink?: InputMaybe<Scalars['String']['input']>;
};

export type NotePermissionsMetadata = {
  __typename?: 'NotePermissionsMetadata';
  configure: Scalars['Boolean']['output'];
  modify: Scalars['Boolean']['output'];
  read: Scalars['Boolean']['output'];
};

export type NoteVersion = {
  __typename?: 'NoteVersion';
  createdAt: Scalars['Date']['output'];
  data?: Maybe<WorkspaceNote>;
  id: Scalars['String']['output'];
  noteId: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
  userId?: Maybe<Scalars['Int']['output']>;
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['Date']['output'];
  dismissed: Scalars['Boolean']['output'];
  id: Scalars['Int']['output'];
  message: Scalars['String']['output'];
  route?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

export type OauthApp = {
  __typename?: 'OauthApp';
  bot?: Maybe<PartialUserBase>;
  botId?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  oauthUser: OauthUser;
  oauthUsers: Array<OauthUser>;
  private: Scalars['Boolean']['output'];
  redirectUri?: Maybe<Scalars['String']['output']>;
  scopes: Scalars['String']['output'];
  secret?: Maybe<Scalars['String']['output']>;
  shortCode?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
  verified: Scalars['Boolean']['output'];
};

export type OauthConsentApp = {
  __typename?: 'OauthConsentApp';
  bot?: Maybe<PartialUserBase>;
  botId?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  private: Scalars['Boolean']['output'];
  redirectUri?: Maybe<Scalars['String']['output']>;
  scopes: Scalars['String']['output'];
  shortCode?: Maybe<Scalars['String']['output']>;
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
  verified: Scalars['Boolean']['output'];
};

export type OauthUser = {
  __typename?: 'OauthUser';
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['String']['output'];
  manage: Scalars['Boolean']['output'];
  oauthAppId: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

export type PagedMessagesInput = {
  associationId: Scalars['Int']['input'];
  limit?: Scalars['Int']['input'];
  page?: Scalars['Int']['input'];
  position?: InputMaybe<ScrollPosition>;
  search?: InputMaybe<MessagesSearch>;
};

export type Pager = {
  __typename?: 'Pager';
  currentPage: Scalars['Int']['output'];
  endIndex: Scalars['Int']['output'];
  endPage: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  pages: Array<Scalars['Int']['output']>;
  startIndex: Scalars['Int']['output'];
  startPage: Scalars['Int']['output'];
  totalItems: Scalars['Int']['output'];
  totalPages: Scalars['Int']['output'];
};

export type PaginatedChatAuditLogResponse = {
  __typename?: 'PaginatedChatAuditLogResponse';
  items: Array<ChatAuditLog>;
  pager: Pager;
};

export type PaginatedCollectionResponse = {
  __typename?: 'PaginatedCollectionResponse';
  items: Array<Collection>;
  pager: Pager;
};

export type PaginatedMessageResponse = {
  __typename?: 'PaginatedMessageResponse';
  items: Array<Message>;
  pager: Pager;
};

export type PaginatedUploadResponse = {
  __typename?: 'PaginatedUploadResponse';
  items: Array<Upload>;
  pager: Pager;
};

export type PartialUserBase = {
  __typename?: 'PartialUserBase';
  administrator: Scalars['Boolean']['output'];
  autoCollectRules: AutoCollectRule;
  avatar?: Maybe<Scalars['String']['output']>;
  badges: Array<Badge>;
  bot: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  domain: Array<Domain>;
  friend: FriendStatus;
  friends: Array<Friend>;
  id: Scalars['Int']['output'];
  integrations: Array<Integration>;
  legacy: Scalars['Boolean']['output'];
  moderator: Scalars['Boolean']['output'];
  mutualCollections: Array<Collection>;
  notifications: Array<Notification>;
  plan: Plan;
  stats: Stats;
  subscription: Array<TpuSubscription>;
  username: Scalars['String']['output'];
};

export type PartialUserFriend = {
  __typename?: 'PartialUserFriend';
  administrator: Scalars['Boolean']['output'];
  autoCollectRules: AutoCollectRule;
  avatar?: Maybe<Scalars['String']['output']>;
  badges: Array<Badge>;
  blocked?: Maybe<Scalars['Boolean']['output']>;
  bot: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  domain: Array<Domain>;
  friend: FriendStatus;
  friends: Array<Friend>;
  id: Scalars['Int']['output'];
  integrations: Array<Integration>;
  legacy: Scalars['Boolean']['output'];
  moderator: Scalars['Boolean']['output'];
  mutualCollections: Array<Collection>;
  nameColor?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<FriendNickname>;
  notifications: Array<Notification>;
  plan: Plan;
  platforms?: Maybe<Array<Platform>>;
  stats: Stats;
  status: UserStatus;
  subscription: Array<TpuSubscription>;
  username: Scalars['String']['output'];
};

export type PartialUserPublic = {
  __typename?: 'PartialUserPublic';
  administrator: Scalars['Boolean']['output'];
  autoCollectRules: AutoCollectRule;
  avatar?: Maybe<Scalars['String']['output']>;
  badges: Array<Badge>;
  banned: Scalars['Boolean']['output'];
  banner?: Maybe<Scalars['String']['output']>;
  bot: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  description?: Maybe<Scalars['String']['output']>;
  domain: Array<Domain>;
  friend?: Maybe<FriendStatus>;
  friends?: Maybe<Array<Friend>>;
  id: Scalars['Int']['output'];
  insights: UserInsights;
  integrations: Array<Integration>;
  moderator: Scalars['Boolean']['output'];
  mutualCollections: Array<Collection>;
  notifications: Array<Notification>;
  plan: Plan;
  platforms?: Maybe<Array<Platform>>;
  profileLayout?: Maybe<ProfileLayout>;
  publicProfile: Scalars['Boolean']['output'];
  quota: Scalars['Float']['output'];
  stats?: Maybe<Stats>;
  subscription: Array<TpuSubscription>;
  themeEngine?: Maybe<Scalars['JSON']['output']>;
  username: Scalars['String']['output'];
  xp?: Maybe<Scalars['Int']['output']>;
};

export type PermissionsMetadata = {
  __typename?: 'PermissionsMetadata';
  configure: Scalars['Boolean']['output'];
  read: Scalars['Boolean']['output'];
  write: Scalars['Boolean']['output'];
};

export type Plan = {
  __typename?: 'Plan';
  color?: Maybe<Scalars['String']['output']>;
  /** @deprecated Plans are unused in TPUv2+. */
  features?: Maybe<Scalars['String']['output']>;
  icon: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  internalFeatures?: Maybe<Scalars['String']['output']>;
  internalName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  price: Scalars['Float']['output'];
  /** @deprecated Plans are unused in TPUv2+. */
  purchasable: Scalars['Boolean']['output'];
  quotaMax: Scalars['Float']['output'];
};

export type Platform = {
  __typename?: 'Platform';
  id: Scalars['String']['output'];
  lastSeen: Scalars['String']['output'];
  platform: PlatformType;
  status: UserStatus;
};

/** Platform type of user device. */
export enum PlatformType {
  Desktop = 'DESKTOP',
  Mobile = 'MOBILE',
  Web = 'WEB'
}

export type Prefix = {
  __typename?: 'Prefix';
  commands: Array<LookupPrefix>;
  prefix: Scalars['String']['output'];
};

export type ProfileLayout = {
  __typename?: 'ProfileLayout';
  config: ProfileLayoutConfig;
  layout: ProfileLayoutObject;
  version: Scalars['Int']['output'];
};

export type ProfileLayoutColumn = {
  __typename?: 'ProfileLayoutColumn';
  rows: Array<ProfileLayoutComponent>;
};

export type ProfileLayoutComponent = {
  __typename?: 'ProfileLayoutComponent';
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  props?: Maybe<ProfileLayoutProps>;
};

export type ProfileLayoutConfig = {
  __typename?: 'ProfileLayoutConfig';
  containerMargin?: Maybe<Scalars['Int']['output']>;
  showStatsSidebar: Scalars['Boolean']['output'];
};

export type ProfileLayoutObject = {
  __typename?: 'ProfileLayoutObject';
  columns: Array<ProfileLayoutColumn>;
};

export type ProfileLayoutPropLink = {
  __typename?: 'ProfileLayoutPropLink';
  color: Scalars['String']['output'];
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type ProfileLayoutProps = {
  __typename?: 'ProfileLayoutProps';
  children?: Maybe<Array<ProfileLayoutComponent>>;
  display?: Maybe<Scalars['Int']['output']>;
  friendsOnly?: Maybe<Scalars['Boolean']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  links?: Maybe<Array<ProfileLayoutPropLink>>;
  type?: Maybe<Scalars['String']['output']>;
};

export type Providers = {
  __typename?: 'Providers';
  anilist: Scalars['Boolean']['output'];
  lastfm: Scalars['Boolean']['output'];
  mal: Scalars['Boolean']['output'];
};

export type PulseInput = {
  action: Scalars['String']['input'];
  device: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  other?: InputMaybe<Scalars['JSON']['input']>;
  route: Scalars['String']['input'];
  sysInfo: PulseUserAgent;
  type: Scalars['String']['input'];
};

export type PulseUpdateInput = {
  id: Scalars['String']['input'];
  timeSpent: Scalars['Float']['input'];
};

export type PulseUserAgent = {
  ua: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  adminGetExperimentOverrides: Array<ExperimentOverride>;
  adminPlans: Array<Plan>;
  autoCollectRule: AutoCollectRule;
  autoCollectRules: Array<AutoCollectRule>;
  autoCollects: PaginatedCollectionResponse;
  availableChatPermissions: Array<ChatPermission>;
  blockedUsers: Array<BlockedUser>;
  chat: Chat;
  chatAuditLog: PaginatedChatAuditLogResponse;
  chatInvite?: Maybe<ChatInvite>;
  chats: Array<Chat>;
  collection?: Maybe<Collection>;
  /** Return the number of pending invitations for collections for the current user */
  collectionInvitesCount: Scalars['Int']['output'];
  collections: PaginatedCollectionResponse;
  coreState: CoreState;
  currentUser?: Maybe<User>;
  domains: Array<Domain>;
  experiments: Array<ExperimentType>;
  friends: Array<Friend>;
  gallery: PaginatedUploadResponse;
  getAuthorizedApps: Array<OauthApp>;
  getMail: Scalars['JSON']['output'];
  lookupBotPrefix: Prefix;
  mailboxes: Array<ListResponse>;
  messages: Array<Message>;
  messagesPaged: PaginatedMessageResponse;
  note?: Maybe<Note>;
  oauthApp: OauthApp;
  oauthAppConsent: OauthConsentApp;
  oauthApps: Array<OauthApp>;
  setupStep: Scalars['Int']['output'];
  trackedUserIds: Array<Scalars['Int']['output']>;
  trackedUsers: Array<PartialUserFriend>;
  unreadMail: Scalars['Int']['output'];
  user?: Maybe<PartialUserPublic>;
  userEmoji: Array<ChatEmoji>;
  weather: Weather;
  workspaces: Array<Workspace>;
};


export type QueryAdminGetExperimentOverridesArgs = {
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAutoCollectRuleArgs = {
  input: AutoCollectRuleQueryInput;
};


export type QueryAutoCollectsArgs = {
  input: UserCollectionsInput;
};


export type QueryChatArgs = {
  input: ChatInput;
};


export type QueryChatAuditLogArgs = {
  input: AuditLogInput;
};


export type QueryChatInviteArgs = {
  input: InviteInput;
};


export type QueryChatsArgs = {
  input?: InputMaybe<ChatsInput>;
};


export type QueryCollectionArgs = {
  input: CollectionInput;
};


export type QueryCollectionsArgs = {
  input?: InputMaybe<UserCollectionsInput>;
};


export type QueryExperimentsArgs = {
  version?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryFriendsArgs = {
  input?: InputMaybe<FriendsInput>;
};


export type QueryGalleryArgs = {
  input: GalleryInput;
};


export type QueryGetMailArgs = {
  input: GetMailInput;
};


export type QueryLookupBotPrefixArgs = {
  input: LookupPrefixInput;
};


export type QueryMessagesArgs = {
  input: InfiniteMessagesInput;
};


export type QueryMessagesPagedArgs = {
  input: PagedMessagesInput;
};


export type QueryNoteArgs = {
  input: NoteInput;
};


export type QueryOauthAppArgs = {
  input: MyAppInput;
};


export type QueryOauthAppConsentArgs = {
  input: MyAppInput;
};


export type QueryUserArgs = {
  input: UserProfileInput;
};

/** The category that the permission is categorized into for Communications ranks. */
export enum RankPermissionGroup {
  Admin = 'ADMIN',
  General = 'GENERAL',
  Manage = 'MANAGE',
  Options = 'OPTIONS'
}

export type ReadChatInput = {
  associationId: Scalars['Int']['input'];
};

export type ReadReceipt = {
  __typename?: 'ReadReceipt';
  associationId: Scalars['Int']['output'];
  chatId: Scalars['Int']['output'];
  messageId: Scalars['Int']['output'];
  user?: Maybe<PartialUserBase>;
};

export type RegisterCommand = {
  command: Scalars['String']['input'];
  description: Scalars['String']['input'];
};

export type RegisterCommands = {
  commands: Array<RegisterCommand>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  inviteKey?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type RegisterPrefix = {
  prefix: Scalars['String']['input'];
};

export type RemoveCollectionUserInput = {
  collectionId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type SaveNoteInput = {
  data: WorkspaceNoteInput;
  id: Scalars['Int']['input'];
  manualSave?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

/** The position to retrieve messages from based on the `offset`. */
export enum ScrollPosition {
  Bottom = 'BOTTOM',
  Top = 'TOP'
}

export type SearchModeInput = {
  mode: GallerySearchMode;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type SendMessageInput = {
  associationId: Scalars['Int']['input'];
  attachments?: Array<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  embeds?: InputMaybe<Array<EmbedInput>>;
  replyId?: InputMaybe<Scalars['Int']['input']>;
};

export type Session = {
  __typename?: 'Session';
  createdAt?: Maybe<Scalars['Date']['output']>;
  expiredAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['Int']['output'];
  info?: Maybe<SessionInfo>;
  name?: Maybe<Scalars['String']['output']>;
  oauthAppId?: Maybe<Scalars['String']['output']>;
  scopes: Scalars['String']['output'];
  /** Only populated for `API` type sessions on `currentUser`. */
  token?: Maybe<Scalars['String']['output']>;
  type: SessionType;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  userId: Scalars['Int']['output'];
};

export type SessionInfo = {
  __typename?: 'SessionInfo';
  accessedFrom: Array<AccessedFrom>;
};

export type SessionInput = {
  type: SessionType;
};

export enum SessionType {
  Api = 'API',
  Oauth = 'OAUTH',
  WebSession = 'WEB_SESSION'
}

export type SetExperimentInput = {
  key: Scalars['String']['input'];
  /** Admin only. */
  userId?: InputMaybe<Scalars['Int']['input']>;
  value: Scalars['Int']['input'];
};

export type SinglePulseInput = {
  action: Scalars['String']['input'];
  device: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  other?: InputMaybe<Scalars['JSON']['input']>;
  route: Scalars['String']['input'];
  sysInfo: PulseUserAgent;
  timeSpent: Scalars['Float']['input'];
  type: Scalars['String']['input'];
};

export type Star = {
  __typename?: 'Star';
  attachment: Upload;
  attachmentId: Scalars['Int']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

export type StarUploadInput = {
  /** The upload's attachment ID, not numerical ID, such as 1d7fe21g3jd1.png */
  attachment: Scalars['String']['input'];
};

export type StarUploadResponse = {
  __typename?: 'StarUploadResponse';
  star?: Maybe<Star>;
  status: Scalars['Boolean']['output'];
};

export type Stats = {
  __typename?: 'Stats';
  announcements: Scalars['Int']['output'];
  collectionItems: Scalars['Int']['output'];
  collections: Scalars['Int']['output'];
  docs: Scalars['Int']['output'];
  hours?: Maybe<Scalars['JSON']['output']>;
  messageGraph?: Maybe<DataLabelsGraph>;
  messages: Scalars['Int']['output'];
  pulse: Scalars['Int']['output'];
  pulseGraph?: Maybe<DataLabelsGraph>;
  pulses: Scalars['Int']['output'];
  uploadGraph?: Maybe<DataLabelsGraph>;
  uploads: Scalars['Int']['output'];
  usage?: Maybe<Scalars['BigInt']['output']>;
  users: Scalars['Int']['output'];
};

export type StatusEvent = {
  __typename?: 'StatusEvent';
  id: Scalars['Int']['output'];
  platforms?: Maybe<Array<Platform>>;
  status: UserStatus;
};

export type SubRule = {
  __typename?: 'SubRule';
  id: Scalars['Int']['output'];
  operator: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  onAutoCollectApproval: AutoCollectApprovalEvent;
  onCancelTyping: ChatTypingEvent;
  onCollectionCreated: Collection;
  onCollectionInviteCount: Scalars['Int']['output'];
  onCollectionRemoved: Scalars['Int']['output'];
  onCollectionUpdated: Collection;
  onCollectionUserAdded: CollectionUser;
  onCollectionUserRemoved: CollectionUser;
  onCollectionUserUpdated: CollectionUser;
  onCreateUpload: CreateUploadEvent;
  onDeleteMessage: DeleteMessage;
  onDeleteUpload: Scalars['Int']['output'];
  onEditMessage: EditMessageEvent;
  onMessage: MessageSubscription;
  /** Subscribe to Note collaborative user positions. */
  onNoteCollabPosition: NoteCollabPosition;
  /** Returns the chat association ID */
  onReadChat: Scalars['Int']['output'];
  onReadReceipt: ReadReceipt;
  onTyping: ChatTypingEvent;
  /** Subscribe to Note updates. */
  onUpdateNote: UpdateNoteEvent;
  onUpdateUploads: Array<Upload>;
  onUserStatus: StatusEvent;
};


export type SubscriptionOnCollectionRemovedArgs = {
  input?: InputMaybe<FilterCollectionInput>;
};


export type SubscriptionOnCollectionUpdatedArgs = {
  input?: InputMaybe<FilterCollectionInput>;
};


export type SubscriptionOnCollectionUserAddedArgs = {
  input?: InputMaybe<FilterCollectionInput>;
};


export type SubscriptionOnCollectionUserRemovedArgs = {
  input?: InputMaybe<FilterCollectionInput>;
};


export type SubscriptionOnCollectionUserUpdatedArgs = {
  input?: InputMaybe<FilterCollectionInput>;
};


export type SubscriptionOnCreateUploadArgs = {
  input?: InputMaybe<GalleryInput>;
};


export type SubscriptionOnDeleteMessageArgs = {
  input?: InputMaybe<SubscriptionMessageInput>;
};


export type SubscriptionOnEditMessageArgs = {
  input?: InputMaybe<SubscriptionMessageInput>;
};


export type SubscriptionOnMessageArgs = {
  input?: InputMaybe<SubscriptionMessageInput>;
};


export type SubscriptionOnNoteCollabPositionArgs = {
  noteId?: InputMaybe<Scalars['Int']['input']>;
  shareLink?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnUpdateNoteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  shareLink?: InputMaybe<Scalars['String']['input']>;
};

export type SubscriptionMessageInput = {
  associationId?: InputMaybe<Scalars['Int']['input']>;
  chatId?: InputMaybe<Scalars['Int']['input']>;
};

export type SubscriptionMetadata = {
  __typename?: 'SubscriptionMetadata';
  hours: Scalars['Float']['output'];
};

export type TpuSubscription = {
  __typename?: 'TPUSubscription';
  cancelled: Scalars['Boolean']['output'];
  cancelledAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['Date']['output'];
  expiredAt?: Maybe<Scalars['DateTimeISO']['output']>;
  metadata?: Maybe<SubscriptionMetadata>;
  paymentId: Scalars['Int']['output'];
  planId: Scalars['Int']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

/** Whether the user should be added, or removed from the group. */
export enum ToggleUser {
  Add = 'ADD',
  Remove = 'REMOVE'
}

export type TransferCollectionOwnershipInput = {
  collectionId: Scalars['Int']['input'];
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['Int']['input'];
};

export type TransferOwnershipInput = {
  associationId: Scalars['Int']['input'];
  /** You may use either 2FA token or password to delete the chat. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** TOTP/2FA code if enabled. You may use either 2FA token or password to delete the chat. */
  totp?: InputMaybe<Scalars['String']['input']>;
  /** User to transfer to. */
  userId: Scalars['Int']['input'];
};

export type UpdateAppInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
  private: Scalars['Boolean']['input'];
  redirectUri?: InputMaybe<Scalars['String']['input']>;
  scopes?: InputMaybe<Array<Scalars['String']['input']>>;
  verified: Scalars['Boolean']['input'];
};

export type UpdateAppUserInput = {
  id: Scalars['String']['input'];
  manage: Scalars['Boolean']['input'];
  oauthAppId: Scalars['String']['input'];
};

export type UpdateChatInput = {
  associationId: Scalars['Int']['input'];
  /** Can only be null or undefined to unset or do not modify the group background respectively. Use the REST API to set one. */
  background?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /** Can only be null or undefined to unset or do not modify the group icon respectively. Use the REST API to set one. */
  icon?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCollectionInput = {
  collectionId: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  shareLink?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateCollectionUserPermissionsInput = {
  collectionId: Scalars['Int']['input'];
  configure: Scalars['Boolean']['input'];
  read: Scalars['Boolean']['input'];
  userId: Scalars['Int']['input'];
  write: Scalars['Boolean']['input'];
};

export type UpdateEmojiInput = {
  associationId: Scalars['Int']['input'];
  id: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type UpdateNoteEvent = {
  __typename?: 'UpdateNoteEvent';
  blockId?: Maybe<Scalars['String']['output']>;
  data?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['Int']['output'];
  shareLink?: Maybe<Scalars['String']['output']>;
  type: UpdateNoteEventType;
  userId: Scalars['Int']['output'];
};

export type UpdateNoteEventInput = {
  blockId?: InputMaybe<Scalars['String']['input']>;
  data?: InputMaybe<Scalars['JSON']['input']>;
  id: Scalars['Int']['input'];
  type: UpdateNoteEventType;
};

export enum UpdateNoteEventType {
  Delete = 'DELETE',
  Insert = 'INSERT',
  Update = 'UPDATE'
}

export type UpdateRank = {
  associationId: Scalars['Int']['input'];
  color?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  permissionsMap: Array<Scalars['String']['input']>;
  rankId: Scalars['String']['input'];
};

export type UpdateRankOrder = {
  associationId: Scalars['Int']['input'];
  /** Order if the rank, this is actually reversed from expected index value, so rankIds[0] is the highest priority rank. */
  rankIds: Array<Scalars['String']['input']>;
};

export type UpdateUploadInput = {
  name: Scalars['String']['input'];
  uploadId: Scalars['Int']['input'];
};

export type UpdateUserInput = {
  darkTheme?: InputMaybe<Scalars['Boolean']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  discordPrecache?: InputMaybe<Scalars['Boolean']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  excludedCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  friendRequests?: InputMaybe<UserFriendRequestPrivacy>;
  groupPrivacy?: InputMaybe<UserGroupPrivacy>;
  insights?: InputMaybe<Scalars['String']['input']>;
  itemsPerPage?: InputMaybe<Scalars['Int']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  nameColor?: InputMaybe<Scalars['String']['input']>;
  privacyPolicyAccepted?: InputMaybe<Scalars['Boolean']['input']>;
  profileLayout?: InputMaybe<Scalars['JSON']['input']>;
  publicProfile?: InputMaybe<Scalars['Boolean']['input']>;
  pulse?: InputMaybe<Scalars['Boolean']['input']>;
  storedStatus?: InputMaybe<Scalars['String']['input']>;
  themeEngine?: InputMaybe<Scalars['JSON']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  weatherUnit?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserStatusInput = {
  /** Temporary status change, for IDLE status. */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Permanent status change. */
  storedStatus?: InputMaybe<UserStoredStatus>;
};

export type Upload = {
  __typename?: 'Upload';
  attachment: Scalars['String']['output'];
  autoCollectApproval?: Maybe<AutoCollectApproval>;
  collections: Array<Collection>;
  createdAt: Scalars['Date']['output'];
  /** Non-deletable items are used for profile pictures, banners, etc and are not visible in the Gallery page by default, and cannot be deleted. */
  deletable: Scalars['Boolean']['output'];
  fileSize: Scalars['Float']['output'];
  id: Scalars['Int']['output'];
  item?: Maybe<CollectionItem>;
  items: Array<CollectionItem>;
  /** The location of the file on a server. 's3' defines AWS S3, 'local' defines the local 'storage' folder, and any other string assumes a hostname of a server within the Flowinity network. */
  location: Scalars['String']['output'];
  mimeType: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  originalFilename?: Maybe<Scalars['String']['output']>;
  sha256sum?: Maybe<Scalars['String']['output']>;
  starred?: Maybe<Star>;
  /** This is used for OCR scanned text from images. */
  textMetadata?: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  /** @deprecated URL redirects were removed in TPUv2/NEXT. */
  urlRedirect?: Maybe<Scalars['String']['output']>;
  user?: Maybe<PartialUserBase>;
  userId: Scalars['Int']['output'];
};

export type User = {
  __typename?: 'User';
  administrator: Scalars['Boolean']['output'];
  /** Ability to login with more then 1 password with different scopes. */
  alternatePasswords?: Maybe<Array<AlternatePassword>>;
  autoCollectRules: Array<AutoCollectRule>;
  avatar?: Maybe<Scalars['String']['output']>;
  badges: Array<Badge>;
  banReason?: Maybe<Scalars['String']['output']>;
  banReasonType?: Maybe<BanReason>;
  banned: Scalars['Boolean']['output'];
  /** UserV2 banner. */
  banner?: Maybe<Scalars['String']['output']>;
  /** Whether the user is a bot user. */
  bot: Scalars['Boolean']['output'];
  canAccessRestrictedContent: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  darkTheme: Scalars['Boolean']['output'];
  dateOfBirth?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discordPrecache: Scalars['Boolean']['output'];
  domain?: Maybe<Domain>;
  domainId: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  emailVerified: Scalars['Boolean']['output'];
  /** Collections that are excluded from the Collections filter in Gallery. */
  excludedCollections?: Maybe<Array<Scalars['Int']['output']>>;
  experiments?: Maybe<Array<Experiment>>;
  /** @deprecated Fake paths are no longer available as of TPUv2/NEXT. */
  fakePath?: Maybe<Scalars['String']['output']>;
  forceAgeVerification: Scalars['Boolean']['output'];
  friend: FriendStatus;
  /** Whether the user can be sent a friend request. */
  friendRequests: UserFriendRequestPrivacy;
  friends: Array<Friend>;
  /** Whether the user can be added directly into groups. */
  groupPrivacy: UserGroupPrivacy;
  homeWidgets?: Maybe<HomeWidgets>;
  id: Scalars['Int']['output'];
  insights: UserInsights;
  integrations: Array<Integration>;
  /** @deprecated Invisible URLs are no longer available as of TPUv2/NEXT. */
  invisibleURLs: Scalars['Boolean']['output'];
  inviteId?: Maybe<Scalars['Int']['output']>;
  itemsPerPage: Scalars['Int']['output'];
  language: Scalars['String']['output'];
  legacy: Scalars['Boolean']['output'];
  moderator: Scalars['Boolean']['output'];
  mutualCollections: Array<Collection>;
  /**
   * The user's name color in Communications.
   * @deprecated Replaced by ranks
   */
  nameColor?: Maybe<Scalars['String']['output']>;
  nickname?: Maybe<Array<FriendNickname>>;
  notifications: Array<Notification>;
  oauthAppId?: Maybe<Scalars['String']['output']>;
  /** How many AutoCollect approvals the user needs to approve/reject. */
  pendingAutoCollects?: Maybe<Scalars['Int']['output']>;
  pendingDeletionDate?: Maybe<Scalars['Date']['output']>;
  plan?: Maybe<Plan>;
  planId?: Maybe<Scalars['Int']['output']>;
  privacyPolicyAccepted?: Maybe<Scalars['Boolean']['output']>;
  profileLayout?: Maybe<Scalars['JSON']['output']>;
  publicProfile: Scalars['Boolean']['output'];
  /** Whether the user has TPU Pulse Telemetry enabled. */
  pulse: Scalars['Boolean']['output'];
  /** How much the user has uploaded in bytes. */
  quota: Scalars['Float']['output'];
  /** The user's scopes assigned to the API key used. In format like `user.view,user.modify` which belong to `Scope`. */
  scopes?: Maybe<Scalars['String']['output']>;
  sessions: Array<Session>;
  stats?: Maybe<Stats>;
  /** User status/presence shown to other users. */
  status: UserStatus;
  /** User status/presence that has `invisible` and is shown to the current user. */
  storedStatus: UserStoredStatus;
  /** @deprecated Subdomains are no longer available as of TPUv2/NEXT. */
  subdomainId?: Maybe<Scalars['Int']['output']>;
  subscription?: Maybe<TpuSubscription>;
  /** Subscriptions are no longer used as they were in TPUv1, and are now used to store metadata for permanent Gold subscriptions. */
  subscriptionId?: Maybe<Scalars['Int']['output']>;
  themeEngine?: Maybe<Scalars['JSON']['output']>;
  /** @deprecated Replaced with `themeEngine`, used in legacy clients such as legacy.privateuploader.com. */
  themeId: Scalars['Int']['output'];
  totpEnable: Scalars['Boolean']['output'];
  updatedAt: Scalars['Date']['output'];
  /** @deprecated Hidden upload usernames are no longer available as of TPUv2/NEXT. */
  uploadNameHidden: Scalars['Boolean']['output'];
  username: Scalars['String']['output'];
  weatherUnit: Scalars['String']['output'];
  /** How much the user has donated to PrivateUploader. (Likely unused in unofficial instances.) */
  xp: Scalars['Float']['output'];
};


export type UserSessionsArgs = {
  input?: InputMaybe<SessionInput>;
};

export type UserCollectionsInput = {
  filter?: Array<CollectionFilter>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  onlyInvited?: Scalars['Boolean']['input'];
  page?: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
};

/** Preference of who can send them friend requests. */
export enum UserFriendRequestPrivacy {
  Everyone = 'EVERYONE',
  Nobody = 'NOBODY'
}

/** Preference of who can add them directly into groups. */
export enum UserGroupPrivacy {
  Friends = 'FRIENDS',
  Nobody = 'NOBODY'
}

/** Insights privacy preference. */
export enum UserInsights {
  Everyone = 'EVERYONE',
  Friends = 'FRIENDS',
  Nobody = 'NOBODY'
}

export type UserProfileInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};

/** User status/presence shown to other users. */
export enum UserStatus {
  Busy = 'BUSY',
  Idle = 'IDLE',
  Offline = 'OFFLINE',
  Online = 'ONLINE'
}

/** User status/presence that has `invisible` and is shown to the current user. */
export enum UserStoredStatus {
  Busy = 'BUSY',
  Idle = 'IDLE',
  Invisible = 'INVISIBLE',
  Online = 'ONLINE'
}

export type Weather = {
  __typename?: 'Weather';
  cached?: Maybe<Scalars['Boolean']['output']>;
  clouds?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['Boolean']['output']>;
  feels_like?: Maybe<Scalars['Float']['output']>;
  humidity?: Maybe<Scalars['Float']['output']>;
  icon?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  main?: Maybe<Scalars['String']['output']>;
  pressure?: Maybe<Scalars['Float']['output']>;
  rain_1h?: Maybe<Scalars['Float']['output']>;
  rain_3h?: Maybe<Scalars['Float']['output']>;
  sunrise?: Maybe<Scalars['Float']['output']>;
  sunset?: Maybe<Scalars['Float']['output']>;
  temp?: Maybe<Scalars['Float']['output']>;
  temp_max?: Maybe<Scalars['Float']['output']>;
  temp_min?: Maybe<Scalars['Float']['output']>;
  visibility?: Maybe<Scalars['Float']['output']>;
  wind_deg?: Maybe<Scalars['Float']['output']>;
  wind_gust?: Maybe<Scalars['Float']['output']>;
  wind_speed?: Maybe<Scalars['Float']['output']>;
};

export type Workspace = {
  __typename?: 'Workspace';
  createdAt: Scalars['Date']['output'];
  folders: Array<WorkspaceFolder>;
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  userId?: Maybe<Scalars['Int']['output']>;
  users: Array<WorkspaceUser>;
};

export type WorkspaceFolder = {
  __typename?: 'WorkspaceFolder';
  children: Array<Note>;
  createdAt: Scalars['Date']['output'];
  folderId?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
  workspace: Workspace;
  workspaceId: Scalars['Int']['output'];
};

/** The type of workspace item */
export enum WorkspaceItemType {
  Folder = 'FOLDER',
  Note = 'NOTE',
  Workspace = 'WORKSPACE'
}

export type WorkspaceNote = {
  __typename?: 'WorkspaceNote';
  blocks?: Maybe<Scalars['JSON']['output']>;
  time?: Maybe<Scalars['Float']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type WorkspaceNoteInput = {
  blocks?: InputMaybe<Scalars['JSON']['input']>;
  time?: InputMaybe<Scalars['Float']['input']>;
  version?: InputMaybe<Scalars['String']['input']>;
};

export type WorkspaceNoteMetadata = {
  __typename?: 'WorkspaceNoteMetadata';
  version?: Maybe<Scalars['String']['output']>;
};

export type WorkspaceUser = {
  __typename?: 'WorkspaceUser';
  accepted: Scalars['Boolean']['output'];
  configure: Scalars['Boolean']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['Int']['output'];
  /** The unique identifier between the User and the Workspace. */
  identifier?: Maybe<Scalars['String']['output']>;
  read: Scalars['Boolean']['output'];
  recipientId: Scalars['Int']['output'];
  sender?: Maybe<PartialUserBase>;
  senderId: Scalars['Int']['output'];
  updatedAt: Scalars['Date']['output'];
  user?: Maybe<PartialUserBase>;
  workspace: Workspace;
  workspaceId: Scalars['Int']['output'];
  write: Scalars['Boolean']['output'];
};

export type WorkspaceUserInput = {
  configure: Scalars['Boolean']['input'];
  read: Scalars['Boolean']['input'];
  userId: Scalars['Int']['input'];
  workspaceId: Scalars['Int']['input'];
  write: Scalars['Boolean']['input'];
};

export type AdminClearCacheMutationVariables = Exact<{
  input: ClearCacheInput;
}>;


export type AdminClearCacheMutation = { __typename?: 'Mutation', adminClearCache: { __typename?: 'GenericSuccessObject', success: boolean } };

export type AdminGetPlansQueryVariables = Exact<{ [key: string]: never; }>;


export type AdminGetPlansQuery = { __typename?: 'Query', adminPlans: Array<{ __typename?: 'Plan', id: number, name: string, quotaMax: number, price: number, features?: string | null, color?: string | null, internalName: string, purchasable: boolean, internalFeatures?: string | null, icon: string }> };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginResponse', token: string, user: { __typename?: 'LoginUser', id: number, username: string, email: string } } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'LoginResponse', token: string, user: { __typename?: 'LoginUser', id: number, username: string, email: string } } };

export type ActOnAutoCollectsMutationVariables = Exact<{
  input: ActOnAutoCollectsInput;
}>;


export type ActOnAutoCollectsMutation = { __typename?: 'Mutation', actOnAutoCollects: { __typename?: 'GenericSuccessObject', success: boolean } };

export type AutoCollectsQueryVariables = Exact<{
  input: UserCollectionsInput;
}>;


export type AutoCollectsQuery = { __typename?: 'Query', autoCollects: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', name: string, id: number, image?: string | null, shareLink?: string | null, userId: number, itemCount?: number | null, preview?: { __typename?: 'CollectionItem', attachment: { __typename?: 'Upload', attachment: string } } | null, users: Array<{ __typename?: 'CollectionUser', id: number, user?: { __typename?: 'PartialUserBase', username: string, id: number } | null }>, autoCollectApprovals: Array<{ __typename?: 'AutoCollectApproval', id: number, autoCollectRuleId: number, attachment?: { __typename?: 'Upload', attachment: string, id: number, name?: string | null, originalFilename?: string | null, type: string, userId: number, createdAt: any, fileSize: number, textMetadata?: string | null, collections: Array<{ __typename?: 'Collection', name: string, id: number }>, starred?: { __typename?: 'Star', id: number } | null } | null, autoCollectRule?: { __typename?: 'AutoCollectRule', name: string } | null }> }>, pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } } };

export type AutoCollectRulesQueryVariables = Exact<{ [key: string]: never; }>;


export type AutoCollectRulesQuery = { __typename?: 'Query', autoCollectRules: Array<{ __typename?: 'AutoCollectRule', id: number, name: string, enabled: boolean, collectionId: number }> };

export type AutoCollectRuleQueryVariables = Exact<{
  input: AutoCollectRuleQueryInput;
}>;


export type AutoCollectRuleQuery = { __typename?: 'Query', autoCollectRule: { __typename?: 'AutoCollectRule', id: number, name: string, enabled: boolean, collectionId: number, requireApproval: boolean, rules: Array<{ __typename?: 'AutoCollectParentRule', id: number, rules: Array<{ __typename?: 'SubRule', id: number, type: string, value: string, operator: string }> }> } };

export type AddChatUsersMutationVariables = Exact<{
  input: AddChatUser;
}>;


export type AddChatUsersMutation = { __typename?: 'Mutation', addChatUsers: { __typename?: 'GenericSuccessObject', success: boolean } };

export type ChatAuditLogQueryVariables = Exact<{
  input: AuditLogInput;
}>;


export type ChatAuditLogQuery = { __typename?: 'Query', chatAuditLog: { __typename?: 'PaginatedChatAuditLogResponse', items: Array<{ __typename?: 'ChatAuditLog', id: string, userId?: number | null, chatId: number, category: AuditLogCategory, actionType: AuditLogActionType, message: string, createdAt: any, updatedAt: any }>, pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } } };

export type ChatsQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ChatsQueryQuery = { __typename?: 'Query', userEmoji: Array<{ __typename?: 'ChatEmoji', id: string, userId?: number | null, chatId: number, icon?: string | null, name?: string | null, createdAt: any, updatedAt: any }>, chats: Array<{ __typename?: 'Chat', id: number, description?: string | null, type: string, background?: string | null, unread?: number | null, name: string, userId?: number | null, icon?: string | null, createdAt: any, updatedAt: any, _redisSortDate?: string | null, usersCount: number, onlineCount: number, recipient?: { __typename?: 'PartialUserBase', id: number } | null, association?: { __typename?: 'ChatAssociation', id: number, hidden?: boolean | null, chatId: number, permissions: Array<string>, userId?: number | null, rank: string, createdAt: any, lastRead?: number | null, notifications: string } | null }> };

export type ChatQueryVariables = Exact<{
  input: ChatInput;
}>;


export type ChatQuery = { __typename?: 'Query', chat: { __typename?: 'Chat', id: number, users: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, createdAt: any, lastRead?: number | null, ranksMap: Array<string> }>, ranks: Array<{ __typename?: 'ChatRank', id: string, color?: string | null, name: string, userId?: number | null, createdAt?: any | null, chatId: number, updatedAt?: any | null, managed: boolean, index: number, permissionsMap: Array<string> }>, invites: Array<{ __typename?: 'ChatInvite', id: string, userId?: number | null, createdAt: any, rankId?: string | null, updatedAt: any, expiredAt?: any | null, invalidated: boolean }> } };

export type ChatsQueryOldQueryVariables = Exact<{ [key: string]: never; }>;


export type ChatsQueryOldQuery = { __typename?: 'Query', userEmoji: Array<{ __typename?: 'ChatEmoji', id: string, userId?: number | null, chatId: number, icon?: string | null, name?: string | null, createdAt: any, updatedAt: any }>, chats: Array<{ __typename?: 'Chat', id: number, description?: string | null, type: string, background?: string | null, unread?: number | null, name: string, userId?: number | null, icon?: string | null, createdAt: any, updatedAt: any, _redisSortDate?: string | null, invites: Array<{ __typename?: 'ChatInvite', id: string, userId?: number | null, createdAt: any, rankId?: string | null, updatedAt: any, expiredAt?: any | null, invalidated: boolean }>, association?: { __typename?: 'ChatAssociation', id: number, hidden?: boolean | null, chatId: number, permissions: Array<string>, userId?: number | null, rank: string, createdAt: any, lastRead?: number | null, notifications: string } | null, users: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, createdAt: any, lastRead?: number | null, ranksMap: Array<string> }>, recipient?: { __typename?: 'PartialUserBase', id: number } | null, ranks: Array<{ __typename?: 'ChatRank', id: string, color?: string | null, name: string, userId?: number | null, createdAt?: any | null, chatId: number, updatedAt?: any | null, managed: boolean, index: number, permissionsMap: Array<string> }> }> };

export type GetChatUsersQueryVariables = Exact<{
  input: ChatInput;
}>;


export type GetChatUsersQuery = { __typename?: 'Query', chat: { __typename?: 'Chat', users: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, user?: { __typename?: 'PartialUserBase', id: number, username: string, avatar?: string | null } | null }> } };

export type CreateChatMutationVariables = Exact<{
  input: CreateChatInput;
}>;


export type CreateChatMutation = { __typename?: 'Mutation', createChat: { __typename?: 'Chat', id: number, association?: { __typename?: 'ChatAssociation', id: number } | null } };

export type AddChatRankMutationVariables = Exact<{
  input: CreateRank;
}>;


export type AddChatRankMutation = { __typename?: 'Mutation', addChatRank: { __typename?: 'ChatRank', id: string } };

export type DeleteEmojiMutationVariables = Exact<{
  input: DeleteEmojiInput;
}>;


export type DeleteEmojiMutation = { __typename?: 'Mutation', deleteEmoji: { __typename?: 'GenericSuccessObject', success: boolean } };

export type DeleteGroupMutationVariables = Exact<{
  input: DangerZoneChatInput;
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: { __typename?: 'GenericSuccessObject', success: boolean } };

export type LeaveChatMutationVariables = Exact<{
  input: LeaveChatInput;
}>;


export type LeaveChatMutation = { __typename?: 'Mutation', leaveChat: { __typename?: 'GenericSuccessObject', success: boolean } };

export type InvalidateChatInviteMutationVariables = Exact<{
  input: InvalidateInviteInput;
}>;


export type InvalidateChatInviteMutation = { __typename?: 'Mutation', invalidateChatInvite: { __typename?: 'GenericSuccessObject', success: boolean } };

export type DeleteMessageMutationVariables = Exact<{
  input: DeleteMessageInput;
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage: boolean };

export type DeleteChatRankMutationVariables = Exact<{
  input: DeleteRank;
}>;


export type DeleteChatRankMutation = { __typename?: 'Mutation', deleteChatRank: { __typename?: 'GenericSuccessObject', success: boolean } };

export type EditMessageMutationVariables = Exact<{
  input: EditMessageInput;
}>;


export type EditMessageMutation = { __typename?: 'Mutation', editMessage?: { __typename?: 'Message', id: number } | null };

export type EmbedResolutionPrecacheMutationVariables = Exact<{
  input: EmbedPrecacheInput;
}>;


export type EmbedResolutionPrecacheMutation = { __typename?: 'Mutation', embedResolutionPrecache?: (
    { __typename?: 'EmbedDataV2' }
    & { ' $fragmentRefs'?: { 'StandardEmbedFragment': StandardEmbedFragment } }
  ) | null };

export type ChatInviteQueryVariables = Exact<{
  input: InviteInput;
}>;


export type ChatInviteQuery = { __typename?: 'Query', chatInvite?: { __typename?: 'ChatInvite', id: string, userId?: number | null, chatId: number, rankId?: string | null, createdAt: any, updatedAt: any, expiredAt?: any | null, invalidated: boolean, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, chat: { __typename?: 'Chat', id: number, name: string, description?: string | null, background?: string | null, icon?: string | null, type: string, users: Array<{ __typename?: 'ChatAssociation', id: number }> }, rank?: { __typename?: 'ChatRank', id: string, color?: string | null, name: string } | null } | null };

export type GetInvitesForChatQueryVariables = Exact<{
  input: ChatInput;
}>;


export type GetInvitesForChatQuery = { __typename?: 'Query', chat: { __typename?: 'Chat', invites: Array<{ __typename?: 'ChatInvite', id: string, userId?: number | null, createdAt: any, rankId?: string | null, updatedAt: any, expiredAt?: any | null, invalidated: boolean }> } };

export type JoinChatFromInviteMutationVariables = Exact<{
  input: JoinChatFromInviteInput;
}>;


export type JoinChatFromInviteMutation = { __typename?: 'Mutation', joinChatFromInvite: { __typename?: 'ChatAssociation', id: number } };

export type CreateChatInviteMutationVariables = Exact<{
  input: CreateInviteInput;
}>;


export type CreateChatInviteMutation = { __typename?: 'Mutation', createChatInvite: { __typename?: 'ChatInvite', id: string, userId?: number | null, chatId: number, rankId?: string | null, createdAt: any, updatedAt: any, expiredAt?: any | null, invalidated: boolean } };

export type StandardEmbedFragment = { __typename?: 'EmbedDataV2', media?: Array<{ __typename?: 'EmbedMedia', url?: string | null, proxyUrl?: string | null, attachment?: string | null, width?: number | null, height?: number | null, isInternal: boolean, videoEmbedUrl?: string | null, mimeType?: string | null, type: EmbedMediaType, upload?: { __typename?: 'Upload', id: number, createdAt: any, attachment: string, userId: number, name?: string | null, type: string, fileSize: number } | null }> | null, text?: Array<{ __typename?: 'EmbedText', imageProxyUrl?: string | null, text: string, heading?: boolean | null, imageUrl?: string | null }> | null, metadata: { __typename?: 'EmbedMetadata', url?: string | null, siteName?: string | null, siteIcon?: string | null, footer?: string | null, type: EmbedType, id?: string | null, restricted?: boolean | null } } & { ' $fragmentName'?: 'StandardEmbedFragment' };

export type StandardMessageFragment = { __typename?: 'Message', id: number, createdAt: any, updatedAt: any, chatId: number, userId?: number | null, content?: string | null, type?: MessageType | null, edited: boolean, editedAt?: any | null, replyId?: number | null, pinned: boolean, emoji?: Array<{ __typename?: 'ChatEmoji', name?: string | null, icon?: string | null, id: string, chatId: number }> | null, embeds: Array<(
    { __typename?: 'EmbedDataV2' }
    & { ' $fragmentRefs'?: { 'StandardEmbedFragment': StandardEmbedFragment } }
  )>, reply?: { __typename?: 'Message', content?: string | null, userId?: number | null, id: number, readReceipts: Array<{ __typename?: 'ReadReceipt', associationId: number, messageId: number, user?: { __typename?: 'PartialUserBase', id: number, avatar?: string | null, username: string, legacy: boolean } | null }>, embeds: Array<{ __typename?: 'EmbedDataV2', metadata: { __typename?: 'EmbedMetadata', type: EmbedType }, media?: Array<{ __typename?: 'EmbedMedia', type: EmbedMediaType }> | null }>, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null, readReceipts: Array<{ __typename?: 'ReadReceipt', associationId: number, messageId: number, user?: { __typename?: 'PartialUserBase', id: number, avatar?: string | null, username: string, legacy: boolean } | null }> } & { ' $fragmentName'?: 'StandardMessageFragment' };

export type MessagesQueryVariables = Exact<{
  input: InfiniteMessagesInput;
}>;


export type MessagesQuery = { __typename?: 'Query', messages: Array<(
    { __typename?: 'Message' }
    & { ' $fragmentRefs'?: { 'StandardMessageFragment': StandardMessageFragment } }
  )> };

export type PagedMessagesQueryVariables = Exact<{
  input: PagedMessagesInput;
}>;


export type PagedMessagesQuery = { __typename?: 'Query', messagesPaged: { __typename?: 'PaginatedMessageResponse', items: Array<(
      { __typename?: 'Message' }
      & { ' $fragmentRefs'?: { 'StandardMessageFragment': StandardMessageFragment } }
    )>, pager: (
      { __typename?: 'Pager' }
      & { ' $fragmentRefs'?: { 'PagerFragment': PagerFragment } }
    ) } };

export type AvailableChatPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AvailableChatPermissionsQuery = { __typename?: 'Query', availableChatPermissions: Array<{ __typename?: 'ChatPermission', id: string, description: string, name: string, createdAt?: any | null, updatedAt?: any | null, group: RankPermissionGroup }> };

export type ReadChatMutationVariables = Exact<{
  input: ReadChatInput;
}>;


export type ReadChatMutation = { __typename?: 'Mutation', readChat: { __typename?: 'GenericSuccessObject', success: boolean } };

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'Message', id: number } };

export type OnDeleteMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteMessageSubscription = { __typename?: 'Subscription', onDeleteMessage: { __typename?: 'DeleteMessage', id: number, associationId: number } };

export type OnMessageEditSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnMessageEditSubscription = { __typename?: 'Subscription', onEditMessage: { __typename?: 'EditMessageEvent', associationId: number, message: { __typename?: 'Message', content?: string | null, userId?: number | null, pending: boolean, error: boolean, edited: boolean, id: number, pinned: boolean, editedAt?: any | null, embeds: Array<(
        { __typename?: 'EmbedDataV2' }
        & { ' $fragmentRefs'?: { 'StandardEmbedFragment': StandardEmbedFragment } }
      )>, emoji?: Array<{ __typename?: 'ChatEmoji', id: string, chatId: number, name?: string | null, icon?: string | null }> | null } } };

export type NewMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageSubscription = { __typename?: 'Subscription', onMessage: { __typename?: 'MessageSubscription', mention: boolean, associationId: number, message: (
      { __typename?: 'Message' }
      & { ' $fragmentRefs'?: { 'StandardMessageFragment': StandardMessageFragment } }
    ), chat: { __typename?: 'Chat', id: number, type: string, recipient?: { __typename?: 'PartialUserBase', id: number, username: string } | null } } };

export type OnReadChatSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnReadChatSubscription = { __typename?: 'Subscription', onReadChat: number };

export type OnReadReceiptSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnReadReceiptSubscription = { __typename?: 'Subscription', onReadReceipt: { __typename?: 'ReadReceipt', chatId: number, associationId: number, messageId: number, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null } };

export type TypingEventSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TypingEventSubscription = { __typename?: 'Subscription', onTyping: { __typename?: 'ChatTypingEvent', chatId: number, expires?: number | null, user: { __typename?: 'PartialUserFriend', id: number } } };

export type CancelTypingEventSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CancelTypingEventSubscription = { __typename?: 'Subscription', onCancelTyping: { __typename?: 'ChatTypingEvent', chatId: number, expires?: number | null, user: { __typename?: 'PartialUserFriend', id: number } } };

export type ToggleUserRankMutationVariables = Exact<{
  input: AddRank;
}>;


export type ToggleUserRankMutation = { __typename?: 'Mutation', toggleUserRank: { __typename?: 'GenericSuccessObject', success: boolean } };

export type TransferGroupOwnershipMutationVariables = Exact<{
  input: TransferOwnershipInput;
}>;


export type TransferGroupOwnershipMutation = { __typename?: 'Mutation', transferGroupOwnership: { __typename?: 'Chat', userId?: number | null } };

export type UpdateChatMutationVariables = Exact<{
  input: UpdateChatInput;
}>;


export type UpdateChatMutation = { __typename?: 'Mutation', updateChat: { __typename?: 'Chat', id: number } };

export type UpdateEmojiMutationVariables = Exact<{
  input: UpdateEmojiInput;
}>;


export type UpdateEmojiMutation = { __typename?: 'Mutation', updateEmoji: { __typename?: 'ChatEmoji', name?: string | null } };

export type UpdateChatRankMutationVariables = Exact<{
  input: UpdateRank;
}>;


export type UpdateChatRankMutation = { __typename?: 'Mutation', updateChatRank: { __typename?: 'ChatRank', id: string } };

export type UpdateChatRankOrderMutationVariables = Exact<{
  input: UpdateRankOrder;
}>;


export type UpdateChatRankOrderMutation = { __typename?: 'Mutation', updateChatRankOrder: Array<{ __typename?: 'ChatRank', id: string }> };

export type AddToCollectionMutationVariables = Exact<{
  input: AddToCollectionInput;
}>;


export type AddToCollectionMutation = { __typename?: 'Mutation', addToCollection: Array<{ __typename?: 'CollectionItem', id: number }> };

export type RemoveFromCollectionMutationVariables = Exact<{
  input: AddToCollectionInput;
}>;


export type RemoveFromCollectionMutation = { __typename?: 'Mutation', removeFromCollection: number };

export type UpdateCollectionUserPermissionsMutationVariables = Exact<{
  input: UpdateCollectionUserPermissionsInput;
}>;


export type UpdateCollectionUserPermissionsMutation = { __typename?: 'Mutation', updateCollectionUserPermissions: { __typename?: 'CollectionUser', id: number, recipientId?: number | null, read: boolean, write: boolean, configure: boolean } };

export type AddCollectionUserMutationVariables = Exact<{
  input: UpdateCollectionUserPermissionsInput;
}>;


export type AddCollectionUserMutation = { __typename?: 'Mutation', addCollectionUser: { __typename?: 'CollectionUser', id: number } };

export type RemoveCollectionUserMutationVariables = Exact<{
  input: RemoveCollectionUserInput;
}>;


export type RemoveCollectionUserMutation = { __typename?: 'Mutation', removeCollectionUser: { __typename?: 'GenericSuccessObject', success: boolean } };

export type CreateCollectionMutationVariables = Exact<{
  input: CreateCollectionInput;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'Collection', id: number } };

export type CollectionQueryVariables = Exact<{
  input: CollectionInput;
}>;


export type CollectionQuery = { __typename?: 'Query', collection?: { __typename?: 'Collection', id: number, name: string, banner?: string | null, avatar?: string | null, image?: string | null, userId: number, shareLink?: string | null, shared?: boolean | null, itemCount?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, preview?: { __typename?: 'CollectionItem', id: number, attachment: { __typename?: 'Upload', attachment: string, id: number } } | null, users: Array<{ __typename?: 'CollectionUser', id: number, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null, sender?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null } | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } } | null };

export type UserLightCollectionsQueryQueryVariables = Exact<{
  input: UserCollectionsInput;
}>;


export type UserLightCollectionsQueryQuery = { __typename?: 'Query', collections: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', id: number, name: string, avatar?: string | null, itemCount?: number | null, banner?: string | null, image?: string | null, updatedAt: any, createdAt: any, shareLink?: string | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean }, user?: { __typename?: 'PartialUserBase', username: string, id: number } | null, preview?: { __typename?: 'CollectionItem', createdAt: any, attachment: { __typename?: 'Upload', attachment: string, id: number } } | null }> } };

export type UserCollectionsQueryQueryVariables = Exact<{
  input: UserCollectionsInput;
}>;


export type UserCollectionsQueryQuery = { __typename?: 'Query', collections: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', id: number, name: string, image?: string | null, userId: number, banner?: string | null, avatar?: string | null, shareLink?: string | null, shared?: boolean | null, itemCount?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, preview?: { __typename?: 'CollectionItem', attachment: { __typename?: 'Upload', attachment: string, id: number } } | null, users: Array<{ __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null, identifier?: string | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, administrator: boolean, moderator: boolean, avatar?: string | null } | null, sender?: { __typename?: 'PartialUserBase', username: string, id: number, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, recipient?: { __typename?: 'CollectionUser', id: number, createdAt: any, updatedAt: any, collectionId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId?: number | null, senderId?: number | null } | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } }>, pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } } };

export type LeaveCollectionMutationVariables = Exact<{
  input: LeaveCollectionInput;
}>;


export type LeaveCollectionMutation = { __typename?: 'Mutation', leaveCollection: { __typename?: 'GenericSuccessObject', success: boolean } };

export type CollectionUpdatedSubscriptionVariables = Exact<{
  input?: InputMaybe<FilterCollectionInput>;
}>;


export type CollectionUpdatedSubscription = { __typename?: 'Subscription', onCollectionUpdated: { __typename?: 'Collection', id: number, name: string, banner?: string | null, avatar?: string | null, shareLink?: string | null, userId: number, itemCount?: number | null } };

export type CollectionUserAddedSubscriptionVariables = Exact<{
  input?: InputMaybe<FilterCollectionInput>;
}>;


export type CollectionUserAddedSubscription = { __typename?: 'Subscription', onCollectionUserAdded: { __typename?: 'CollectionUser', id: number } };

export type CollectionUserRemovedSubscriptionVariables = Exact<{
  input?: InputMaybe<FilterCollectionInput>;
}>;


export type CollectionUserRemovedSubscription = { __typename?: 'Subscription', onCollectionUserRemoved: { __typename?: 'CollectionUser', id: number } };

export type CollectionUserUpdatedSubscriptionVariables = Exact<{
  input?: InputMaybe<FilterCollectionInput>;
}>;


export type CollectionUserUpdatedSubscription = { __typename?: 'Subscription', onCollectionUserUpdated: { __typename?: 'CollectionUser', id: number } };

export type CollectionCreatedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CollectionCreatedSubscription = { __typename?: 'Subscription', onCollectionCreated: { __typename?: 'Collection', id: number, name: string, banner?: string | null, avatar?: string | null, shareLink?: string | null, userId: number, itemCount?: number | null, new?: boolean | null, permissionsMetadata: { __typename?: 'PermissionsMetadata', read: boolean, write: boolean, configure: boolean } } };

export type CollectionRemovedSubscriptionVariables = Exact<{
  input?: InputMaybe<FilterCollectionInput>;
}>;


export type CollectionRemovedSubscription = { __typename?: 'Subscription', onCollectionRemoved: number };

export type TransferCollectionOwnershipMutationVariables = Exact<{
  input: TransferCollectionOwnershipInput;
}>;


export type TransferCollectionOwnershipMutation = { __typename?: 'Mutation', transferCollectionOwnership: { __typename?: 'GenericSuccessObject', success: boolean } };

export type UpdateCollectionMutationVariables = Exact<{
  input: UpdateCollectionInput;
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection: { __typename?: 'Collection', shareLink?: string | null, name: string, id: number } };

export type GetExperimentsQueryVariables = Exact<{
  version?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetExperimentsQuery = { __typename?: 'Query', experiments: Array<{ __typename?: 'ExperimentType', id: string, value: number, description?: string | null, createdAt?: any | null, versions: Array<number> }> };

export type SetExperimentMutationVariables = Exact<{
  input: SetExperimentInput;
}>;


export type SetExperimentMutation = { __typename?: 'Mutation', setExperiment: { __typename?: 'Experiment', value: string, key: string } };

export type ExtraStateQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type ExtraStateQueryQuery = { __typename?: 'Query', friends: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId?: number | null, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, status: UserStatus } }>, experiments: Array<{ __typename?: 'ExperimentType', id: string, value: number, description?: string | null, createdAt?: any | null }>, workspaces: Array<{ __typename?: 'Workspace', id: number, name: string, userId?: number | null, createdAt: any, updatedAt: any, icon?: string | null, folders: Array<{ __typename?: 'WorkspaceFolder', id: number, createdAt: any, updatedAt: any, name: string, workspaceId: number, folderId?: number | null, children: Array<{ __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null }> }> }>, chats: Array<{ __typename?: 'Chat', id: number, description?: string | null, type: string, background?: string | null, unread?: number | null, name: string, userId?: number | null, icon?: string | null, createdAt: any, updatedAt: any, _redisSortDate?: string | null, invites: Array<{ __typename?: 'ChatInvite', id: string, userId?: number | null, createdAt: any, rankId?: string | null, updatedAt: any, expiredAt?: any | null, invalidated: boolean }>, association?: { __typename?: 'ChatAssociation', id: number, hidden?: boolean | null, chatId: number, permissions: Array<string>, userId?: number | null, rank: string, createdAt: any, lastRead?: number | null, notifications: string } | null, users: Array<{ __typename?: 'ChatAssociation', id: number, chatId: number, userId?: number | null, rank: string, createdAt: any, lastRead?: number | null, ranksMap: Array<string> }>, recipient?: { __typename?: 'PartialUserBase', id: number } | null, ranks: Array<{ __typename?: 'ChatRank', id: string, color?: string | null, name: string, userId?: number | null, createdAt?: any | null, chatId: number, updatedAt?: any | null, managed: boolean, index: number, permissionsMap: Array<string> }> }>, coreState: { __typename?: 'CoreState', name: string, release: string, hostname: string, hostnameWithProtocol: string, registrations: boolean, officialInstance: boolean, termsNoteId?: string | null, privacyNoteId?: string | null, inviteAFriend: boolean, preTrustedDomains: Array<string>, hostnames: Array<string>, _redis: string, server: string, finishedSetup: boolean, domain: string, uptime: number, uptimeSys: number, commitVersion: string, connection: { __typename?: 'Connection', ip: string }, announcements: Array<{ __typename?: 'Announcement', userId?: number | null, content: string, type?: string | null, id: number, createdAt?: any | null, updatedAt?: any | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, stats: { __typename?: 'CoreStats', users: number, announcements: number, usage?: any | null, collections: number, collectionItems: number, uploads: number, invites: number, inviteMilestone: number, pulse: number, pulses: number, docs: number, messages: number, chats: number, hours?: any | null, uploadGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, messageGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, pulseGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null }, maintenance: { __typename?: 'Maintenance', enabled: boolean, message?: string | null, statusPage?: string | null }, providers: { __typename?: 'Providers', anilist: boolean, lastfm: boolean, mal: boolean }, features: { __typename?: 'Features', communications: boolean, collections: boolean, autoCollects: boolean, workspaces: boolean, insights: boolean } }, collections: { __typename?: 'PaginatedCollectionResponse', items: Array<{ __typename?: 'Collection', id: number, name: string, permissionsMetadata: { __typename?: 'PermissionsMetadata', write: boolean, read: boolean, configure: boolean } }> }, currentUser?: { __typename?: 'User', username: string, email: string, pulse: boolean, groupPrivacy: UserGroupPrivacy, friendRequests: UserFriendRequestPrivacy, profileLayout?: any | null, description?: string | null, administrator: boolean, darkTheme: boolean, emailVerified: boolean, banned: boolean, createdAt: any, inviteId?: number | null, discordPrecache: boolean, avatar?: string | null, domainId: number, totpEnable: boolean, quota: number, moderator: boolean, subscriptionId?: number | null, itemsPerPage: number, banner?: string | null, pendingAutoCollects?: number | null, scopes?: string | null, status: UserStatus, storedStatus: UserStoredStatus, weatherUnit: string, themeEngine?: any | null, xp: number, publicProfile: boolean, privacyPolicyAccepted?: boolean | null, excludedCollections?: Array<number> | null, id: number, language: string, nameColor?: string | null, insights: UserInsights, alternatePasswords?: Array<{ __typename?: 'AlternatePassword', scopes: string, totp: boolean, name: string }> | null, plan?: { __typename?: 'Plan', quotaMax: number, color?: string | null, internalName: string, name: string, icon: string, id: number } | null, domain?: { __typename?: 'Domain', active: boolean, domain: string, id: number } | null, badges: Array<{ __typename?: 'Badge', color?: string | null, icon?: string | null, id: number, image?: string | null, name: string, priority?: number | null, tooltip?: string | null }>, subscription?: { __typename?: 'TPUSubscription', cancelled: boolean, metadata?: { __typename?: 'SubscriptionMetadata', hours: number } | null } | null, notifications: Array<{ __typename?: 'Notification', id: number, dismissed: boolean, message: string, route?: string | null, createdAt: any }>, integrations: Array<{ __typename?: 'Integration', type: string, providerUsername?: string | null, providerUserId?: number | null, id: number, error?: string | null, expiresAt?: any | null }> } | null, trackedUsers: Array<{ __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, blocked?: boolean | null, status: UserStatus, nameColor?: string | null, bot: boolean, nickname?: { __typename?: 'FriendNickname', nickname: string } | null }>, blockedUsers: Array<{ __typename?: 'BlockedUser', id: string, userId?: number | null, createdAt: any, updatedAt: any, blockedUserId: number, silent: boolean }>, userEmoji: Array<{ __typename?: 'ChatEmoji', id: string, userId?: number | null, chatId: number, icon?: string | null, name?: string | null, createdAt: any, updatedAt: any }> };

export type CoreStateQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type CoreStateQueryQuery = { __typename?: 'Query', experiments: Array<{ __typename?: 'ExperimentType', id: string, value: number, description?: string | null, createdAt?: any | null, versions: Array<number> }>, coreState: { __typename?: 'CoreState', name: string, release: string, hostname: string, hostnameWithProtocol: string, registrations: boolean, officialInstance: boolean, termsNoteId?: string | null, privacyNoteId?: string | null, inviteAFriend: boolean, preTrustedDomains: Array<string>, hostnames: Array<string>, _redis: string, server: string, finishedSetup: boolean, domain: string, uptime: number, uptimeSys: number, commitVersion: string, connection: { __typename?: 'Connection', ip: string }, announcements: Array<{ __typename?: 'Announcement', userId?: number | null, content: string, type?: string | null, id: number, createdAt?: any | null, updatedAt?: any | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }>, stats: { __typename?: 'CoreStats', users: number, announcements: number, usage?: any | null, collections: number, collectionItems: number, uploads: number, invites: number, inviteMilestone: number, pulse: number, pulses: number, docs: number, messages: number, chats: number, hours?: any | null, uploadGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, messageGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, pulseGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null }, maintenance: { __typename?: 'Maintenance', enabled: boolean, message?: string | null, statusPage?: string | null }, providers: { __typename?: 'Providers', anilist: boolean, lastfm: boolean, mal: boolean }, features: { __typename?: 'Features', communications: boolean, collections: boolean, autoCollects: boolean, workspaces: boolean, insights: boolean } } };

export type WeatherQueryVariables = Exact<{ [key: string]: never; }>;


export type WeatherQuery = { __typename?: 'Query', weather: { __typename?: 'Weather', temp?: number | null, feels_like?: number | null, temp_min?: number | null, temp_max?: number | null, pressure?: number | null, humidity?: number | null, wind_speed?: number | null, wind_deg?: number | null, clouds?: number | null, visibility?: number | null, error?: boolean | null, cached?: boolean | null, icon?: string | null, main?: string | null, location?: string | null } };

export type OauthAppConsentQueryVariables = Exact<{
  input: MyAppInput;
}>;


export type OauthAppConsentQuery = { __typename?: 'Query', availableChatPermissions: Array<{ __typename?: 'ChatPermission', id: string, description: string, name: string, createdAt?: any | null, updatedAt?: any | null, group: RankPermissionGroup }>, oauthAppConsent: { __typename?: 'OauthConsentApp', id: string, name: string, icon?: string | null, shortCode?: string | null, verified: boolean, redirectUri?: string | null, description?: string | null, scopes: string, userId: number, botId?: number | null, private: boolean, token?: string | null, bot?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, avatar?: string | null, bot: boolean } | null } };

export type AddBotToChatMutationVariables = Exact<{
  input: AddBotToChatInput;
}>;


export type AddBotToChatMutation = { __typename?: 'Mutation', addBotToChat: { __typename?: 'ChatAssociation', id: number } };

export type OauthAppAuthorizeMutationVariables = Exact<{
  input: AuthorizeAppInput;
}>;


export type OauthAppAuthorizeMutation = { __typename?: 'Mutation', oauthAppAuthorize: { __typename?: 'AuthorizeAppResponse', token?: string | null } };

export type OauthAppDeauthorizeMutationVariables = Exact<{
  input: MyAppInput;
}>;


export type OauthAppDeauthorizeMutation = { __typename?: 'Mutation', oauthAppDeauthorize: { __typename?: 'GenericSuccessObject', success: boolean } };

export type CreateOauthAppMutationVariables = Exact<{
  input: CreateAppInput;
}>;


export type CreateOauthAppMutation = { __typename?: 'Mutation', createOauthApp: { __typename?: 'OauthApp', id: string } };

export type CreateBotOauthAppMutationVariables = Exact<{
  input: CreateBotInput;
}>;


export type CreateBotOauthAppMutation = { __typename?: 'Mutation', createBotOauthApp: { __typename?: 'PartialUserBase', id: number } };

export type LookupBotPrefixQueryVariables = Exact<{
  input: LookupPrefixInput;
}>;


export type LookupBotPrefixQuery = { __typename?: 'Query', lookupBotPrefix: { __typename?: 'Prefix', prefix: string, commands: Array<{ __typename?: 'LookupPrefix', command: string, description: string, botId: number }> } };

export type DevAppsQueryVariables = Exact<{ [key: string]: never; }>;


export type DevAppsQuery = { __typename?: 'Query', oauthApps: Array<{ __typename?: 'OauthApp', id: string, name: string, icon?: string | null, shortCode?: string | null, verified: boolean, redirectUri?: string | null, secret?: string | null, description?: string | null, scopes: string, userId: number, private: boolean, user?: { __typename?: 'PartialUserBase', username: string } | null }> };

export type DevAppQueryVariables = Exact<{
  input: MyAppInput;
}>;


export type DevAppQuery = { __typename?: 'Query', oauthApp: { __typename?: 'OauthApp', id: string, name: string, icon?: string | null, shortCode?: string | null, verified: boolean, redirectUri?: string | null, secret?: string | null, description?: string | null, scopes: string, userId: number, private: boolean, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, bot: boolean } | null, oauthUsers: Array<{ __typename?: 'OauthUser', id: string, userId: number, oauthAppId: string, manage: boolean, active: boolean, createdAt: any, user?: { __typename?: 'PartialUserBase', username: string, id: number } | null }>, bot?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, avatar?: string | null, bot: boolean } | null } };

export type AddOauthUserMutationVariables = Exact<{
  input: AddAppUserInput;
}>;


export type AddOauthUserMutation = { __typename?: 'Mutation', addOauthUser: { __typename?: 'OauthUser', id: string } };

export type UpdateOauthAppMutationVariables = Exact<{
  input: UpdateAppInput;
}>;


export type UpdateOauthAppMutation = { __typename?: 'Mutation', updateOauthApp: { __typename?: 'GenericSuccessObject', success: boolean } };

export type DeleteOauthAppMutationVariables = Exact<{
  input: MyAppInput;
}>;


export type DeleteOauthAppMutation = { __typename?: 'Mutation', deleteOauthApp: { __typename?: 'GenericSuccessObject', success: boolean } };

export type ResetOauthSecretMutationVariables = Exact<{
  input: MyAppInput;
}>;


export type ResetOauthSecretMutation = { __typename?: 'Mutation', resetOauthSecret: { __typename?: 'GenericSuccessObject', success: boolean } };

export type UpdateOauthUserMutationVariables = Exact<{
  input: UpdateAppUserInput;
}>;


export type UpdateOauthUserMutation = { __typename?: 'Mutation', updateOauthUser: { __typename?: 'OauthUser', id: string } };

export type DomainsQueryVariables = Exact<{ [key: string]: never; }>;


export type DomainsQuery = { __typename?: 'Query', domains: Array<{ __typename?: 'Domain', domain: string, id: number, userId?: number | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null }> };

export type PagerFragment = { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number, pages: Array<number> } & { ' $fragmentName'?: 'PagerFragment' };

export type AddFriendMutationVariables = Exact<{
  input: AddFriendInput;
}>;


export type AddFriendMutation = { __typename?: 'Mutation', friend: boolean };

export type GalleryQueryVariables = Exact<{
  input: GalleryInput;
}>;


export type GalleryQuery = { __typename?: 'Query', gallery: { __typename?: 'PaginatedUploadResponse', pager: { __typename?: 'Pager', totalItems: number, currentPage: number, pageSize: number, totalPages: number, startPage: number, endPage: number, startIndex: number, endIndex: number }, items: Array<{ __typename?: 'Upload', id: number, createdAt: any, updatedAt: any, attachment: string, userId: number, name?: string | null, originalFilename?: string | null, type: string, fileSize: number, deletable: boolean, textMetadata?: string | null, autoCollectApproval?: { __typename?: 'AutoCollectApproval', id: number, autoCollectRuleId: number } | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null, collections: Array<{ __typename?: 'Collection', id: number, name: string }>, item?: { __typename?: 'CollectionItem', id: number, pinned: boolean, collectionId: number } | null, starred?: { __typename?: 'Star', id: number, userId: number, attachmentId: number } | null }> } };

export type DeleteUploadsMutationVariables = Exact<{
  input: DeleteUploadInput;
}>;


export type DeleteUploadsMutation = { __typename?: 'Mutation', deleteUploads: { __typename?: 'GenericSuccessObject', success: boolean } };

export type UpdateUploadMutationVariables = Exact<{
  input: UpdateUploadInput;
}>;


export type UpdateUploadMutation = { __typename?: 'Mutation', updateUpload: { __typename?: 'Upload', id: number } };

export type CreateUploadsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type CreateUploadsSubscription = { __typename?: 'Subscription', onCreateUpload: { __typename?: 'CreateUploadEvent', upload: { __typename?: 'Upload', id: number, createdAt: any, updatedAt: any, attachment: string, userId: number, name?: string | null, originalFilename?: string | null, type: string, fileSize: number, deletable: boolean, textMetadata?: string | null, user?: { __typename?: 'PartialUserBase', username: string, id: number } | null, item?: { __typename?: 'CollectionItem', id: number } | null, collections: Array<{ __typename?: 'Collection', name: string, id: number }>, starred?: { __typename?: 'Star', id: number } | null } } };

export type OnUpdateUploadsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateUploadsSubscription = { __typename?: 'Subscription', onUpdateUploads: Array<{ __typename?: 'Upload', id: number, createdAt: any, updatedAt: any, attachment: string, userId: number, name?: string | null, originalFilename?: string | null, type: string, fileSize: number, deletable: boolean, textMetadata?: string | null, collections: Array<{ __typename?: 'Collection', id: number, name: string }>, starred?: { __typename?: 'Star', id: number } | null }> };

export type MailStateQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type MailStateQueryQuery = { __typename?: 'Query', unreadMail: number, mailboxes: Array<{ __typename?: 'ListResponse', path: string, name: string, delimiter: string, flags: Array<string>, specialUse?: string | null, listed: boolean, subscribed?: boolean | null }> };

export type UnreadMailQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadMailQuery = { __typename?: 'Query', unreadMail: number };

export type CreatePulseMutationVariables = Exact<{
  input: PulseInput;
}>;


export type CreatePulseMutation = { __typename?: 'Mutation', createPulse: string };

export type CreateSinglePulseMutationVariables = Exact<{
  input: SinglePulseInput;
}>;


export type CreateSinglePulseMutation = { __typename?: 'Mutation', createSinglePulse: string };

export type UpdatePulseMutationVariables = Exact<{
  input: PulseUpdateInput;
}>;


export type UpdatePulseMutation = { __typename?: 'Mutation', updatePulse: string };

export type BlockUserMutationVariables = Exact<{
  input: BlockUserInput;
}>;


export type BlockUserMutation = { __typename?: 'Mutation', blockUser: { __typename?: 'GenericSuccessObject', success: boolean } };

export type ChangeUsernameMutationVariables = Exact<{
  input: ChangeUsernameInput;
}>;


export type ChangeUsernameMutation = { __typename?: 'Mutation', changeUsername: boolean };

export type ChangeUserPasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangeUserPasswordMutation = { __typename?: 'Mutation', changeUserPassword: boolean };

export type ChangeUserEmailMutationVariables = Exact<{
  input: ChangeEmailInput;
}>;


export type ChangeUserEmailMutation = { __typename?: 'Mutation', changeUserEmail: boolean };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', Troplo?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, goose?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, bytedefined?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, electrics01?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, Jolt707?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, Avinera?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null, Spy?: { __typename?: 'PartialUserPublic', username: string, id: number, avatar?: string | null, banner?: string | null } | null };

export type DeleteAccountMutationVariables = Exact<{
  input: DangerZoneInput;
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type DeleteGalleryMutationVariables = Exact<{
  input: DangerZoneInput;
}>;


export type DeleteGalleryMutation = { __typename?: 'Mutation', deleteGallery: boolean };

export type FriendsQueryVariables = Exact<{ [key: string]: never; }>;


export type FriendsQuery = { __typename?: 'Query', friends: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId?: number | null, createdAt: any, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, status: UserStatus } }>, trackedUsers: Array<{ __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, blocked?: boolean | null, status: UserStatus, nameColor?: string | null, bot: boolean, nickname?: { __typename?: 'FriendNickname', nickname: string } | null }>, blockedUsers: Array<{ __typename?: 'BlockedUser', id: string, userId?: number | null, createdAt: any, updatedAt: any, blockedUserId: number, silent: boolean, blockedUser?: { __typename?: 'PartialUserBase', id: number, avatar?: string | null, username: string } | null }> };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type UserQueryVariables = Exact<{
  input: UserProfileInput;
}>;


export type UserQuery = { __typename?: 'Query', user?: { __typename?: 'PartialUserPublic', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null, bot: boolean, banned: boolean, banner?: string | null, description?: string | null, friend?: FriendStatus | null, insights: UserInsights, publicProfile: boolean, quota: number, xp?: number | null, themeEngine?: any | null, badges: Array<{ __typename?: 'Badge', id: number, name: string, description?: string | null, tooltip?: string | null, image?: string | null, icon?: string | null, color?: string | null, unlocked: boolean, priority?: number | null }>, friends?: Array<{ __typename?: 'Friend', id: number, status: FriendStatus, userId?: number | null, friendId: number, user: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null }, otherUser: { __typename?: 'PartialUserFriend', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } }> | null, plan: { __typename?: 'Plan', id: number, name: string, quotaMax: number, price: number, features?: string | null, color?: string | null, internalName: string, purchasable: boolean, internalFeatures?: string | null, icon: string }, platforms?: Array<{ __typename?: 'Platform', platform: PlatformType, id: string, lastSeen: string, status: UserStatus }> | null, profileLayout?: { __typename?: 'ProfileLayout', version: number, layout: { __typename?: 'ProfileLayoutObject', columns: Array<{ __typename?: 'ProfileLayoutColumn', rows: Array<{ __typename?: 'ProfileLayoutComponent', name: string, id: string, props?: { __typename?: 'ProfileLayoutProps', height?: number | null, friendsOnly?: boolean | null, display?: number | null, type?: string | null, links?: Array<{ __typename?: 'ProfileLayoutPropLink', name: string, url: string, color: string }> | null, children?: Array<{ __typename?: 'ProfileLayoutComponent', name: string, id: string, props?: { __typename?: 'ProfileLayoutProps', height?: number | null, friendsOnly?: boolean | null, display?: number | null, type?: string | null, links?: Array<{ __typename?: 'ProfileLayoutPropLink', name: string, url: string, color: string }> | null } | null }> | null } | null }> }> }, config: { __typename?: 'ProfileLayoutConfig', containerMargin?: number | null, showStatsSidebar: boolean } } | null, stats?: { __typename?: 'Stats', hours?: any | null, messages: number, usage?: any | null, collections: number, collectionItems: number, uploads: number, pulse: number, pulses: number, docs: number, uploadGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, messageGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null, pulseGraph?: { __typename?: 'DataLabelsGraph', data: Array<number>, labels: Array<string> } | null } | null, mutualCollections: Array<{ __typename?: 'Collection', id: number, shareLink?: string | null, avatar?: string | null, itemCount?: number | null, image?: string | null, name: string, banner?: string | null }> } | null };

export type SessionsQueryVariables = Exact<{
  input?: InputMaybe<SessionInput>;
}>;


export type SessionsQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', sessions: Array<{ __typename?: 'Session', id: number, type: SessionType, createdAt?: any | null, updatedAt?: any | null, scopes: string, token?: string | null, name?: string | null, info?: { __typename?: 'SessionInfo', accessedFrom: Array<{ __typename?: 'AccessedFrom', ip: string, userAgent?: string | null, isp?: string | null, location?: string | null, date: string, asn?: number | null }> } | null }> } | null };

export type UserStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type UserStatusSubscription = { __typename?: 'Subscription', onUserStatus: { __typename?: 'StatusEvent', id: number, status: UserStatus, platforms?: Array<{ __typename?: 'Platform', platform: PlatformType, id: string, lastSeen: string, status: UserStatus }> | null } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: boolean };

export type UpdateStatusMutationVariables = Exact<{
  input: UpdateUserStatusInput;
}>;


export type UpdateStatusMutation = { __typename?: 'Mutation', updateStatus?: UserStoredStatus | null };

export type GetUserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQueryQuery = { __typename?: 'Query', currentUser?: { __typename?: 'User', username: string, email: string, pulse: boolean, groupPrivacy: UserGroupPrivacy, friendRequests: UserFriendRequestPrivacy, profileLayout?: any | null, description?: string | null, administrator: boolean, darkTheme: boolean, emailVerified: boolean, banned: boolean, createdAt: any, inviteId?: number | null, discordPrecache: boolean, avatar?: string | null, domainId: number, totpEnable: boolean, quota: number, moderator: boolean, subscriptionId?: number | null, itemsPerPage: number, banner?: string | null, pendingAutoCollects?: number | null, scopes?: string | null, status: UserStatus, storedStatus: UserStoredStatus, weatherUnit: string, themeEngine?: any | null, xp: number, publicProfile: boolean, privacyPolicyAccepted?: boolean | null, dateOfBirth?: any | null, canAccessRestrictedContent: boolean, forceAgeVerification: boolean, excludedCollections?: Array<number> | null, id: number, language: string, nameColor?: string | null, insights: UserInsights, alternatePasswords?: Array<{ __typename?: 'AlternatePassword', scopes: string, totp: boolean, name: string }> | null, plan?: { __typename?: 'Plan', quotaMax: number, color?: string | null, internalName: string, name: string, icon: string, id: number } | null, domain?: { __typename?: 'Domain', active: boolean, domain: string, id: number } | null, badges: Array<{ __typename?: 'Badge', color?: string | null, icon?: string | null, id: number, image?: string | null, name: string, priority?: number | null, tooltip?: string | null }>, subscription?: { __typename?: 'TPUSubscription', expiredAt?: any | null, cancelledAt?: any | null, createdAt: any, price?: number | null, cancelled: boolean, metadata?: { __typename?: 'SubscriptionMetadata', hours: number } | null } | null, notifications: Array<{ __typename?: 'Notification', id: number, dismissed: boolean, message: string, route?: string | null, createdAt: any }>, integrations: Array<{ __typename?: 'Integration', type: string, providerUsername?: string | null, providerUserId?: number | null, id: number, error?: string | null, expiresAt?: any | null }> } | null };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: boolean };

export type SendVerificationEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type SendVerificationEmailMutation = { __typename?: 'Mutation', resendVerificationEmail: boolean };

export type CreateWorkspaceFolderMutationVariables = Exact<{
  input: CreateWorkspaceFolderInput;
}>;


export type CreateWorkspaceFolderMutation = { __typename?: 'Mutation', createWorkspaceFolder: { __typename?: 'WorkspaceFolder', id: number, name: string } };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null, versions: Array<{ __typename?: 'NoteVersion', id: string, noteId: number, userId?: number | null }>, permissions?: { __typename?: 'NotePermissionsMetadata', modify: boolean, read: boolean, configure: boolean } | null } };

export type CreateWorkspaceMutationVariables = Exact<{
  input: Scalars['String']['input'];
}>;


export type CreateWorkspaceMutation = { __typename?: 'Mutation', createWorkspace: { __typename?: 'Workspace', id: number, name: string, userId?: number | null, createdAt: any, updatedAt: any, icon?: string | null, user?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null, folders: Array<{ __typename?: 'WorkspaceFolder', id: number, createdAt: any, updatedAt: any, name: string, workspaceId: number, folderId?: number | null, children: Array<{ __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null, metadata?: { __typename?: 'WorkspaceNoteMetadata', version?: string | null } | null, versions: Array<{ __typename?: 'NoteVersion', id: string, noteId: number, userId?: number | null }>, permissions?: { __typename?: 'NotePermissionsMetadata', modify: boolean, read: boolean, configure: boolean } | null }>, workspace: { __typename?: 'Workspace', id: number, name: string, userId?: number | null, createdAt: any, updatedAt: any, icon?: string | null } }>, users: Array<{ __typename?: 'WorkspaceUser', id: number, createdAt: any, updatedAt: any, workspaceId: number, read: boolean, write: boolean, configure: boolean, accepted: boolean, recipientId: number, senderId: number, identifier?: string | null, sender?: { __typename?: 'PartialUserBase', username: string, id: number, createdAt: any, administrator: boolean, moderator: boolean, avatar?: string | null } | null }> } };

export type NoteQueryVariables = Exact<{
  input: NoteInput;
}>;


export type NoteQuery = { __typename?: 'Query', note?: { __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null, permissions?: { __typename?: 'NotePermissionsMetadata', modify: boolean, read: boolean, configure: boolean } | null, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null, versions: Array<{ __typename?: 'NoteVersion', id: string, noteId: number, userId?: number | null, createdAt: any, data?: { __typename?: 'WorkspaceNote', version?: string | null, blocks?: any | null, time?: number | null } | null }> } | null };

export type SaveNoteMutationVariables = Exact<{
  input: SaveNoteInput;
}>;


export type SaveNoteMutation = { __typename?: 'Mutation', saveNote: { __typename?: 'Note', id: number, name: string, workspaceFolderId: number } };

export type SaveNoteBlockMutationVariables = Exact<{
  input: UpdateNoteEventInput;
}>;


export type SaveNoteBlockMutation = { __typename?: 'Mutation', saveNoteBlock: boolean };

export type ToggleNoteShareMutationVariables = Exact<{
  input: Scalars['Int']['input'];
}>;


export type ToggleNoteShareMutation = { __typename?: 'Mutation', toggleNoteShare: { __typename?: 'Note', shareLink?: string | null } };

export type AddWorkspaceUserMutationVariables = Exact<{
  input: WorkspaceUserInput;
}>;


export type AddWorkspaceUserMutation = { __typename?: 'Mutation', addWorkspaceUser: { __typename?: 'WorkspaceUser', id: number } };

export type WorkspacesQueryVariables = Exact<{ [key: string]: never; }>;


export type WorkspacesQuery = { __typename?: 'Query', workspaces: Array<{ __typename?: 'Workspace', id: number, name: string, userId?: number | null, createdAt: any, updatedAt: any, icon?: string | null, users: Array<{ __typename?: 'WorkspaceUser', id: number, read: boolean, write: boolean, configure: boolean, user?: { __typename?: 'PartialUserBase', username: string, id: number, avatar?: string | null } | null }>, folders: Array<{ __typename?: 'WorkspaceFolder', id: number, createdAt: any, updatedAt: any, name: string, workspaceId: number, folderId?: number | null, children: Array<{ __typename?: 'Note', id: number, createdAt: any, updatedAt: any, name: string, workspaceFolderId: number, shareLink?: string | null }> }> }> };

export const StandardEmbedFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardEmbed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmbedDataV2"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"proxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"isInternal"}},{"kind":"Field","name":{"kind":"Name","value":"videoEmbedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageProxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"siteIcon"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restricted"}}]}}]}}]} as unknown as DocumentNode<StandardEmbedFragment, unknown>;
export const StandardMessageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardEmbed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardEmbed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmbedDataV2"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"proxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"isInternal"}},{"kind":"Field","name":{"kind":"Name","value":"videoEmbedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageProxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"siteIcon"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restricted"}}]}}]}}]} as unknown as DocumentNode<StandardMessageFragment, unknown>;
export const PagerFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pager"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pager"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]} as unknown as DocumentNode<PagerFragment, unknown>;
export const AdminClearCacheDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AdminClearCache"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ClearCacheInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminClearCache"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AdminClearCacheMutation, AdminClearCacheMutationVariables>;
export const AdminGetPlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AdminGetPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"adminPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"features"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"purchasable"}},{"kind":"Field","name":{"kind":"Name","value":"internalFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}}]} as unknown as DocumentNode<AdminGetPlansQuery, AdminGetPlansQueryVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Register"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RegisterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"register"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterMutation, RegisterMutationVariables>;
export const ActOnAutoCollectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActOnAutoCollects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ActOnAutoCollectsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"actOnAutoCollects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ActOnAutoCollectsMutation, ActOnAutoCollectsMutationVariables>;
export const AutoCollectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AutoCollects"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCollectionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoCollects"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollectApprovals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"originalFilename"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"textMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"starred"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollectRuleId"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollectRule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]}}]}}]} as unknown as DocumentNode<AutoCollectsQuery, AutoCollectsQueryVariables>;
export const AutoCollectRulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AutoCollectRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoCollectRules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}}]}}]}}]} as unknown as DocumentNode<AutoCollectRulesQuery, AutoCollectRulesQueryVariables>;
export const AutoCollectRuleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AutoCollectRule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AutoCollectRuleQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoCollectRule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"requireApproval"}},{"kind":"Field","name":{"kind":"Name","value":"rules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"rules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"operator"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AutoCollectRuleQuery, AutoCollectRuleQueryVariables>;
export const AddChatUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChatUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddChatUser"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChatUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<AddChatUsersMutation, AddChatUsersMutationVariables>;
export const ChatAuditLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatAuditLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuditLogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatAuditLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"category"}},{"kind":"Field","name":{"kind":"Name","value":"actionType"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]}}]}}]} as unknown as DocumentNode<ChatAuditLogQuery, ChatAuditLogQueryVariables>;
export const ChatsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatsQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userEmoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"_redisSortDate"}},{"kind":"Field","name":{"kind":"Name","value":"usersCount"}},{"kind":"Field","name":{"kind":"Name","value":"onlineCount"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}}]}}]}}]}}]} as unknown as DocumentNode<ChatsQueryQuery, ChatsQueryQueryVariables>;
export const ChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Chat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"ranksMap"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ranks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMap"}}]}},{"kind":"Field","name":{"kind":"Name","value":"invites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}}]}}]}}]}}]} as unknown as DocumentNode<ChatQuery, ChatQueryVariables>;
export const ChatsQueryOldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatsQueryOld"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userEmoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"invites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"ranksMap"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_redisSortDate"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ranks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMap"}}]}}]}}]}}]} as unknown as DocumentNode<ChatsQueryOldQuery, ChatsQueryOldQueryVariables>;
export const GetChatUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetChatUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetChatUsersQuery, GetChatUsersQueryVariables>;
export const CreateChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateChatMutation, CreateChatMutationVariables>;
export const AddChatRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddChatRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addChatRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddChatRankMutation, AddChatRankMutationVariables>;
export const DeleteEmojiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteEmoji"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteEmojiInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteEmoji"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteEmojiMutation, DeleteEmojiMutationVariables>;
export const DeleteGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DangerZoneChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const LeaveChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LeaveChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LeaveChatMutation, LeaveChatMutationVariables>;
export const InvalidateChatInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InvalidateChatInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InvalidateInviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invalidateChatInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<InvalidateChatInviteMutation, InvalidateChatInviteMutationVariables>;
export const DeleteMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const DeleteChatRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteChatRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteChatRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteChatRankMutation, DeleteChatRankMutationVariables>;
export const EditMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EditMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EditMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<EditMessageMutation, EditMessageMutationVariables>;
export const EmbedResolutionPrecacheDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EmbedResolutionPrecache"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmbedPrecacheInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"embedResolutionPrecache"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardEmbed"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardEmbed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmbedDataV2"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"proxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"isInternal"}},{"kind":"Field","name":{"kind":"Name","value":"videoEmbedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageProxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"siteIcon"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restricted"}}]}}]}}]} as unknown as DocumentNode<EmbedResolutionPrecacheMutation, EmbedResolutionPrecacheMutationVariables>;
export const ChatInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ChatInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"chat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"rank"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ChatInviteQuery, ChatInviteQueryVariables>;
export const GetInvitesForChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetInvitesForChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}}]}}]}}]}}]} as unknown as DocumentNode<GetInvitesForChatQuery, GetInvitesForChatQueryVariables>;
export const JoinChatFromInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"JoinChatFromInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JoinChatFromInviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"joinChatFromInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<JoinChatFromInviteMutation, JoinChatFromInviteMutationVariables>;
export const CreateChatInviteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateChatInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInviteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createChatInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}}]}}]}}]} as unknown as DocumentNode<CreateChatInviteMutation, CreateChatInviteMutationVariables>;
export const MessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Messages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InfiniteMessagesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messages"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardMessage"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardEmbed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmbedDataV2"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"proxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"isInternal"}},{"kind":"Field","name":{"kind":"Name","value":"videoEmbedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageProxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"siteIcon"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restricted"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardEmbed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}}]}}]} as unknown as DocumentNode<MessagesQuery, MessagesQueryVariables>;
export const PagedMessagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"PagedMessages"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PagedMessagesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messagesPaged"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardMessage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Pager"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardEmbed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmbedDataV2"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"proxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"isInternal"}},{"kind":"Field","name":{"kind":"Name","value":"videoEmbedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageProxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"siteIcon"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restricted"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardEmbed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Pager"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pager"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]} as unknown as DocumentNode<PagedMessagesQuery, PagedMessagesQueryVariables>;
export const AvailableChatPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AvailableChatPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableChatPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"group"}}]}}]}}]} as unknown as DocumentNode<AvailableChatPermissionsQuery, AvailableChatPermissionsQueryVariables>;
export const ReadChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReadChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ReadChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ReadChatMutation, ReadChatMutationVariables>;
export const SendMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SendMessageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SendMessageMutation, SendMessageMutationVariables>;
export const OnDeleteMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnDeleteMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onDeleteMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"associationId"}}]}}]}}]} as unknown as DocumentNode<OnDeleteMessageSubscription, OnDeleteMessageSubscriptionVariables>;
export const OnMessageEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnMessageEdit"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onEditMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"pending"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardEmbed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"associationId"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardEmbed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmbedDataV2"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"proxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"isInternal"}},{"kind":"Field","name":{"kind":"Name","value":"videoEmbedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageProxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"siteIcon"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restricted"}}]}}]}}]} as unknown as DocumentNode<OnMessageEditSubscription, OnMessageEditSubscriptionVariables>;
export const NewMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"NewMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onMessage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"mention"}},{"kind":"Field","name":{"kind":"Name","value":"message"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardMessage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"chat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardEmbed"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EmbedDataV2"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"proxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"isInternal"}},{"kind":"Field","name":{"kind":"Name","value":"videoEmbedUrl"}},{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mimeType"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"text"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageProxyUrl"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"heading"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"siteName"}},{"kind":"Field","name":{"kind":"Name","value":"siteIcon"}},{"kind":"Field","name":{"kind":"Name","value":"footer"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"restricted"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"StandardMessage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"emoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"StandardEmbed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"reply"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"embeds"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"edited"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"replyId"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"readReceipts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"legacy"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}}]}}]}}]} as unknown as DocumentNode<NewMessageSubscription, NewMessageSubscriptionVariables>;
export const OnReadChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnReadChat"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onReadChat"}}]}}]} as unknown as DocumentNode<OnReadChatSubscription, OnReadChatSubscriptionVariables>;
export const OnReadReceiptDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnReadReceipt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onReadReceipt"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"associationId"}},{"kind":"Field","name":{"kind":"Name","value":"messageId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<OnReadReceiptSubscription, OnReadReceiptSubscriptionVariables>;
export const TypingEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"TypingEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onTyping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"expires"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<TypingEventSubscription, TypingEventSubscriptionVariables>;
export const CancelTypingEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CancelTypingEvent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCancelTyping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"expires"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CancelTypingEventSubscription, CancelTypingEventSubscriptionVariables>;
export const ToggleUserRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleUserRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleUserRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ToggleUserRankMutation, ToggleUserRankMutationVariables>;
export const TransferGroupOwnershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransferGroupOwnership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransferOwnershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferGroupOwnership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}}]}}]} as unknown as DocumentNode<TransferGroupOwnershipMutation, TransferGroupOwnershipMutationVariables>;
export const UpdateChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateChatMutation, UpdateChatMutationVariables>;
export const UpdateEmojiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateEmoji"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateEmojiInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateEmoji"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateEmojiMutation, UpdateEmojiMutationVariables>;
export const UpdateChatRankDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChatRank"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRank"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChatRank"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateChatRankMutation, UpdateChatRankMutationVariables>;
export const UpdateChatRankOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateChatRankOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateRankOrder"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateChatRankOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateChatRankOrderMutation, UpdateChatRankOrderMutationVariables>;
export const AddToCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddToCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddToCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addToCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddToCollectionMutation, AddToCollectionMutationVariables>;
export const RemoveFromCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveFromCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddToCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeFromCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<RemoveFromCollectionMutation, RemoveFromCollectionMutationVariables>;
export const UpdateCollectionUserPermissionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCollectionUserPermissions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCollectionUserPermissionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCollectionUserPermissions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}}]} as unknown as DocumentNode<UpdateCollectionUserPermissionsMutation, UpdateCollectionUserPermissionsMutationVariables>;
export const AddCollectionUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCollectionUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCollectionUserPermissionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCollectionUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddCollectionUserMutation, AddCollectionUserMutationVariables>;
export const RemoveCollectionUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCollectionUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveCollectionUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCollectionUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<RemoveCollectionUserMutation, RemoveCollectionUserMutationVariables>;
export const CreateCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateCollectionMutation, CreateCollectionMutationVariables>;
export const CollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Collection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionQuery, CollectionQueryVariables>;
export const UserLightCollectionsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserLightCollectionsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCollectionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}}]}}]}}]}}]} as unknown as DocumentNode<UserLightCollectionsQueryQuery, UserLightCollectionsQueryQueryVariables>;
export const UserCollectionsQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserCollectionsQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserCollectionsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"collections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"shared"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}},{"kind":"Field","name":{"kind":"Name","value":"pages"}}]}}]}}]}}]} as unknown as DocumentNode<UserCollectionsQueryQuery, UserCollectionsQueryQueryVariables>;
export const LeaveCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LeaveCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<LeaveCollectionMutation, LeaveCollectionMutationVariables>;
export const CollectionUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CollectionUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterCollectionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCollectionUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}}]}}]}}]} as unknown as DocumentNode<CollectionUpdatedSubscription, CollectionUpdatedSubscriptionVariables>;
export const CollectionUserAddedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CollectionUserAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterCollectionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCollectionUserAdded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CollectionUserAddedSubscription, CollectionUserAddedSubscriptionVariables>;
export const CollectionUserRemovedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CollectionUserRemoved"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterCollectionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCollectionUserRemoved"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CollectionUserRemovedSubscription, CollectionUserRemovedSubscriptionVariables>;
export const CollectionUserUpdatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CollectionUserUpdated"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterCollectionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCollectionUserUpdated"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CollectionUserUpdatedSubscription, CollectionUserUpdatedSubscriptionVariables>;
export const CollectionCreatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CollectionCreated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCollectionCreated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"new"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}}]}}]} as unknown as DocumentNode<CollectionCreatedSubscription, CollectionCreatedSubscriptionVariables>;
export const CollectionRemovedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CollectionRemoved"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"FilterCollectionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCollectionRemoved"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CollectionRemovedSubscription, CollectionRemovedSubscriptionVariables>;
export const TransferCollectionOwnershipDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransferCollectionOwnership"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransferCollectionOwnershipInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferCollectionOwnership"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<TransferCollectionOwnershipMutation, TransferCollectionOwnershipMutationVariables>;
export const UpdateCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateCollectionMutation, UpdateCollectionMutationVariables>;
export const GetExperimentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetExperiments"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"version"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiments"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"version"},"value":{"kind":"Variable","name":{"kind":"Name","value":"version"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"versions"}}]}}]}}]} as unknown as DocumentNode<GetExperimentsQuery, GetExperimentsQueryVariables>;
export const SetExperimentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetExperiment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SetExperimentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setExperiment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode<SetExperimentMutation, SetExperimentMutationVariables>;
export const ExtraStateQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ExtraStateQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"experiments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"chats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"unread"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"invites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"rankId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"invalidated"}}]}},{"kind":"Field","name":{"kind":"Name","value":"association"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"hidden"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"permissions"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"rank"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"lastRead"}},{"kind":"Field","name":{"kind":"Name","value":"ranksMap"}}]}},{"kind":"Field","name":{"kind":"Name","value":"_redisSortDate"}},{"kind":"Field","name":{"kind":"Name","value":"recipient"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ranks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"managed"}},{"kind":"Field","name":{"kind":"Name","value":"index"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMap"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"coreState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"release"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"hostnameWithProtocol"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"}},{"kind":"Field","name":{"kind":"Name","value":"usage"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"collectionItems"}},{"kind":"Field","name":{"kind":"Name","value":"uploadGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pulseGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploads"}},{"kind":"Field","name":{"kind":"Name","value":"invites"}},{"kind":"Field","name":{"kind":"Name","value":"inviteMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"pulses"}},{"kind":"Field","name":{"kind":"Name","value":"docs"}},{"kind":"Field","name":{"kind":"Name","value":"messages"}},{"kind":"Field","name":{"kind":"Name","value":"chats"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maintenance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrations"}},{"kind":"Field","name":{"kind":"Name","value":"officialInstance"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anilist"}},{"kind":"Field","name":{"kind":"Name","value":"lastfm"}},{"kind":"Field","name":{"kind":"Name","value":"mal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"termsNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"privacyNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"}},{"kind":"Field","name":{"kind":"Name","value":"insights"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inviteAFriend"}},{"kind":"Field","name":{"kind":"Name","value":"preTrustedDomains"}},{"kind":"Field","name":{"kind":"Name","value":"hostnames"}},{"kind":"Field","name":{"kind":"Name","value":"_redis"}},{"kind":"Field","name":{"kind":"Name","value":"server"}},{"kind":"Field","name":{"kind":"Name","value":"finishedSetup"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"uptime"}},{"kind":"Field","name":{"kind":"Name","value":"uptimeSys"}},{"kind":"Field","name":{"kind":"Name","value":"commitVersion"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"permissionsMetadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"groupPrivacy"}},{"kind":"Field","name":{"kind":"Name","value":"friendRequests"}},{"kind":"Field","name":{"kind":"Name","value":"profileLayout"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"darkTheme"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"inviteId"}},{"kind":"Field","name":{"kind":"Name","value":"discordPrecache"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"domainId"}},{"kind":"Field","name":{"kind":"Name","value":"totpEnable"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"pendingAutoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePasswords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"weatherUnit"}},{"kind":"Field","name":{"kind":"Name","value":"themeEngine"}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"excludedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dismissed"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerUsername"}},{"kind":"Field","name":{"kind":"Name","value":"providerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"trackedUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"blocked"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nickname"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"blockedUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"blockedUserId"}},{"kind":"Field","name":{"kind":"Name","value":"silent"}}]}},{"kind":"Field","name":{"kind":"Name","value":"userEmoji"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"chatId"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<ExtraStateQueryQuery, ExtraStateQueryQueryVariables>;
export const CoreStateQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CoreStateQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"experiments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"versions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"coreState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"release"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"hostnameWithProtocol"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"}},{"kind":"Field","name":{"kind":"Name","value":"announcements"}},{"kind":"Field","name":{"kind":"Name","value":"usage"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"collectionItems"}},{"kind":"Field","name":{"kind":"Name","value":"uploadGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pulseGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploads"}},{"kind":"Field","name":{"kind":"Name","value":"invites"}},{"kind":"Field","name":{"kind":"Name","value":"inviteMilestone"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"pulses"}},{"kind":"Field","name":{"kind":"Name","value":"docs"}},{"kind":"Field","name":{"kind":"Name","value":"messages"}},{"kind":"Field","name":{"kind":"Name","value":"chats"}},{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"maintenance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enabled"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"statusPage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"registrations"}},{"kind":"Field","name":{"kind":"Name","value":"officialInstance"}},{"kind":"Field","name":{"kind":"Name","value":"providers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"anilist"}},{"kind":"Field","name":{"kind":"Name","value":"lastfm"}},{"kind":"Field","name":{"kind":"Name","value":"mal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"termsNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"privacyNoteId"}},{"kind":"Field","name":{"kind":"Name","value":"features"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"communications"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"workspaces"}},{"kind":"Field","name":{"kind":"Name","value":"insights"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inviteAFriend"}},{"kind":"Field","name":{"kind":"Name","value":"preTrustedDomains"}},{"kind":"Field","name":{"kind":"Name","value":"hostnames"}},{"kind":"Field","name":{"kind":"Name","value":"_redis"}},{"kind":"Field","name":{"kind":"Name","value":"server"}},{"kind":"Field","name":{"kind":"Name","value":"finishedSetup"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"uptime"}},{"kind":"Field","name":{"kind":"Name","value":"uptimeSys"}},{"kind":"Field","name":{"kind":"Name","value":"commitVersion"}}]}}]}}]} as unknown as DocumentNode<CoreStateQueryQuery, CoreStateQueryQueryVariables>;
export const WeatherDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"weather"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"temp"}},{"kind":"Field","name":{"kind":"Name","value":"feels_like"}},{"kind":"Field","name":{"kind":"Name","value":"temp_min"}},{"kind":"Field","name":{"kind":"Name","value":"temp_max"}},{"kind":"Field","name":{"kind":"Name","value":"pressure"}},{"kind":"Field","name":{"kind":"Name","value":"humidity"}},{"kind":"Field","name":{"kind":"Name","value":"wind_speed"}},{"kind":"Field","name":{"kind":"Name","value":"wind_deg"}},{"kind":"Field","name":{"kind":"Name","value":"clouds"}},{"kind":"Field","name":{"kind":"Name","value":"visibility"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"cached"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"main"}},{"kind":"Field","name":{"kind":"Name","value":"location"}}]}}]}}]} as unknown as DocumentNode<WeatherQuery, WeatherQueryVariables>;
export const OauthAppConsentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OauthAppConsent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableChatPermissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"group"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauthAppConsent"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUri"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"botId"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<OauthAppConsentQuery, OauthAppConsentQueryVariables>;
export const AddBotToChatDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBotToChat"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddBotToChatInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBotToChat"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddBotToChatMutation, AddBotToChatMutationVariables>;
export const OauthAppAuthorizeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OauthAppAuthorize"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AuthorizeAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oauthAppAuthorize"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<OauthAppAuthorizeMutation, OauthAppAuthorizeMutationVariables>;
export const OauthAppDeauthorizeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"OauthAppDeauthorize"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oauthAppDeauthorize"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<OauthAppDeauthorizeMutation, OauthAppDeauthorizeMutationVariables>;
export const CreateOauthAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOauthApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateOauthAppMutation, CreateOauthAppMutationVariables>;
export const CreateBotOauthAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateBotOauthApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateBotInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createBotOauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateBotOauthAppMutation, CreateBotOauthAppMutationVariables>;
export const LookupBotPrefixDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"LookupBotPrefix"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LookupPrefixInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lookupBotPrefix"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"prefix"}},{"kind":"Field","name":{"kind":"Name","value":"commands"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"command"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"botId"}}]}}]}}]}}]} as unknown as DocumentNode<LookupBotPrefixQuery, LookupBotPrefixQueryVariables>;
export const DevAppsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DevApps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oauthApps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUri"}},{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<DevAppsQuery, DevAppsQueryVariables>;
export const DevAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DevApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"oauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"shortCode"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"redirectUri"}},{"kind":"Field","name":{"kind":"Name","value":"secret"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"private"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}}]}},{"kind":"Field","name":{"kind":"Name","value":"oauthUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"oauthAppId"}},{"kind":"Field","name":{"kind":"Name","value":"manage"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"bot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}}]}}]}}]}}]} as unknown as DocumentNode<DevAppQuery, DevAppQueryVariables>;
export const AddOauthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddOauthUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddAppUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOauthUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddOauthUserMutation, AddOauthUserMutationVariables>;
export const UpdateOauthAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOauthApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<UpdateOauthAppMutation, UpdateOauthAppMutationVariables>;
export const DeleteOauthAppDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteOauthApp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteOauthApp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteOauthAppMutation, DeleteOauthAppMutationVariables>;
export const ResetOauthSecretDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetOauthSecret"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MyAppInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetOauthSecret"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<ResetOauthSecretMutation, ResetOauthSecretMutationVariables>;
export const UpdateOauthUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateOauthUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAppUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateOauthUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateOauthUserMutation, UpdateOauthUserMutationVariables>;
export const DomainsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Domains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]} as unknown as DocumentNode<DomainsQuery, DomainsQueryVariables>;
export const AddFriendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFriend"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddFriendInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friend"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddFriendMutation, AddFriendMutationVariables>;
export const GalleryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Gallery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"GalleryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gallery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pager"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"totalItems"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"pageSize"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"startPage"}},{"kind":"Field","name":{"kind":"Name","value":"endPage"}},{"kind":"Field","name":{"kind":"Name","value":"startIndex"}},{"kind":"Field","name":{"kind":"Name","value":"endIndex"}}]}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"autoCollectApproval"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"autoCollectRuleId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"originalFilename"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"deletable"}},{"kind":"Field","name":{"kind":"Name","value":"textMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pinned"}},{"kind":"Field","name":{"kind":"Name","value":"collectionId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"starred"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"attachmentId"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GalleryQuery, GalleryQueryVariables>;
export const DeleteUploadsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUploads"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUploads"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<DeleteUploadsMutation, DeleteUploadsMutationVariables>;
export const UpdateUploadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUpload"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUploadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUpload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateUploadMutation, UpdateUploadMutationVariables>;
export const CreateUploadsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"CreateUploads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onCreateUpload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upload"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"originalFilename"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"deletable"}},{"kind":"Field","name":{"kind":"Name","value":"textMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"item"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"starred"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateUploadsSubscription, CreateUploadsSubscriptionVariables>;
export const OnUpdateUploadsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"OnUpdateUploads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onUpdateUploads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"attachment"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"originalFilename"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fileSize"}},{"kind":"Field","name":{"kind":"Name","value":"deletable"}},{"kind":"Field","name":{"kind":"Name","value":"textMetadata"}},{"kind":"Field","name":{"kind":"Name","value":"collections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"starred"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<OnUpdateUploadsSubscription, OnUpdateUploadsSubscriptionVariables>;
export const MailStateQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MailStateQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unreadMail"}},{"kind":"Field","name":{"kind":"Name","value":"mailboxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"delimiter"}},{"kind":"Field","name":{"kind":"Name","value":"flags"}},{"kind":"Field","name":{"kind":"Name","value":"specialUse"}},{"kind":"Field","name":{"kind":"Name","value":"listed"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}}]}}]}}]} as unknown as DocumentNode<MailStateQueryQuery, MailStateQueryQueryVariables>;
export const UnreadMailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UnreadMail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unreadMail"}}]}}]} as unknown as DocumentNode<UnreadMailQuery, UnreadMailQueryVariables>;
export const CreatePulseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePulse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PulseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPulse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreatePulseMutation, CreatePulseMutationVariables>;
export const CreateSinglePulseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSinglePulse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SinglePulseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSinglePulse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateSinglePulseMutation, CreateSinglePulseMutationVariables>;
export const UpdatePulseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePulse"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PulseUpdateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePulse"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdatePulseMutation, UpdatePulseMutationVariables>;
export const BlockUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BlockUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"BlockUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blockUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode<BlockUserMutation, BlockUserMutationVariables>;
export const ChangeUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeUsernameInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUsername"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangeUsernameMutation, ChangeUsernameMutationVariables>;
export const ChangeUserPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUserPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangePasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUserPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables>;
export const ChangeUserEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUserEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUserEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangeUserEmailMutation, ChangeUserEmailMutationVariables>;
export const UsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"Troplo"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"Troplo","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"goose"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"goose","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"bytedefined"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"bytedefined","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"electrics01"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"electrics01","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"Jolt707"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"Jolt707","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"Avinera"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"Avinera","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","alias":{"kind":"Name","value":"Spy"},"name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"StringValue","value":"Spy","block":false}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}}]}}]} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const DeleteAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DangerZoneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const DeleteGalleryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGallery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DangerZoneInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGallery"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<DeleteGalleryMutation, DeleteGalleryMutationVariables>;
export const FriendsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"trackedUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"blocked"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"nickname"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nickname"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"blockedUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"blockedUserId"}},{"kind":"Field","name":{"kind":"Name","value":"silent"}},{"kind":"Field","name":{"kind":"Name","value":"blockedUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<FriendsQuery, FriendsQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UserProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"bot"}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"unlocked"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}}]}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"friend"}},{"kind":"Field","name":{"kind":"Name","value":"friends"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"friendId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"otherUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"features"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"purchasable"}},{"kind":"Field","name":{"kind":"Name","value":"internalFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"platforms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeen"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"profileLayout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"columns"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"rows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"friendsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"props"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"friendsOnly"}},{"kind":"Field","name":{"kind":"Name","value":"display"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"links"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"config"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"containerMargin"}},{"kind":"Field","name":{"kind":"Name","value":"showStatsSidebar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"stats"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}},{"kind":"Field","name":{"kind":"Name","value":"messages"}},{"kind":"Field","name":{"kind":"Name","value":"usage"}},{"kind":"Field","name":{"kind":"Name","value":"collections"}},{"kind":"Field","name":{"kind":"Name","value":"collectionItems"}},{"kind":"Field","name":{"kind":"Name","value":"uploadGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"messageGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pulseGraph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"labels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploads"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"pulses"}},{"kind":"Field","name":{"kind":"Name","value":"docs"}}]}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"mutualCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"itemCount"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}}]}},{"kind":"Field","name":{"kind":"Name","value":"themeEngine"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const SessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Sessions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SessionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sessions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"info"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"accessedFrom"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ip"}},{"kind":"Field","name":{"kind":"Name","value":"userAgent"}},{"kind":"Field","name":{"kind":"Name","value":"isp"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"asn"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<SessionsQuery, SessionsQueryVariables>;
export const UserStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"UserStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"onUserStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"platforms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"lastSeen"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]}}]} as unknown as DocumentNode<UserStatusSubscription, UserStatusSubscriptionVariables>;
export const UpdateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateUserMutation, UpdateUserMutationVariables>;
export const UpdateStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserStatusInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateStatusMutation, UpdateStatusMutationVariables>;
export const GetUserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"pulse"}},{"kind":"Field","name":{"kind":"Name","value":"groupPrivacy"}},{"kind":"Field","name":{"kind":"Name","value":"friendRequests"}},{"kind":"Field","name":{"kind":"Name","value":"profileLayout"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"darkTheme"}},{"kind":"Field","name":{"kind":"Name","value":"emailVerified"}},{"kind":"Field","name":{"kind":"Name","value":"banned"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"inviteId"}},{"kind":"Field","name":{"kind":"Name","value":"discordPrecache"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"domainId"}},{"kind":"Field","name":{"kind":"Name","value":"totpEnable"}},{"kind":"Field","name":{"kind":"Name","value":"quota"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"subscriptionId"}},{"kind":"Field","name":{"kind":"Name","value":"itemsPerPage"}},{"kind":"Field","name":{"kind":"Name","value":"banner"}},{"kind":"Field","name":{"kind":"Name","value":"pendingAutoCollects"}},{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"alternatePasswords"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scopes"}},{"kind":"Field","name":{"kind":"Name","value":"totp"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"storedStatus"}},{"kind":"Field","name":{"kind":"Name","value":"weatherUnit"}},{"kind":"Field","name":{"kind":"Name","value":"themeEngine"}},{"kind":"Field","name":{"kind":"Name","value":"xp"}},{"kind":"Field","name":{"kind":"Name","value":"publicProfile"}},{"kind":"Field","name":{"kind":"Name","value":"privacyPolicyAccepted"}},{"kind":"Field","name":{"kind":"Name","value":"dateOfBirth"}},{"kind":"Field","name":{"kind":"Name","value":"canAccessRestrictedContent"}},{"kind":"Field","name":{"kind":"Name","value":"forceAgeVerification"}},{"kind":"Field","name":{"kind":"Name","value":"plan"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"quotaMax"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"internalName"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"domain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"badges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"image"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}}]}},{"kind":"Field","name":{"kind":"Name","value":"excludedCollections"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"language"}},{"kind":"Field","name":{"kind":"Name","value":"nameColor"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hours"}}]}},{"kind":"Field","name":{"kind":"Name","value":"expiredAt"}},{"kind":"Field","name":{"kind":"Name","value":"cancelledAt"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"cancelled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"insights"}},{"kind":"Field","name":{"kind":"Name","value":"notifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dismissed"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"route"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"providerUsername"}},{"kind":"Field","name":{"kind":"Name","value":"providerUserId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"expiresAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQueryQuery, GetUserQueryQueryVariables>;
export const VerifyEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VerifyEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"verifyEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const SendVerificationEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendVerificationEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendVerificationEmail"}}]}}]} as unknown as DocumentNode<SendVerificationEmailMutation, SendVerificationEmailMutationVariables>;
export const CreateWorkspaceFolderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkspaceFolder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWorkspaceFolderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkspaceFolder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<CreateWorkspaceFolderMutation, CreateWorkspaceFolderMutationVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const CreateWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWorkspace"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metadata"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}}]}},{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspace"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"accepted"}},{"kind":"Field","name":{"kind":"Name","value":"recipientId"}},{"kind":"Field","name":{"kind":"Name","value":"senderId"}},{"kind":"Field","name":{"kind":"Name","value":"identifier"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"administrator"}},{"kind":"Field","name":{"kind":"Name","value":"moderator"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateWorkspaceMutation, CreateWorkspaceMutationVariables>;
export const NoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Note"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"permissions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"modify"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}},{"kind":"Field","name":{"kind":"Name","value":"versions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"blocks"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]}}]}}]}}]} as unknown as DocumentNode<NoteQuery, NoteQueryVariables>;
export const SaveNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SaveNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}}]}}]}}]} as unknown as DocumentNode<SaveNoteMutation, SaveNoteMutationVariables>;
export const SaveNoteBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SaveNoteBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNoteEventInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"saveNoteBlock"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SaveNoteBlockMutation, SaveNoteBlockMutationVariables>;
export const ToggleNoteShareDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ToggleNoteShare"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"toggleNoteShare"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"shareLink"}}]}}]}}]} as unknown as DocumentNode<ToggleNoteShareMutation, ToggleNoteShareMutationVariables>;
export const AddWorkspaceUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddWorkspaceUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WorkspaceUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addWorkspaceUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddWorkspaceUserMutation, AddWorkspaceUserMutationVariables>;
export const WorkspacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"read"}},{"kind":"Field","name":{"kind":"Name","value":"write"}},{"kind":"Field","name":{"kind":"Name","value":"configure"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"folders"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceId"}},{"kind":"Field","name":{"kind":"Name","value":"folderId"}},{"kind":"Field","name":{"kind":"Name","value":"children"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspaceFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"shareLink"}}]}}]}}]}}]}}]} as unknown as DocumentNode<WorkspacesQuery, WorkspacesQueryVariables>;