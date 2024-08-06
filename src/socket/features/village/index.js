import { Village } from './default.js'

const onFoundVillage = async ({ socketSession, content }) => {
  try {
    const founderId = await socketSession.getCharacter()

    new Village(socketSession, founderId, content.name).found()
  } catch (error) {
    console.log(error)
  }
}

export {
  onFoundVillage
}
