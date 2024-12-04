import { registerEnumType } from "type-graphql"

export enum Experiments {
  NEW_BRANDING = "NEW_BRANDING",
  CAN_ENABLE_PROGRESSIVE_UI = "CAN_ENABLE_PROGRESSIVE_UI",
  EDITOR_V2 = "EDITOR_V2",
  WIDGETS = "WIDGETS",
  BADGES = "BADGES",
  NATIVE_BADGES = "NATIVE_BADGES",
  REMOVE_LEGACY_SOCKET = "REMOVE_LEGACY_SOCKET",
  CHAT_CACHING = "CHAT_CACHING",
  FAB = "FAB",
  ENABLE_PULSE_TAB = "ENABLE_PULSE_TAB",
  LEGACY_FLOWINITY_SSO = "LEGACY_FLOWINITY_SSO",
  CLASSIC_MIGRATE = "CLASSIC_MIGRATE",
  EXPAND_APP_BAR_IMAGE = "EXPAND_APP_BAR_IMAGE",
  COPY_MSG_ID = "COPY_MSG_ID",
  WEATHER = "WEATHER",
  BREADCRUMB_SHOW_PARENT = "BREADCRUMB_SHOW_PARENT",
  MEET = "MEET",
  COMMS_SUPERBAR = "COMMS_SUPERBAR",
  PROGRESSIVE_HOME = "PROGRESSIVE_HOME",
  DISABLE_ANIMATIONS = "DISABLE_ANIMATIONS",
  PROGRESSIVE_UI = "PROGRESSIVE_UI",
  CHAT_GUIDED_WIZARD = "CHAT_GUIDED_WIZARD",
  NOTE_AI_ASSIST = "NOTE_AI_ASSIST",
  NOTE_COLLAB = "NOTE_COLLAB",
  V5_FLOAT = "V5_FLOAT",
  IAF_NAG = "IAF_NAG",
  GALLERY_INFINITE_SCROLL = "GALLERY_INFINITE_SCROLL",
  DOWNLOAD_THE_APP_NAG = "DOWNLOAD_THE_APP_NAG",
  ENABLE_AUTOSTART_APP_NAG = "ENABLE_AUTOSTART_APP_NAG",
  DEBUG_FAVICON = "DEBUG_FAVICON",
  FLOWINITY = "FLOWINITY",
  PRIDE = "PRIDE",
  THEME = "THEME",
  NOTIFICATION_SOUND = "NOTIFICATION_SOUND",
  RESIZABLE_SIDEBARS = "RESIZABLE_SIDEBARS",
  LEGACY_MOBILE_NAV = "LEGACY_MOBILE_NAV",
  OFFICIAL_INSTANCE = "OFFICIAL_INSTANCE",
  API_FALLBACK_ON_ERROR = "API_FALLBACK_ON_ERROR",
  API_VERSION = "API_VERSION",
  USER_V3_EDITOR = "USER_V3_EDITOR",
  RAIL_SIDEBAR = "RAIL_SIDEBAR",
  USER_V3_MODIFY = "USER_V3_MODIFY",
  USER_V3 = "USER_V3",
  EARLY_ACCESS = "EARLY_ACCESS",
  PINNED_MESSAGES = "PINNED_MESSAGES",
  COMMUNICATIONS_KEEP_LOADED = "COMMUNICATIONS_KEEP_LOADED",
  COMMUNICATIONS_INLINE_SIDEBAR_HIRES = "COMMUNICATIONS_INLINE_SIDEBAR_HIRES",
  COMMUNICATIONS_QUAD_SIDEBAR_LOWRES = "COMMUNICATIONS_QUAD_SIDEBAR_LOWRES",
  COMMUNICATIONS = "COMMUNICATIONS",
  WEBMAIL = "WEBMAIL",
  SURVEYS = "SURVEYS",
  PROJECT_MERGE = "PROJECT_MERGE",
  WORKSPACES_SIDEBAR = "WORKSPACES_SIDEBAR",
  LEGACY_CUSTOMIZATION = "LEGACY_CUSTOMIZATION",
  ACCOUNT_DEV_ELIGIBLE = "ACCOUNT_DEV_ELIGIBLE",
  QUICK_NOTES = "QUICK_NOTES",
  INTERACTIVE_NOTES = "INTERACTIVE_NOTES",
  CREEPY_SFX_BUTTON = "CREEPY_SFX_BUTTON",
  PROFILE_BANNER = "PROFILE_BANNER",
  PROJECT_CENTRAL = "PROJECT_CENTRAL",
  DESIGN_V2 = "DESIGN_V2",
  API_VERSION_V2 = "API_VERSION_V2",
  MEME_GEN = "MEME_GEN",
  INSTANT_UPLOAD = "INSTANT_UPLOAD",
  USER_V2 = "USER_V2",
  SFX_KFX = "SFX_KFX",
  SFX_KOLF = "SFX_KOLF",
  HOVER_CHIP_CLOSE_DELAY = "HOVER_CHIP_CLOSE_DELAY",
  HOVER_CHIP_OPEN_DELAY = "HOVER_CHIP_OPEN_DELAY",
  HOVER_CHIP_HOVER = "HOVER_CHIP_HOVER",
  EXPERIENCE_FLUID = "EXPERIENCE_FLUID",
  EXPERIENCE_ITEMS_PER_PAGE = "EXPERIENCE_ITEMS_PER_PAGE",
  EXPERIENCE_GALLERY_ITEM_WIDTH = "EXPERIENCE_GALLERY_ITEM_WIDTH",
  ANDROID_CONFIG = "ANDROID_CONFIG",
  LEGACY_ATTRIBUTES_UI = "LEGACY_ATTRIBUTES_UI",
  ZZ_TEST = "ZZ_TEST"
}

export enum ExperimentsMeta {
  meta = "meta"
}

export type ExperimentsLegacy = Experiments | ExperimentsMeta

export function getExperiments() {
  return {
    NEW_BRANDING: false,
    CAN_ENABLE_PROGRESSIVE_UI: false,
    EDITOR_V2: false,
    WIDGETS: false,
    BADGES: false,
    NATIVE_BADGES: true,
    REMOVE_LEGACY_SOCKET: false,
    CHAT_CACHING: 5,
    FAB: false,
    ENABLE_PULSE_TAB: false,
    LEGACY_FLOWINITY_SSO: false,
    CLASSIC_MIGRATE: false,
    EXPAND_APP_BAR_IMAGE: false,
    COPY_MSG_ID: false,
    WEATHER: true,
    BREADCRUMB_SHOW_PARENT: false,
    MEET: false,
    COMMS_SUPERBAR: false,
    PROGRESSIVE_HOME: false,
    DISABLE_ANIMATIONS: false,
    PROGRESSIVE_UI: false,
    CHAT_GUIDED_WIZARD: true,
    NOTE_AI_ASSIST: false,
    NOTE_COLLAB: false,
    V5_FLOAT: true,
    IAF_NAG: false,
    GALLERY_INFINITE_SCROLL: false,
    DOWNLOAD_THE_APP_NAG: 1,
    ENABLE_AUTOSTART_APP_NAG: 1,
    DEBUG_FAVICON: false,
    FLOWINITY: false,
    // This can be enabled/disabled in the Settings at any time.
    PRIDE: 0,
    THEME: 3,
    NOTIFICATION_SOUND: 2,
    RESIZABLE_SIDEBARS: false,
    // TPUv3 frontend has a broken traditional mobile navigation (sidebar), thus the experimental BottomBar component
    // in this version must be enabled to make navigation possible. This flag is unused in any other version.
    LEGACY_MOBILE_NAV: false,
    OFFICIAL_INSTANCE: false,
    API_FALLBACK_ON_ERROR: false,
    API_VERSION: 3,
    USER_V3_EDITOR: false,
    RAIL_SIDEBAR: true,
    USER_V3_MODIFY: true,
    USER_V3: true,
    EARLY_ACCESS: false,
    PINNED_MESSAGES: true,
    COMMUNICATIONS_KEEP_LOADED: true,
    COMMUNICATIONS_INLINE_SIDEBAR_HIRES: false,
    COMMUNICATIONS_QUAD_SIDEBAR_LOWRES: false,
    COMMUNICATIONS: true,
    WEBMAIL: false,
    SURVEYS: false,
    PROJECT_MERGE: true,
    WORKSPACES_SIDEBAR: true,
    LEGACY_CUSTOMIZATION: false,
    ACCOUNT_DEV_ELIGIBLE: false,
    QUICK_NOTES: false,
    INTERACTIVE_NOTES: true,
    CREEPY_SFX_BUTTON: false,
    PROFILE_BANNER: true,
    PROJECT_CENTRAL: false,
    DESIGN_V2: false,
    API_VERSION_V2: true,
    MEME_GEN: false,
    INSTANT_UPLOAD: true,
    USER_V2: true,
    SFX_KFX: false,
    SFX_KOLF: false,
    HOVER_CHIP_CLOSE_DELAY: 35,
    HOVER_CHIP_OPEN_DELAY: 35,
    HOVER_CHIP_HOVER: true,
    EXPERIENCE_FLUID: false,
    EXPERIENCE_ITEMS_PER_PAGE: 12,
    EXPERIENCE_GALLERY_ITEM_WIDTH: 4,
    ANDROID_CONFIG: true,
    LEGACY_ATTRIBUTES_UI: false,
    ZZ_TEST: false,
    meta: {
      ZZ_TEST: {
        description: "ZZ_TEST",
        createdAt: "2024-09-26T00:00:00.000Z",
        versions: [5]
      },
      NEW_BRANDING: {
        description: "Enable the new Flowinity branding.",
        createdAt: "2024-06-18T00:00:00.000Z",
        versions: [4]
      },
      CAN_ENABLE_PROGRESSIVE_UI: {
        description:
          "Provide the option for users to enable the experimental UI.",
        createdAt: "2024-06-18T00:00:00.000Z",
        versions: [4]
      },
      EDITOR_V2: {
        description: "Enable the new Workspaces editor.",
        createdAt: "2024-06-06T00:00:00.000Z",
        versions: [4, 5]
      },
      WIDGETS: {
        description: "Enable railbar widgets.",
        createdAt: "2024-06-02T00:00:00.000Z",
        versions: [4, 5]
      },
      BADGES: {
        description: "Enable the extended custom badges.",
        createdAt: "2024-05-22T00:00:00.000Z",
        versions: [4, 5]
      },
      NATIVE_BADGES: {
        description: "Enable the native badges.",
        createdAt: "2024-05-22T00:00:00.000Z",
        versions: [4, 5]
      },
      REMOVE_LEGACY_SOCKET: {
        description: "Remove legacy /gateway support.",
        createdAt: "2024-05-19T00:00:00.000Z",
        versions: [4]
      },
      CHAT_CACHING: {
        description:
          "Caches the ChatV2 & MemberSidebarList components, improving future render for chat. Set 0 for unlimited caching. Set 1 to disable (only 1 allowed in store). Set custom number for max cache storage.",
        createdAt: "2024-05-19T00:00:00.000Z",
        versions: [4, 5]
      },
      FAB: {
        description: "Enable the global floating action button.",
        createdAt: "2024-05-18T00:00:00.000Z",
        versions: [3]
      },
      ENABLE_PULSE_TAB: {
        description: "Enable Insights Pulse tab.",
        createdAt: "2024-05-18T00:00:00.000Z",
        versions: [2]
      },
      LEGACY_FLOWINITY_SSO: {
        description: "Enable legacy Flowinity SSO.",
        createdAt: "2024-05-18T00:00:00.000Z",
        versions: [1, 2]
      },
      CLASSIC_MIGRATE: {
        description: "Enable classic migration.",
        createdAt: "2024-05-18T00:00:00.000Z",
        versions: [3]
      },
      EXPAND_APP_BAR_IMAGE: {
        description: "Expand app bar image on scroll up.",
        createdAt: "2024-05-15T00:00:00.000Z",
        versions: [4, 5]
      },
      COPY_MSG_ID: {
        description: "Copy message ID to clipboard via MessageActions.",
        createdAt: "2024-05-15T00:00:00.000Z",
        versions: [4, 5]
      },
      WEATHER: {
        description: "Enable weather in New and Old UI.",
        createdAt: "2024-05-14T00:00:00.000Z",
        versions: [4, 5]
      },
      BREADCRUMB_SHOW_PARENT: {
        description: "Show parent railbar item in breadcrumb.",
        createdAt: "2024-05-14T00:00:00.000Z",
        versions: [4, 5]
      },
      MEET: {
        description: "Enable Flowinity Meet.",
        createdAt: "2024-05-13T00:00:00.000Z",
        versions: [4, 5]
      },
      COMMS_SUPERBAR: {
        description: "Enable communications in superbar.",
        createdAt: "2024-05-12T00:00:00.000Z",
        versions: [4, 5]
      },
      PROGRESSIVE_HOME: {
        description: "Enable redesigned homepage with Progressive UI.",
        createdAt: "2024-05-12T00:00:00.000Z",
        // TODO: Old UI will be removed for v5 milestone
        versions: [4]
      },
      DISABLE_ANIMATIONS: {
        description: "Disable Progressive UI animations.",
        createdAt: "2024-05-11T00:00:00.000Z",
        versions: [4, 5]
      },
      PROGRESSIVE_UI: {
        description: "TPUv4 overhaul project",
        createdAt: "2024-05-09T00:00:00.000Z",
        // TODO: Old UI will be removed for v5 milestone
        versions: [4]
      },
      CHAT_GUIDED_WIZARD: {
        description: "Enable guided wizard for chat join and create",
        createdAt: "2024-05-03T00:00:00.000Z",
        // TODO: Remove redundant flag for v5 milestone
        versions: [4]
      },
      NOTE_AI_ASSIST: {
        description: "Enable AI assistance in notes",
        createdAt: "2024-04-27T00:00:00.000Z",
        versions: [4, 5]
      },
      NOTE_COLLAB: {
        description: "Enable note collaboration",
        createdAt: "2024-04-26T00:00:00.000Z",
        versions: [4, 5]
      },
      V5_FLOAT: {
        description: "Enable V5 floating UI",
        createdAt: "2024-04-01T00:00:00.000Z",
        versions: [5]
      },
      IAF_NAG: {
        description:
          "Show the Invite a Friend nag. 0 for disabled, 1 for enabled on verified users, 2 for everyone, 3 is disabled with positive interaction. 4 is disabled with redeemed. 5 is disabled with negative interaction",
        createdAt: "2024-03-11T00:00:00.000Z",
        versions: [4, 5]
      },
      GALLERY_INFINITE_SCROLL: {
        description:
          "Enable next generation gallery experience. Includes drag-to-select and infinite scrolling. Removed in 4.1.21.",
        createdAt: "2024-03-11T00:00:00.000Z",
        versions: [4]
      },
      DOWNLOAD_THE_APP_NAG: {
        description:
          "Show the download the app nag. 0 for disabled, 1 for verified users, 2 for everyone, 3 for disabled with nag interaction.",
        createdAt: "2024-03-03T00:00:00.000Z",
        versions: [4, 5]
      },
      ENABLE_AUTOSTART_APP_NAG: {
        description:
          "Enable autostart app nag. 0 for disabled, 1 for enabled, 2 for disabled with nag interaction.",
        createdAt: "2024-03-03T00:00:00.000Z",
        versions: [4, 5]
      },
      DEBUG_FAVICON: {
        description: "Enable debug favicon.",
        createdAt: "2024-01-20T00:00:00.000Z",
        versions: [4, 5]
      },
      FLOWINITY: {
        description: "Rebrand PrivateUploader to Flowinity.",
        createdAt: "2024-01-17T00:00:00.000Z",
        versions: [4, 5]
      },
      PRIDE: {
        description: "Enable pride theme.",
        createdAt: "2023-11-08T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      THEME: {
        description:
          "What frontend theme is applied. 1 is light, 2 is dark, 3 is amoled.",
        createdAt: "2023-09-24T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      NOTIFICATION_SOUND: {
        description:
          "What sound plays when a notification is received. 1 is default, 2 is classic.",
        createdAt: "2023-09-24T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      RESIZABLE_SIDEBARS: {
        description:
          "Enable resizing functionality in the TPU Sidebar component",
        createdAt: "2023-09-16T00:00:00.000Z",
        versions: [3, 4]
      },
      LEGACY_MOBILE_NAV: {
        description: "Legacy mobile navigation.",
        createdAt: "2023-06-16T00:00:00.000Z",
        versions: [3]
      },
      OFFICIAL_INSTANCE: {
        description: "Official PrivateUploader instance.",
        createdAt: "2023-05-15T00:00:00.000Z",
        versions: [2, 3, 4, 5]
      },
      API_FALLBACK_ON_ERROR: {
        description: "If the API request fails, fallback to the old API.",
        createdAt: "2023-05-10T00:00:00.000Z",
        versions: [1, 2]
      },
      API_VERSION: {
        description: "Specify custom API version.",
        createdAt: "2023-05-10T00:00:00.000Z",
        versions: [1, 2, 3, 4]
      },
      USER_V3_EDITOR: {
        description: "Development JSON editor and buttons for UserV3.",
        createdAt: "2023-05-09T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      RAIL_SIDEBAR: {
        description: "Enable the new sidebar.",
        createdAt: "2023-05-07T00:00:00.000Z",
        // TODO: Remove for v5
        versions: [3, 4]
      },
      USER_V3_MODIFY: {
        description: "Edit your own UserV3 profile.",
        createdAt: "2023-05-05T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      USER_V3: {
        description:
          "Enable the new Profiles update with user customizable components and widgets with various off-platform integrations.",
        createdAt: "2023-04-30T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      EARLY_ACCESS: {
        description:
          "Enable generic early access features that don't have special experiment overrides.",
        createdAt: "2023-03-08T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      PINNED_MESSAGES: {
        description: "Enable pinned messages in Communications.",
        createdAt: "2023-03-07T00:00:00.000Z",
        // TODO: Redundant experiment, remove for v5
        versions: [3, 4, 5]
      },
      COMMUNICATIONS_KEEP_LOADED: {
        description:
          "Keep communication messages loaded in the store. Removed in v4.1.18+",
        createdAt: "2023-03-02T00:00:00.000Z",
        versions: [3, 4]
      },
      COMMUNICATIONS_INLINE_SIDEBAR_HIRES: {
        description:
          "Enable inline sidebar for communications on high resolution devices.",
        createdAt: "2023-02-18T00:00:00.000Z",
        versions: [3]
      },
      COMMUNICATIONS_QUAD_SIDEBAR_LOWRES: {
        description:
          "Enable quad sidebar for communications on low resolution devices (not inline).",
        createdAt: "2023-02-18T00:00:00.000Z",
        versions: [3]
      },
      COMMUNICATIONS: {
        description: "Enable TPU Communications.",
        createdAt: "2023-02-10T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      WEBMAIL: {
        description: "Enable TPU webmail.",
        createdAt: "2023-02-10T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      SURVEYS: {
        description: "Allow the ability to create surveys.",
        createdAt: "2023-02-10T00:00:00.000Z",
        versions: [3, 4, 5]
      },
      PROJECT_MERGE: {
        description:
          "TPU Central concept for bringing Colubrina, BetterCompass, Jitsi, and GeoGuess together in one centralized platform.",
        createdAt: "2023-02-09T00:00:00.000Z",
        versions: [2, 3, 4]
      },
      WORKSPACES_SIDEBAR: {
        description: "Enable the new separate workspaces sidebar",
        createdAt: "2023-02-08T00:00:00.000Z",
        versions: [2, 3, 4]
      },
      LEGACY_CUSTOMIZATION: {
        description:
          "Re-enable legacy meta tag customization for TPUv1. This is no longer in TPUv2.",
        createdAt: "2023-02-07T00:00:00.000Z",
        versions: [1, 2]
      },
      ACCOUNT_DEV_ELIGIBLE: {
        description:
          "This toggle does nothing, it simply tells whether your account is eligible for development features based on inherit value.",
        createdAt: "2023-02-04T00:00:00.000Z",
        versions: [1, 2, 3, 4, 5]
      },
      QUICK_NOTES: {
        description: "Allow the ability to create quick notes.",
        createdAt: "2023-02-04T00:00:00.000Z",
        versions: [2]
      },
      INTERACTIVE_NOTES: {
        description:
          "Allow the ability to view and create interactive TPU notes.",
        createdAt: "2023-01-31T00:00:00.000Z",
        versions: [2, 3, 4, 5]
      },
      CREEPY_SFX_BUTTON: {
        description: "Allow the ability to send creepy sfx's to friends.",
        createdAt: "2023-01-28T00:00:00.000Z",
        versions: [2]
      },
      PROFILE_BANNER: {
        description: "Can change UserV2 banner.",
        createdAt: "2023-01-28T00:00:00.000Z",
        versions: [2]
      },
      PROJECT_CENTRAL: {
        description:
          "Have the TPU instance think it's running in a Central environment.",
        createdAt: "2023-01-23T00:00:00.000Z",
        refresh: true,
        versions: [2]
      },
      DESIGN_V2: {
        description: "Use the v2 design language.",
        createdAt: "2023-01-23T00:00:00.000Z",
        refresh: true,
        versions: [1, 2]
      },
      API_VERSION_V2: {
        description:
          "Use the new TypeScript rewritten API for TPU (incomplete)",
        createdAt: "2023-01-11T00:00:00.000Z",
        refresh: true,
        versions: [1, 2]
      },
      MEME_GEN: {
        description: "Add overlay text to existing images.",
        createdAt: "2023-01-10T00:00:00.000Z",
        versions: [1, 2, 4, 5]
      },
      AUG_2021_UI: {
        description: "Re-enable Initial TPU UI.",
        createdAt: "2023-01-05T00:00:00.000Z",
        refresh: true,
        versions: [1]
      },
      NON_TPU_BRANDING: {
        description: "Re-enables the pre-TPU branding.",
        createdAt: "2023-01-05T00:00:00.000Z",
        refresh: true,
        versions: [1]
      },
      INSTANT_UPLOAD: {
        description:
          "Allow you to paste files into TPU from anywhere to instantly upload it and copy TPU link to the clipboard.",
        createdAt: "2023-01-05T00:00:00.000Z",
        versions: [1, 2, 3, 4, 5]
      },
      USER_V2: {
        description: "A redesigned user page experience.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2, 3]
      },
      SFX_KFX: {
        description: "A sound effect for AutoCollect triggers.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      SFX_KOLF: {
        description: "A sound effect for AutoCollect triggers.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      HOVER_CHIP_CLOSE_DELAY: {
        description: "The delay before the hover chip component closes.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      HOVER_CHIP_OPEN_DELAY: {
        description: "The delay before the hover chip component opens.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      HOVER_CHIP_HOVER: {
        description:
          "Whether the hover chip component is always expanded or expand on hover.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      EXPERIENCE_FLUID: {
        description:
          "Whether the gallery, and other pages are fluid on low resolution displays.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      EXPERIENCE_ITEMS_PER_PAGE: {
        description: "The number of items per page in the gallery.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      EXPERIENCE_GALLERY_ITEM_WIDTH: {
        description: "The width of the gallery item in the gallery.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      ANDROID_CONFIG: {
        description:
          "Ability to download Automate configuration files in Client Settings.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      EXPERIENCE_API_KEY_LOGIN: {
        description: "Ability to login with an API key on login page.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      },
      LEGACY_ATTRIBUTES_UI: {
        description:
          "Whether the legacy attributes UI in Settings > About is enabled.",
        createdAt: "2022-12-15T00:00:00.000Z",
        versions: [1, 2]
      }
    } as {
      [key: string]: {
        description: string
        createdAt: string
        versions: number[]
        refresh?: boolean
        force?: boolean
        override?: boolean
      }
    }
  }
}

registerEnumType(Experiments, {
  name: "Experiments",
  description: "Available experiments"
})
