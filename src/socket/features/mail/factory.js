import { MailError } from './errors.js'
import { MailChart } from './default.js'
import db from '../../../database/postgresql/index.js'

class MailFactory {
  static async createMail(socketSession, senderId, receiverId, category) {
    switch (category) {
      case 'chart':
        return new MailChart(socketSession, senderId, receiverId)
      case 'message':
        // TODO: Implement message invite
          break
      case 'village':
        // TODO: Implement village invite
            break
      default:
        throw new MailError('INVALID_CATEGORY')
    }
  }

  static async getMailById(socketSession, mailId) {
    const r = await db.query('SELECT * FROM mails WHERE id = $1', [mailId])

    if (r.rows.length === 0) throw new MailError('MAIL_NOT_FOUND')

    return MailFactory.createMail(socketSession, r.rows[0].sender_id, r.rows[0].receiver_id, r.rows[0].category)
  }
}

export { MailFactory }