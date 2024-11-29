import cryptoRandomString from "crypto-random-string"

export class DefaultTpuConfig {
  public config: TpuConfig = {
    port: 34582,
    siteName: "TPU",
    hostname: "default.privateuploader.com",
    hostnameWithProtocol: "https://default.privateuploader.com",
    storage: "storage",
    registrations: false,
    mediaProxySecret: cryptoRandomString({ length: 128 }),
    maintenance: {
      enabled: false,
      statusPage: "https://status.troplo.com",
      message: "We are currently undergoing maintenance."
    },
    release: "prod",
    jitsiToken: null,
    officialInstance: false,
    finishedSetup: false,
    weatherApiKey: null,
    disableStats: false,
    discord: {
      webhook: null,
      token: null
    },
    providers: {
      tenor: null,
      lastfm: {
        key: null,
        secret: null
      },
      discord: {
        applicationId: null,
        publicKey: null,
        oAuthClientId: null,
        oAuthClientSecret: null,
        oAuthRedirectUri: null
      },
      mal: {
        key: null,
        secret: null
      },
      anilist: {
        key: null,
        secret: null
      },
      steam: null,
      google: null
    },
    email: {
      secure: false,
      username: "default",
      password: "",
      from: "default@privateuploader.local",
      host: "localhost",
      port: 25,
      enabled: true
    },
    redis: {
      host: "defaulthostname",
      port: 6379,
      db: 0
    },
    threads: 0,
    features: {
      communications: true,
      collections: true,
      autoCollects: true,
      workspaces: true,
      insights: true
    },
    defaultPlanId: 1,
    privacyNoteId: null,
    termsNoteId: null,
    inviteAFriend: true,
    hostnames: undefined,
    hive: {
      enabled: false,
      graphqlEndpoint: "https://gql.troplo.com/ingest/graphql",
      applicationUrl: "https://gql.troplo.com",
      usageEndpoint: "https://gql.troplo.com/ingest/usage",
      token: ""
    },
    preTrustedDomains: [
      "troplo.com",
      "images.flowinity.com",
      "i.troplo.com",
      "central.troplo.com",
      "home.troplo.com",
      "localhost",
      "youtube.com",
      "youtu.be",
      "vimeo.com",
      "twitch.tv",
      "i.flowinity.com",
      "scpe.eu.org",
      "colubrina.troplo.com",
      "compass.troplo.com",
      "plex.troplo.com",
      "meet.troplo.com",
      "flowinity.com",
      "synclounge.troplo.com",
      "overseerr.troplo.com",
      "jellyfin.troplo.com",
      "radarr.troplo.com",
      "sonarr.troplo.com",
      "google.com",
      "wikipedia.org",
      "troplo.eu.org",
      "flowinity.eu.org",
      "kaverti.com",
      "www.kaverti.com",
      "www.troplo.com",
      "www.flowinity.com",
      "www.google.com",
      "www.wikipedia.org",
      "en.wikipedia.org",
      "discordapp.com",
      "discord.com",
      "www.discordapp.com",
      "www.discord.com",
      "discord.gg",
      "speedtest.net",
      "www.speedtest.net",
      "speedtest.troplo.com",
      "office.com",
      "www.office.com",
      "drive.google.com",
      "www.youtube.com",
      "www.youtu.be",
      "www.vimeo.com",
      "www.twitch.tv",
      "next.images.flowinity.com",
      "legacy.images.flowinity.com",
      "app.i.troplo.com",
      "tenor.com",
      "media.tenor.com",
      "www.tenor.com",
      "giphy.com",
      "media.giphy.com",
      "www.giphy.com",
      "geo.troplo.com",
      "privateuploader.com",
      "www.privateuploader.com",
      "i.privateuploader.com",
      "next.privateuploader.com",
      "tpu-mobile.troplo.com"
    ],
    isV5: false,
    sentry: {
      dsn: null
    },
    aws: [],
    cloudflare: {
      enabled: false,
      key: null,
      zone: null
    }
  }
}
