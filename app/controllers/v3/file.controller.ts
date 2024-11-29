import { Controller, Get, Param, QueryParam, Res } from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import { User } from "@app/models/user.model"
import Errors from "@app/lib/errors"
import { GalleryService } from "@app/services/gallery.service"
import { CacheService } from "@app/services/cache.service"
import { Upload } from "@app/models/upload.model"
import fs from "fs"
import { Response } from "express"
import { promisify } from "util"
import path from "path"
import { AwsService } from "@app/services/aws.service"

@Service()
@Controller("/i/")
export class FileControllerV3 {
  constructor(
    private readonly galleryService: GalleryService,
    private readonly cacheService: CacheService,
    private readonly awsService: AwsService
  ) {}

  @Get(":attachment")
  async getFile(
    @Auth("uploads.view", false, true) user: User,
    @Param("attachment") attachment: string,
    @QueryParam("force") force: boolean,
    @Res() res: Response
  ) {
    const upload = await Upload.findOne({
      where: {
        attachment
      },
      attributes: [
        "attachment",
        "originalFilename",
        "name",
        "type",
        "location",
        "sha256sum",
        "mimeType",
        "userId"
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["banned"]
        }
      ]
    })
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'none'; media-src *; img-src *; style-src 'unsafe-inline';"
    )
    if (config.release === "dev" && (!upload || upload.location === "local")) {
      try {
        await fs.accessSync(
          global.storageRoot + "/" + attachment,
          fs.constants.F_OK
        )
      } catch {
        res.redirect("https://i.troplo.com/i/" + attachment)
        return res
      }
    }
    if (!upload) {
      throw Errors.NOT_FOUND
    }

    const media =
      upload.type === "image" ||
      upload.type === "video" ||
      upload.type === "audio"
    if (upload.location !== "local") {
      // file = await this.awsService.retrieveFile(upload.sha256sum)
      const path = upload.location.split(":")[0]
      const version = upload.location.split(":")[1]
      if (version === "2") {
        res.redirect(`https://${path}`)
        return res
      } else {
        console.log(upload.location)
        const link = await this.awsService.getSignedUrl(
          path.split("/")[1],
          upload.name,
          force || !media ? "attachment" : "inline",
          upload.mimeType,
          upload.location.split("/")[0]
        )
        res.redirect(link)
        return res
      }
    }

    // We will render in the browser if it's an image, video, or audio
    res.setHeader(
      "Content-Disposition",
      `${force || !media ? "attachment" : "inline"}; filename="${
        upload.originalFilename
      }"`
    )
    // Stream instead due to large files (2GiB+) breaking. More efficient
    const filePath = `${global.storageRoot}/${attachment}`
    const stat = await fs.promises.stat(filePath)
    res.setHeader("Content-Length", stat.size)
    res.setHeader("Content-Type", upload.mimeType)
    return new Promise<Response>((resolve, reject) => {
      const stream = fs.createReadStream(filePath)
      stream.pipe(res)
      stream.on("end", () => resolve(res))
      stream.on("error", (error) => reject(error))
    })
  }
}
