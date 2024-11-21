import { Service } from "typedi"
// TODO: I can't get the custom fqdn for signed URLs to work on new AWS API, for now we'll use the old one.
import {
  S3Client,
  HeadObjectCommand,
  DeleteObjectCommand
} from "@aws-sdk/client-s3"
import crypto from "crypto"
import { Upload } from "@app/models/upload.model"
import { Upload as S3Upload } from "@aws-sdk/lib-storage"
import fs from "fs"
import redisClient from "@app/redis"
import axios from "axios"

const PART_SIZE = 20 * 1024 * 1024

@Service()
export class AwsService {
  s3: S3Client | null = null
  constructor() {
    if (!config.aws?.enabled) {
      return
    }
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: config.aws.accessKeyId!,
        secretAccessKey: config.aws.secretAccessKey!
      },
      endpoint: config.aws.endpoint!
    })
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
    if (!this.s3) {
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
          Bucket: config.aws!.bucket!,
          Key: key
        })
        const data = await this.s3.send(command)
        console.log("Exists", data)
        exists = true
      } catch {}
      console.log(`Checking if ${key} exists, ${exists}`)
      const media =
        upload.type === "image" ||
        upload.type === "video" ||
        upload.type === "audio"
      const params = {
        Bucket: config.aws!.bucket!,
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
            client: this.s3,
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
        Location: `${config.aws!.bucketUrl}/${key}`,
        Key: key,
        Bucket: config.aws!.bucket!
      })
      await Upload.update(
        // use version 2
        { location: `${config.aws!.bucket!}/${key}:2`, sha256sum },
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
  // async getSignedUrl(
  //   key: string,
  //   filename: string,
  //   type: "attachment" | "inline" = "attachment",
  //   mimeType = "application/octet-stream",
  //   // 7 days
  //   expiry = 60 * 60 * 24 * 7
  // ): Promise<string> {
  //   if (!this.s3) {
  //     return ""
  //   }
  //   const cacheKey = `s3SignedUrl:${key}:${filename}:${type}:${mimeType}:${expiry}`
  //   const cached = await redisClient.get(cacheKey)
  //   // if cached version is 4d old, refresh it
  //   if (cached && (await redisClient.ttl(cacheKey)) > 60 * 60 * 24 * 4) {
  //     return cached
  //   }
  //   const params = {
  //     Bucket: config.aws!.bucket!,
  //     Key: key,
  //     Expires: expiry,
  //     ResponseContentDisposition: `${type}; filename="${filename}"`,
  //     ResponseContentType: mimeType
  //   }
  //   let signed = await this.s3.getSignedUrlPromise("getObject", params)
  //   if (config.aws!.bucketUrl)
  //     signed = signed.replace(
  //       `${config.aws!.endpoint}/${config.aws!.bucket}`,
  //       config.aws!.bucketUrl
  //     )
  //   await redisClient.set(cacheKey, signed, {
  //     EX: expiry
  //   })
  //   return signed
  // }

  async deleteFile(key: string): Promise<void> {
    if (!key || !this.s3) {
      return
    }
    const uploads = await Upload.findAll({
      where: {
        sha256sum: key
      }
    })
    console.log(uploads.length)
    if (uploads.length === 0) {
      const command = new DeleteObjectCommand({
        Bucket: config.aws!.bucket!,
        Key: key
      })
      await this.s3.send(command)
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
