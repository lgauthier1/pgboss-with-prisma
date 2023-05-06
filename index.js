import { Queue } from './lib/queue.js'
import { watch } from 'chokidar'
import { initiProcessHandler } from './lib/process.js'
import { PrismaClient } from '@prisma/client'

// sleep function to simulate some async job
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fileProcessor(job) {
  const prisma = new PrismaClient()
  console.log(`job ${job.id} is running ${job.data.path}}`)
  await sleep(1000)
  await prisma.file.create({
    data: {
      filename: job.data.path
    }
  })
  console.log('after create')
  const allFile = await prisma.file.findMany()
  console.log(allFile)
  await prisma.$disconnect()
  console.log(`job ${job.id} is done`)
}

const run = async () => {
  initiProcessHandler()
  const queue = new Queue(
    'postgres://postgres:mysecretpassword@localhost/mydatabase?schema=public'
  )
  await queue.start()
  await queue.initQueue('file-to-process', fileProcessor)

  watch(process.env.WATCH_FOLDER || 'watch_folder', { ignoreInitial: true }).on(
    'add',
    (path) => {
      queue.addJob('file-to-process', { path })
    }
  )
}

run()
