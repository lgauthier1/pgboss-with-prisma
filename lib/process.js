export const initiProcessHandler = async () => {
  // CTRL+C
  process.on('SIGINT', () => {
    console.log('SIGINT')
    process.exit()
  })
  // Keyboard quit
  process.on('SIGQUIT', () => {
    console.log('SIGQUIT')
    process.exit()
  })
  // `kill` command
  process.on('SIGTERM', () => {
    console.log('SIGTERM')
    process.exit()
  })
}
