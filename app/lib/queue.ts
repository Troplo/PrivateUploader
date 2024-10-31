import { Queue, Worker } from "bullmq"
import { Container } from "typedi"
import os from "os"
import cluster from "cluster"

// Import Libs
import utils from "@app/lib/utils"

// Import Services
import { CacheService } from "@app/services/cache.service"
import { AwsService } from "@app/services/aws.service"

const config = JSON.parse(process.env.CONFIG || "{}")
const cpuCount: number = os.cpus().length
const mainWorker: boolean =
  !cluster.worker || cluster.worker?.id % cpuCount === 1

const cacheService = Container.get(CacheService)
const awsService = Container.get(AwsService)
const connection: {
  port: number
  host: string
  password?: string
  db?: number
  username?: string
} = {
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.password,
  db: config.redis.db,
  username: config.redis.username
}

const queue: Queue = new Queue("queue:uploads", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  }
})

const cacheQueue: Queue = new Queue("queue:cache", {
  connection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: true,
    removeOnFail: true,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  }
})

const awsQueue: Queue = new Queue("queue:aws", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    removeOnComplete: true,
    removeOnFail: false,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  }
})

let worker, cacheWorker, awsWorker
// Register the worker for only the main thread to avoid the function running multiple times
if (mainWorker) {
  worker = new Worker(
    "queue:uploads",
    async (job): Promise<void> => {
      if (mainWorker) await utils.postUpload(job.data)
    },
    {
      // Maximum number of jobs that can run concurrently.
      // Another way is removing this option and making multiple workers like worker1, worker2, etc
      concurrency: 3,
      connection
    }
  )

  cacheWorker = new Worker(
    "queue:cache",
    async (job): Promise<void> => {
      if (mainWorker) await cacheService.resetCollectionCache(job.data)
    },
    {
      // Maximum number of jobs that can run concurrently.
      // Another way is removing this option and making multiple workers like worker1, worker2, etc.
      concurrency: 3,
      connection
    }
  )

  awsWorker = new Worker(
    "queue:aws",
    async (job): Promise<void> => {
      if (mainWorker) {
        if (!mainWorker) return
        if (!job.name) return
        await awsService.uploadFile(
          [
            {
              attachment: job.name
            }
          ],
          job.data?.localFileMode || "delete"
        )
      }
    },
    {
      concurrency: 10,
      connection
    }
  )

  worker.on("completed", (job): void => {
    console.log(`[Queue/Upload] Job ${job.id} completed!`)
  })
  worker.on("failed", (job, err: Error): void => {
    console.log(`[Queue/Upload] Job ${job?.id} failed with error ${err}`)
  })
  cacheWorker.on("completed", (job): void => {
    console.log(`[Queue/Cache] Job ${job.id} completed!`)
  })
  cacheWorker.on("failed", (job, err: Error): void => {
    console.log(`[Queue/Cache] Job ${job?.id} failed with error ${err}`)
  })
  awsWorker.on("completed", (job): void => {
    console.log(`[Queue/S3] Job ${job.id} completed!`)
  })
  awsWorker.on("failed", (job, err: Error): void => {
    console.log(
      `[Queue/S3] Job ${job?.id} failed with error ${err}. Attachment ${job?.name} needs investigating`
    )
  })
}

export default {
  queue,
  worker,
  cacheWorker,
  cacheQueue,
  awsQueue,
  awsWorker
}
