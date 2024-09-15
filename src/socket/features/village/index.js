import { Village, Chart } from './default.js'

const onFoundVillage = async ({ socketSession, content }) => {
  try {
    const founderId = await socketSession.getCharacter()

    new Village(socketSession, founderId, content.name).found()
  } catch (error) {
    console.log(error)
  }
}

const onPullChartMembers = async ({ socketSession }) => {
  const senderId = await socketSession.getCharacter()

  await Chart.pullChartMembers(socketSession.socket, senderId)
}

export {
  onFoundVillage,
  onPullChartMembers
}
