import multer from "multer"
import cryptoRandomString from "crypto-random-string"
import path from "path"
import os from "os"

const config = process.env.CONFIG
  ? JSON.parse(process.env.CONFIG || "{}")
  : require(global.appRoot + "/config/tpu.json")

const storage: multer.StorageEngine = multer.diskStorage({
  destination:
    process.env.NODE_ENV === "test"
      ? `${os.homedir()}/test_uploads/`
      : process.env.STORAGE_ROOT,

  filename: (req, file: Express.Multer.File, cb): void => {
    console.log(file)
    cb(
      null,
      cryptoRandomString({ length: 12 }) + path.extname(file.originalname)
    )
  }
})
//
// const s3 = multerS3({
//   s3: new S3({
//     credentials: {
//       accessKeyId: config.aws?.accessKeyId!,
//       secretAccessKey: config.aws?.secretAccessKey!
//     },
//     endpoint: config.aws?.endpoint!,
//     region: config.aws?.region!
//   }),
//   bucket: config.aws?.bucket!,
//   metadata: function (req, file, cb) {
//     console.log(file)
//     cb(null, {
//       fieldName: file.fieldname
//     })
//   },
//   key: function (req, file, cb) {
//     cb(null, Date.now().toString())
//   }
// })

const uploader = multer({
  storage,
  limits: {
    files: 20
  }
})

const uploaderSmall = multer({
  limits: { fileSize: 2097152 },
  storage
})

export default uploader
export { uploaderSmall }
