import { Service } from "typedi"
// TODO: I can't get the custom fqdn for signed URLs to work on new AWS API, for now we'll use the old one.
import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3"
import crypto from "crypto"
import { Upload } from "@app/models/upload.model"
import { Upload as S3Upload } from "@aws-sdk/lib-storage"
import fs from "fs"
import redisClient from "@app/redis"
import axios from "axios"
import { SignatureV4 } from "@aws-sdk/signature-v4"
import { HttpRequest } from "@aws-sdk/protocol-http"
import { Hash } from "@aws-sdk/hash-node"
import path from "path"
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"
import Errors from "@app/lib/errors"

const PART_SIZE = 20 * 1024 * 1024

@Service()
export class AwsService {
  s3: Record<string, S3Client> = {}
  // TpuConfig["aws"] can be an array or object, so get the first array
  s3Config: S3Config
  constructor() {
    if (config.aws && "length" in config.aws) {
      this.s3Config = config.aws.find((aws) => aws.default) || config.aws[0]
    } else if (config.aws?.enabled) {
      this.s3Config = config.aws
    } else {
      return
    }
    for (const cfg of "length" in config.aws ? config.aws : [config.aws]) {
      this.s3 = {
        ...this.s3,
        [cfg.bucket!]: new S3Client({
          credentials: {
            accessKeyId: this.s3Config.accessKeyId!,
            secretAccessKey: this.s3Config.secretAccessKey!
          },
          region: this.s3Config.region!,
          endpoint: this.s3Config.endpoint!
        })
      }
    }
  }

  async uploadFile(
    files: {
      attachment: string
    }[],
    localFileMode: "delete" | "rename" | "none" = "delete"
  ): Promise<
    {
      Location: string
      Key: string
      Bucket: string
    }[]
  > {
    const s3 = this.s3[this.s3Config.bucket!]
    if (!s3) {
      return []
    }

    const uploads: {
      Location: string
      Key: string
      Bucket: string
    }[] = []
    for (const file of files) {
      const path = `${global.storageRoot}/${file.attachment}`
      const fileStream = fs.createReadStream(path, {
        highWaterMark: PART_SIZE
      })
      const upload = await Upload.findOne({
        where: {
          attachment: file.attachment
        }
      })
      if (!upload) {
        console.log(`Upload not found for ${file.attachment}`)
        continue
      }
      let sha256sum = upload.sha256sum
      let key = upload.attachment
      if (!sha256sum) {
        const hash = crypto.createHash("sha256")
        key = await new Promise(function (resolve, reject) {
          fileStream.on("data", (data) => {
            hash.update(data)
          })
          fileStream.on("end", () => {
            resolve(hash.digest("hex"))
          })
          fileStream.on("error", (err) => {
            reject(err)
          })
        })
        if (!key) throw new Error("Failed to hash file")
      }

      console.log(`Checking if ${key} exists`)
      let exists = false
      try {
        const command = new HeadObjectCommand({
          Bucket: this.s3Config.bucket!,
          Key: key
        })
        const data = await s3.send(command)
        console.log("Exists", data)
        exists = true
      } catch {}
      console.log(`Checking if ${key} exists, ${exists}`)
      const media =
        upload.type === "image" ||
        upload.type === "video" ||
        upload.type === "audio"
      const params = {
        Bucket: this.s3Config.bucket!,
        Key: key,
        Body: fileStream,
        ContentDisposition: `${!media ? "attachment" : "inline"}; filename="${
          upload.originalFilename
        }"`,
        ContentType: upload.mimeType
      }
      if (!exists) {
        try {
          const s3Upload = new S3Upload({
            client: s3,
            queueSize: 4,
            leavePartsOnError: false,
            tags: [{ Key: "userId", Value: upload.userId.toString() }],
            params
          })
          await s3Upload.done()
        } catch (caught) {
          throw caught
        }
      }
      uploads.push({
        Location: `${this.s3Config.bucketUrl}/${key}`,
        Key: key,
        Bucket: this.s3Config.bucket!
      })
      await Upload.update(
        // use version 2
        { location: `${this.s3Config.bucket!}/${key}:2`, sha256sum },
        { where: { attachment: file.attachment } }
      )
      // delete file since it's now on AWS
      if (localFileMode === "delete") {
        await fs.promises.unlink(`${global.storageRoot}/${file.attachment}`)
      } else if (localFileMode === "rename") {
        await fs.promises.rename(
          `${global.storageRoot}/${file.attachment}`,
          `${global.storageRoot}/${file.attachment}.toDeleteUploadedS3TPU`
        )
      }
    }
    return uploads
  }
  // async retrieveFile(key: string) {
  //   if (!this.s3) {
  //     return null
  //   }
  //   if (fs.existsSync(`${global.storageRoot}/${key}.awscache`)) {
  //     return fs.promises.readFile(`${global.storageRoot}/${key}.awscache`)
  //   }
  //
  //   const params = {
  //     Bucket: config.aws!.bucket!,
  //     Key: key
  //   }
  //
  //   const data = await this.s3.getObject(params).promise()
  //   // cache it locally for an hour
  //   // fs.promises.writeFile(
  //   //   `${global.storageRoot}/${key}.awscache`,
  //   //   data.Body as Buffer,
  //   //   { flag: "w" }
  //   // )
  //   // await queue.awsCacheQueue?.add(
  //   //   key,
  //   //   {
  //   //     key: `${key}.awscache`
  //   //   },
  //   //   {
  //   //     removeOnComplete: true,
  //   //     removeOnFail: true,
  //   //     // offset of 1 hour
  //   //     delay: 1000 * 60 * 60
  //   //   }
  //   // )
  //   return data.Body
  // }
  //
  async getSignedUrl(
    key: string,
    filename: string,
    type: "attachment" | "inline" = "attachment",
    mimeType = "application/octet-stream",
    bucket: string = this.s3Config.bucket!,
    // 7 days
    expiry = 60 * 60 * 24 * 7
  ): Promise<string> {
    const s3 = this.s3[bucket]
    if (!s3 || !key) {
      throw Errors.REMOTE_RESOURCE_MISSING
    }
    const cacheKey = `s3SignedUrl:${key}:${filename}:${type}:${mimeType}:${expiry}`
    const cached = await redisClient.get(cacheKey)
    // if cached version is 4d old, refresh it
    if (cached && (await redisClient.ttl(cacheKey)) > 60 * 60 * 24 * 4) {
      return cached
    }
    const cfg =
      "length" in config.aws!
        ? config.aws.find((aws) => aws.bucket === bucket) || config.aws![0]
        : config.aws!

    const url = new URL(`https://${cfg.bucket}/${key}`)
    const disposition = `${type}; filename="${filename.replace(/"/g, "")}"`
    url.searchParams.set("response-content-disposition", disposition)
    url.searchParams.set("response-content-type", mimeType)
    const policy = {
      Statement: [
        {
          Resource: url,
          Condition: {
            DateLessThan: {
              "AWS:EpochTime": Math.floor(Date.now() / 1000) + expiry
            }
          },
          Action: "s3:GetObject",
          Effect: "Allow"
        }
      ]
    }

    const signedUrl = getSignedUrl({
      keyPairId: cfg.accessKeyId!,
      privateKey: cfg.secretAccessKey!,
      policy: JSON.stringify(policy)
    })
    const fixedSignedUrl = new URL(signedUrl)
    fixedSignedUrl.searchParams.set("response-content-disposition", disposition)

    await redisClient.set(cacheKey, fixedSignedUrl.href, {
      EX: expiry
    })
    return fixedSignedUrl.href
  }

  async deleteFile(key: string, bucket: string): Promise<void> {
    const s3 = this.s3[bucket]
    if (!key || !s3) {
      return
    }
    const uploads = await Upload.findAll({
      where: {
        sha256sum: key
      }
    })
    if (uploads.length === 0) {
      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
      })
      await s3.send(command)
      if (config.cloudflare?.enabled) {
        // get the cached cdn links to clear from the Cloudflare cache
        const signedUrls = await redisClient
          .keys(`s3SignedUrl:${key}:*`)
          .then((keys) =>
            Promise.all(
              keys.map(async (key) => {
                return redisClient.get(key)
              })
            )
          )
        await axios
          .post(
            `https://api.cloudflare.com/client/v4/zones/${config.cloudflare.zone}/purge_cache`,
            {
              files: signedUrls
            },
            {
              headers: {
                Authorization: `Bearer ${config.cloudflare.key}`,
                "Content-Type": "application/json"
              }
            }
          )
          .catch((e) => {
            console.error(e?.response?.data)
          })
      }
      await redisClient.del(`s3SignedUrl:${key}:*`)
    }
  }

  // async renameObject(oldKey: string, newKey: string) {
  //   if (!this.s3) {
  //     return
  //   }
  //
  //   try {
  //     const endpoint = `${config.aws!.endpoint}/${config.aws!.bucket}/${oldKey}`
  //     const destination = `${config.aws!.bucket}/${newKey}`
  //     const date = new Date().toUTCString()
  //
  //     // Construct the string to sign in canonical format
  //     const signingString = `MOVE\n\n\n\nx-amz-date:${date}\nDestination:/${destination}\n/${
  //       config.aws!.bucket
  //     }/${oldKey}`
  //
  //     // Create the HMAC SHA256 signature
  //     const signature = crypto
  //       .createHmac("sha256", config.aws!.secretAccessKey!)
  //       .update(signingString)
  //       .digest("base64")
  //
  //     // Make the MOVE request
  //     const res = await axios({
  //       method: "MOVE",
  //       url: endpoint,
  //       headers: {
  //         Destination: `/${destination}`,
  //         Authorization: `AWS ${config.aws!.accessKeyId}:${signature}`,
  //         "x-amz-date": date
  //       }
  //     })
  //     console.log(res)
  //     return res
  //   } catch (e) {
  //     console.error(e)
  //     return null
  //   }
  // }
}
