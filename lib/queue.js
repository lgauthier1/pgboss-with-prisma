import PgBoss from 'pg-boss'

export class Queue {
  constructor(databaseUrl) {
    this.boss = new PgBoss(databaseUrl)
    this.boss.on('error', (error) => console.error(error))
  }

  async start() {
    await this.boss.start()
  }

  async initQueue(queueName, callback) {
    await this.boss.work(queueName, callback)
  }

  async addJob(queueName, params = {}) {
    const jobId = await this.boss.send(queueName, params)
    console.log(`created job in queue ${queueName}: ${jobId}`)
  }
}
