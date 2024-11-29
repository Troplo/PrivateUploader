import tesseract from "node-tesseract-ocr"
import cryptoRandomString from "crypto-random-string"
import { Container } from "typedi"

// Import Libs
import Errors from "@app/lib/errors"

// Import Models
import { CollectionItem } from "@app/models/collectionItem.model"
import { Collection } from "@app/models/collection.model"
import { User } from "@app/models/user.model"
import { Upload } from "@app/models/upload.model"
import { CollectionUser } from "@app/models/collectionUser.model"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Session } from "@app/models/session.model"
import { Domain } from "@app/models/domain.model"

// Import Services
import { CacheService } from "@app/services/cache.service"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"
import { SocketNamespaces } from "@app/classes/graphql/SocketEvents"
import os from "os"
import { pubSub } from "@app/lib/graphql/pubsub"
import { AutoCollectApprovalType } from "@app/classes/graphql/autoCollects/subscriptions/autoCollectApprovalEvent"
import { AwsService } from "@app/services/aws.service"

async function generateAPIKey(
  type: "session" | "api" | "email" | "oauth" | "oidc" | "bot-email"
): Promise<string> {
  switch (type) {
    case "session":
      return "FLOWINITY-WEB-" + cryptoRandomString({ length: 128 })
    case "email":
      return "FLOWINITY-EMAIL-" + cryptoRandomString({ length: 128 })
    case "oauth":
      return "FLOWINITY-OAUTH-" + cryptoRandomString({ length: 128 })
    case "oidc":
      return "FLOWINITY-OIDC-" + cryptoRandomString({ length: 128 })
    case "bot-email":
      return "reject-" + cryptoRandomString({ length: 16 })
    default:
      return "FLOWINITY-API-" + cryptoRandomString({ length: 128 })
  }
}

async function createSession(
  userId: number,
  scopes: string,
  type: "session" | "api",
  expiredAt?: Date
): Promise<string> {
  const token: string = await generateAPIKey(type)

  await Session.create({
    token,
    userId,
    scopes,
    type,
    expiredAt: expiredAt || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  })

  return token
}

async function getCollection(id: number, userId: number): Promise<Collection> {
  let collection: Collection | null = await Collection.findOne({
    where: { id, userId },
    include: [
      {
        model: User,
        as: "user",
        attributes: partialUserBase
      },
      {
        model: CollectionUser,
        as: "users",
        include: [
          {
            model: User,
            as: "user",
            attributes: partialUserBase
          }
        ]
      },
      {
        model: CollectionItem,
        as: "preview",
        required: false,
        include: [
          {
            required: false,
            model: Upload,
            as: "attachment",
            where: {
              type: "image"
            }
          }
        ]
      }
    ]
  })

  if (!collection) {
    collection = await Collection.findOne({
      where: {
        id
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        },
        {
          model: CollectionUser,
          as: "users",
          include: [
            {
              model: User,
              as: "user",
              attributes: partialUserBase
            }
          ]
        },
        {
          model: CollectionUser,
          as: "recipient",
          required: true,
          where: {
            recipientId: userId,
            write: true
          }
        },
        {
          model: CollectionItem,
          as: "preview",
          required: false,
          include: [
            {
              required: false,
              model: Upload,
              as: "attachment",
              where: {
                type: "image"
              }
            }
          ]
        }
      ]
    })

    if (!collection) throw Errors.NOT_FOUND

    collection.shared = true
  }

  return collection
}

function checkOperator(
  text: any,
  operator: string,
  value: string,
  ruleId: number
) {
  if (["lt", "lte", "gt", "gte"].includes(operator)) {
    if (!Number.isInteger(text)) {
      text = text?.length || 0
    }
  }

  value = value?.toLowerCase() || value

  if (!Number.isInteger(text)) {
    text = text?.toLowerCase() || text
  }
  if (operator === "contains") {
    return {
      value: !!text.includes(value),
      reason: `contains ${value}`,
      ruleId
    }
  } else if (operator === "equals") {
    return {
      value: text.split(" ").includes(value),
      reason: `equals ${value}`,
      ruleId
    }
  } else if (operator === "doesNotEq") {
    return {
      value: !text.split(" ").includes(value),
      reason: `does not equal ${value}`,
      ruleId
    }
  } else if (operator === "doesNotCo") {
    return {
      value: !text.includes(value),
      reason: `does not contain ${value}`,
      ruleId
    }
  } else if (operator === "lt") {
    return { value: text < value, reason: `less than ${value}`, ruleId }
  } else if (operator === "lte") {
    return {
      value: text <= value,
      reason: `less than or equal to ${value}`,
      ruleId
    }
  } else if (operator === "gt") {
    return { value: text > value, reason: `greater than ${value}` }
  } else if (operator === "gte") {
    return {
      value: text >= value,
      reason: `greater than or equal to ${value}, is ${text}`,
      ruleId
    }
  } else {
    return console.error("Unknown operator.")
  }
}

async function processFile(
  upload: Upload,
  textMetadata: string
): Promise<void> {
  try {
    const rules: AutoCollectRule[] = await AutoCollectRule.findAll({
      where: {
        userId: upload.userId
      }
    })

    textMetadata = textMetadata?.toLowerCase() || textMetadata

    for (const rule of rules) {
      let results: any[] = []

      if (!rule.collectionId) continue
      if (!rule.enabled) continue
      if (!(await getCollection(rule.collectionId, upload.userId))) continue

      // @ts-ignore
      for (const subRule of rule.rules) {
        let resultsOfSubRule: any[] = []

        for (const subSubRule of subRule.rules) {
          if (subSubRule.type === "metadata") {
            resultsOfSubRule.push(
              checkOperator(
                textMetadata,
                subSubRule.operator,
                subSubRule.value,
                rule.id
              )
            )
          } else if (subSubRule.type === "name") {
            resultsOfSubRule.push(
              checkOperator(
                upload.originalFilename,
                subSubRule.operator,
                subSubRule.value,
                rule.id
              )
            )
          } else if (subSubRule.type === "extension") {
            const extension: string | undefined = upload.originalFilename
              ?.split(".")
              ?.pop()

            resultsOfSubRule.push(
              checkOperator(
                extension,
                subSubRule.operator,
                subSubRule.value,
                rule.id
              )
            )
          } else if (subSubRule.type === "metadata-word-length") {
            const wordCount: number = textMetadata?.split(" ")?.length || 0

            resultsOfSubRule.push(
              checkOperator(
                wordCount,
                subSubRule.operator,
                subSubRule.value,
                rule.id
              )
            )
          } else if (subSubRule.type === "metadata-char-length") {
            resultsOfSubRule.push(
              checkOperator(
                textMetadata.length,
                subSubRule.operator,
                subSubRule.value,
                rule.id
              )
            )
          }
        }

        if (!resultsOfSubRule.some((result) => !result?.value)) {
          results.push({
            value: true
          })
        } else {
          results.push({
            value: false
          })
        }
      }
      if (results.some((result) => result.value) && rule.requireApproval) {
        const cache: CacheService = Container.get(CacheService)
        const collection = await cache.getCachedCollection(
          rule.userId,
          rule.collectionId
        )
        const autoCollect: AutoCollectApproval =
          await AutoCollectApproval.create({
            userId: upload.userId,
            uploadId: upload.id,
            autoCollectRuleId: rule.id,
            collectionId: rule.collectionId,
            info: results
          })
        let autoCollects = await redis.json.get(`autoCollects:${upload.userId}`)

        if (autoCollects?.length) {
          try {
            autoCollects
              .find(
                (collection: Collection): boolean =>
                  collection.id === rule.collectionId
              )
              .autoCollectApprovals.push(autoCollect)

            await redis.json.set(
              `autoCollects:${upload.userId}`,
              "$",
              autoCollects
            )
          } catch {
            autoCollects.push({
              id: rule.collectionId,
              ...collection,
              autoCollectApprovals: [autoCollect]
            })

            await redis.json.set(
              `autoCollects:${upload.userId}`,
              "$",
              autoCollects
            )
          }
        } else {
          await redis.json.set(`autoCollects:${upload.userId}`, "$", [
            {
              ...collection,
              autoCollectApprovals: [autoCollect]
            }
          ])
        }

        pubSub.publish(`AUTO_COLLECT_APPROVAL:${upload.userId}`, {
          type: AutoCollectApprovalType.NEW,
          autoCollectApproval: autoCollect.toJSON()
        })

        socket
          .of(SocketNamespaces.AUTO_COLLECTS)
          .to(upload.userId)
          .emit("autoCollectApproval", {
            type: "new"
          })
      } else if (
        results.some((result) => result.value) &&
        !rule.requireApproval
      ) {
        await CollectionItem.create({
          collectionId: rule.collectionId,
          attachmentId: upload.id,
          userId: upload.userId,
          identifier: upload.id + "-" + rule.collectionId
        })
      }
    }
  } catch (err) {
    console.log("Error processing file", err)
  }
  if (
    config.aws &&
    (("length" in config.aws && config.aws.length) ||
      (!("length" in config.aws) && config.aws?.enabled))
  ) {
    await queue.awsQueue.add(
      upload.attachment,
      {
        localFileMode: "delete"
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000
        }
      }
    )
  }
}

async function postUpload(upload: Upload): Promise<void> {
  let path = global.storageRoot
  if (process.env.NODE_ENV === "test") {
    path = `${os.homedir()}/test_uploads/`
  }
  await tesseract
    .recognize(path + upload.attachment, {})
    .then(async (text: string): Promise<void> => {
      await Upload.update(
        {
          textMetadata: text
        },
        {
          where: {
            id: upload.id
          }
        }
      )
      const find = await Upload.findOne({
        where: {
          id: upload.id
        }
      })
      await pubSub.publish(`UPDATE_UPLOADS:${upload.userId}`, [
        {
          ...find?.toJSON(),
          textMetadata: text
        }
      ])
      await socket
        .of(SocketNamespaces.GALLERY)
        .to(upload.userId)
        .emit("update", [
          {
            ...find?.toJSON(),
            textMetadata: text
          }
        ])
      await processFile(upload, text)
    })
    .catch(async (error): Promise<void> => {
      console.error(error.message)
      await Upload.update(
        {
          textMetadata: ""
        },
        {
          where: {
            id: upload.id
          }
        }
      )
      const find = await Upload.findOne({
        where: {
          id: upload.id
        }
      })
      await pubSub.publish(`UPDATE_UPLOADS:${upload.userId}`, [
        {
          ...find?.toJSON(),
          textMetadata: ""
        }
      ])
      await socket
        .of(SocketNamespaces.GALLERY)
        .to(upload.userId)
        .emit("update", [
          {
            ...find?.toJSON(),
            textMetadata: ""
          }
        ])
      await processFile(upload, "")
    })
}

async function getUserDomain(userId: number): Promise<string> {
  const user: User | null = await User.findOne({
    where: {
      id: userId
    },
    include: [
      {
        model: Domain,
        as: "domain"
      }
    ]
  })

  return user?.domain?.domain + "/i/" || "https://i.troplo.com/i/"
}

async function processXP(
  userId: number,
  type:
    | "upload"
    | "autoCollect"
    | "addFriend"
    | "iaf"
    | "hour"
    | "messages"
    | "gold"
) {
  const user = await User.findOne({
    where: {
      id: userId
    }
  })
  if (!user) return
  let xp = user.xp
  switch (type) {
    case "upload":
      xp += 1n
      break
    case "autoCollect":
      xp += 2n
      break
    case "addFriend":
      xp += 50n
      break
    case "iaf":
      xp += 200n
      break
    case "hour":
      xp += 70n
      break
    // per 500 messages
    case "messages":
      xp += 350n
      break
    case "gold":
      xp += 500n
      break
  }
  console.log("XP", xp)
}

/** @deprecated */
function getTypeByExt(ext: string): string {
  const types: Record<string, string> = {
    ase: "text",
    art: "image",
    bmp: "image",
    blp: "image",
    cd5: "image",
    cit: "image",
    cpt: "image",
    cr2: "image",
    cut: "image",
    dds: "image",
    dib: "image",
    djvu: "image",
    egt: "image",
    exif: "image",
    gif: "image",
    gpl: "image",
    grf: "image",
    icns: "image",
    ico: "image",
    iff: "image",
    jng: "image",
    jpeg: "image",
    jpg: "image",
    jfif: "image",
    jp2: "image",
    jps: "image",
    lbm: "image",
    max: "image",
    miff: "image",
    msp: "image",
    nef: "image",
    nitf: "image",
    ota: "image",
    pbm: "image",
    pc1: "image",
    pc2: "image",
    pc3: "image",
    pcf: "image",
    pcx: "image",
    pdn: "image",
    pgm: "image",
    PI1: "image",
    PI2: "image",
    PI3: "image",
    pict: "image",
    pct: "image",
    pnm: "image",
    pns: "image",
    ppm: "image",
    psb: "image",
    psd: "image",
    pdd: "image",
    psp: "image",
    px: "image",
    pxm: "image",
    pxr: "image",
    qfx: "image",
    raw: "image",
    rle: "image",
    sct: "image",
    sgi: "image",
    rgb: "image",
    int: "image",
    bw: "image",
    tga: "image",
    tiff: "image",
    tif: "image",
    vtf: "image",
    xbm: "image",
    xcf: "image",
    xpm: "image",
    "3dv": "image",
    amf: "image",
    ai: "image",
    awg: "image",
    cgm: "image",
    cdr: "image",
    cmx: "image",
    dxf: "image",
    e2d: "image",
    eps: "image",
    fs: "image",
    gbr: "image",
    odg: "image",
    svg: "image",
    stl: "image",
    vrml: "image",
    x3d: "image",
    sxd: "image",
    v2d: "image",
    vnd: "image",
    wmf: "image",
    emf: "image",
    xar: "image",
    png: "image",
    webp: "image",
    jxr: "image",
    hdp: "image",
    wdp: "image",
    cur: "image",
    ecw: "image",
    liff: "image",
    nrrd: "image",
    pam: "image",
    pgf: "image",
    rgba: "image",
    inta: "image",
    sid: "image",
    ras: "image",
    sun: "image",
    heic: "image",
    heif: "image",
    webm: "video",
    mkv: "video",
    flv: "video",
    vob: "video",
    ogv: "video",
    rrc: "video",
    gifv: "video",
    mng: "video",
    mov: "video",
    avi: "video",
    qt: "video",
    wmv: "video",
    yuv: "video",
    rm: "video",
    asf: "video",
    amv: "video",
    mp4: "video",
    m4v: "video",
    mpg: "video",
    mp2: "video",
    mpeg: "video",
    mpe: "video",
    mpv: "video",
    svi: "video",
    "3gp": "video",
    "3g2": "video",
    mxf: "video",
    roq: "video",
    nsv: "video",
    f4v: "video",
    f4p: "video",
    f4a: "video",
    f4b: "video",
    mod: "video",
    wav: "audio",
    bwf: "audio",
    aiff: "audio",
    flac: "audio",
    m4a: "audio",
    pac: "audio",
    tta: "audio",
    wv: "audio",
    ast: "audio",
    aac: "audio",
    mp3: "audio",
    amr: "audio",
    s3m: "audio",
    act: "audio",
    au: "audio",
    dct: "audio",
    dss: "audio",
    gsm: "audio",
    mmf: "audio",
    mpc: "audio",
    ogg: "audio",
    oga: "audio",
    opus: "audio",
    ra: "audio",
    vox: "audio",
    ada: "text",
    adb: "text",
    ads: "text",
    applescript: "text",
    as: "text",
    asc: "text",
    ascii: "text",
    ascx: "text",
    asm: "text",
    asmx: "text",
    asp: "text",
    aspx: "text",
    atom: "text",
    au3: "text",
    awk: "text",
    bas: "text",
    bash: "text",
    bashrc: "text",
    bat: "text",
    bbcolors: "text",
    bcp: "text",
    bdsgroup: "text",
    bdsproj: "text",
    bib: "text",
    bowerrc: "text",
    c: "text",
    cbl: "text",
    cc: "text",
    cfc: "text",
    cfg: "text",
    cfm: "text",
    cfml: "text",
    cgi: "text",
    cjs: "text",
    clj: "text",
    cljs: "text",
    cls: "text",
    cmake: "text",
    cmd: "text",
    cnf: "text",
    cob: "text",
    "code-snippets": "text",
    coffee: "text",
    coffeekup: "text",
    conf: "text",
    cp: "text",
    cpp: "text",
    cpy: "text",
    crt: "text",
    cs: "text",
    csh: "text",
    cson: "text",
    csproj: "text",
    csr: "text",
    css: "text",
    csslintrc: "text",
    csv: "text",
    ctl: "text",
    curlrc: "text",
    cxx: "text",
    d: "text",
    dart: "text",
    dfm: "text",
    diff: "text",
    dof: "text",
    dpk: "text",
    dpr: "text",
    dproj: "text",
    dtd: "text",
    eco: "text",
    editorconfig: "text",
    ejs: "text",
    el: "text",
    elm: "text",
    emacs: "text",
    eml: "text",
    ent: "text",
    erb: "text",
    erl: "text",
    eslintignore: "text",
    eslintrc: "text",
    ex: "text",
    exs: "text",
    f: "text",
    f03: "text",
    f77: "text",
    f90: "text",
    f95: "text",
    fish: "text",
    for: "text",
    fpp: "text",
    frm: "text",
    fsproj: "text",
    fsx: "text",
    ftn: "text",
    gemrc: "text",
    gemspec: "text",
    gitattributes: "text",
    gitconfig: "text",
    gitignore: "text",
    gitkeep: "text",
    gitmodules: "text",
    go: "text",
    gpp: "text",
    gradle: "text",
    graphql: "text",
    groovy: "text",
    groupproj: "text",
    grunit: "text",
    gtmpl: "text",
    gvimrc: "text",
    h: "text",
    haml: "text",
    hbs: "text",
    hgignore: "text",
    hh: "text",
    hpp: "text",
    hrl: "text",
    hs: "text",
    hta: "text",
    htaccess: "text",
    htc: "text",
    htm: "text",
    html: "text",
    htpasswd: "text",
    hxx: "text",
    iced: "text",
    iml: "text",
    inc: "text",
    inf: "text",
    info: "text",
    ini: "text",
    ino: "text",
    irbrc: "text",
    itcl: "text",
    itermcolors: "text",
    itk: "text",
    jade: "text",
    java: "text",
    jhtm: "text",
    jhtml: "text",
    js: "text",
    jscsrc: "text",
    jshintignore: "text",
    jshintrc: "text",
    json: "text",
    json5: "text",
    jsonld: "text",
    jsp: "text",
    jspx: "text",
    jsx: "text",
    ksh: "text",
    less: "text",
    lhs: "text",
    lisp: "text",
    log: "text",
    ls: "text",
    lsp: "text",
    lua: "text",
    m: "text",
    m4: "text",
    mak: "text",
    map: "text",
    markdown: "text",
    master: "text",
    md: "text",
    mdown: "text",
    mdwn: "text",
    mdx: "text",
    metadata: "text",
    mht: "text",
    mhtml: "text",
    mjs: "text",
    mk: "text",
    mkd: "text",
    mkdn: "text",
    mkdown: "text",
    ml: "text",
    mli: "text",
    mm: "text",
    mxml: "text",
    nfm: "text",
    nfo: "text",
    noon: "text",
    npmignore: "text",
    npmrc: "text",
    nuspec: "text",
    nvmrc: "text",
    ops: "text",
    pas: "text",
    pasm: "text",
    patch: "text",
    pbxproj: "text",
    pch: "text",
    pem: "text",
    pg: "text",
    php: "text",
    php3: "text",
    php4: "text",
    php5: "text",
    phpt: "text",
    phtml: "text",
    pir: "text",
    pl: "text",
    pm: "text",
    pmc: "text",
    pod: "text",
    pot: "text",
    prettierrc: "text",
    properties: "text",
    props: "text",
    pt: "text",
    pug: "text",
    purs: "text",
    py: "text",
    pyx: "text",
    r: "text",
    rake: "text",
    rb: "text",
    rbw: "text",
    rc: "text",
    rdoc: "text",
    rdoc_options: "text",
    resx: "text",
    rexx: "text",
    rhtml: "text",
    rjs: "text",
    rlib: "text",
    ron: "text",
    rs: "text",
    rss: "text",
    rst: "text",
    rtf: "text",
    rvmrc: "text",
    rxml: "text",
    s: "text",
    sass: "text",
    scala: "text",
    scm: "text",
    scss: "text",
    seestyle: "text",
    sh: "text",
    shtml: "text",
    sln: "text",
    sls: "text",
    spec: "text",
    sql: "text",
    sqlite: "text",
    sqlproj: "text",
    srt: "text",
    ss: "text",
    sss: "text",
    st: "text",
    strings: "text",
    sty: "text",
    styl: "text",
    stylus: "text",
    sub: "text",
    "sublime-build": "text",
    "sublime-commands": "text",
    "sublime-completions": "text",
    "sublime-keymap": "text",
    "sublime-macro": "text",
    "sublime-menu": "text",
    "sublime-project": "text",
    "sublime-settings": "text",
    "sublime-workspace": "text",
    sv: "text",
    svc: "text",
    swift: "text",
    t: "text",
    tcl: "text",
    tcsh: "text",
    terminal: "text",
    tex: "text",
    text: "text",
    textile: "text",
    tg: "text",
    tk: "text",
    tmLanguage: "text",
    tmpl: "text",
    tmTheme: "text",
    tpl: "text",
    ts: "text",
    tsv: "text",
    tsx: "text",
    tt: "text",
    tt2: "text",
    ttml: "text",
    twig: "text",
    txt: "text",
    v: "text",
    vb: "text",
    vbproj: "text",
    vbs: "text",
    vcproj: "text",
    vcxproj: "text",
    vh: "text",
    vhd: "text",
    vhdl: "text",
    vim: "text",
    viminfo: "text",
    vimrc: "text",
    vm: "text",
    vue: "text",
    webapp: "text",
    webmanifest: "text",
    wsc: "text",
    "x-php": "text",
    xaml: "text",
    xht: "text",
    xhtml: "text",
    xml: "text",
    xs: "text",
    xsd: "text",
    xsl: "text",
    xslt: "text",
    y: "text",
    yaml: "text",
    yml: "text",
    zsh: "text",
    zshrc: "text",
    exe: "binary",
    dll: "binary",
    so: "binary"
  } as Record<string, string>
  return types[ext?.toLowerCase()] || "binary"
}

function getTypeByMime(mimeVal: string, ext: string) {
  if (
    !mimeVal ||
    mimeVal === "*/*" ||
    mimeVal === "application/octet-stream" ||
    mimeVal === "text/plain"
  )
    return getTypeByExt(ext)
  const mime = mimeVal.toLowerCase()
  if (mime.startsWith("image/")) return "image"
  if (mime.startsWith("video/")) return "video"
  if (mime.startsWith("audio/")) return "audio"
  if (mime.startsWith("text/")) return "text"
  return "binary"
}

export default {
  getTypeByExt,
  getUserDomain,
  postUpload,
  generateAPIKey,
  createSession,
  processXP,
  getTypeByMime
}
