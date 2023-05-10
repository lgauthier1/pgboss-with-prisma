import { Queue } from './lib/queue.js'
import { watch } from 'chokidar'
import { initiProcessHandler } from './lib/process.js'
import { PrismaClient } from '@prisma/client'

// sleep function to simulate some async job
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function fileProcessor2(job) {
  console.log('------------- 2222')
  console.log(`------------- 2222 job ${job.id} is done`)
}

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
    'postgres://postgres:mysecretpassword@localhost/mydatabase?schema=public',
    'file-to-process',
    fileProcessor
  )
  const queue2 = new Queue(
    'postgres://postgres:mysecretpassword@localhost/mydatabase?schema=public',
    'file-to-process-2',
    fileProcessor2
  )
  await queue.start()
  await queue2.start()

  watch(process.env.WATCH_FOLDER || 'watch_folder', { ignoreInitial: true })
    .on('add', (path) => {
      queue.addJob({ path })
    })
    .on('add', (path) => {
      queue2.addJob({ path })
    })
}

run()
