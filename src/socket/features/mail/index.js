import { Character } from '../character/default.js'

import { Mail } from './default.js'
import { MailFactory } from './factory.js'

const onSendMail = async ({ socketSession, content }) => {
  try {
    const senderId = await socketSession.getCharacter()
    const receiverId = await Character.resolve(content.receiver)

    const mail = await MailFactory.createMail(socketSession, senderId, receiverId, content.category)
    await mail.sendMail()
  } catch (e) {
    console.log(e)
  }
}

const onPullMails = async ({ socketSession }) => {
  const receiverId = await socketSession.getCharacter()
  const mails = await Mail.pullMails(receiverId)

  socketSession.socket.emit('pull_mails', { mails })
}

const onReplyMail = async ({ socketSession, content }) => {
  const { mailId, answer } = content

  try {
    const mail = await MailFactory.getMailById(socketSession, mailId)

    if (mail.receiverId !== await socketSession.getCharacter()) {
      throw new MailError('REPLY_NOT_ALLOWED')
    }

    await mail.replyMail(answer)
  } catch (e) {
    console.log(e)
  }
}

export { onSendMail, onPullMails, onReplyMail }