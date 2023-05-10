import PgBoss from 'pg-boss'

export class Queue {
  constructor(databaseUrl, queueName, callback) {
    this.boss = new PgBoss(databaseUrl)
    this.boss.on('error', (error) => console.error(error))
    this.queueName = queueName
    this.callback = callback
  }

  async start() {
    await this.boss.deleteQueue(this.queueName)
    await this.boss.start()
    await this.boss.work(this.queueName, this.callback)
  }

  async addJob(params = {}) {
    const jobId = await this.boss.send(this.queueName, params)
    console.log(`created job in queue ${this.queueName}: ${jobId}`)
  }
}
