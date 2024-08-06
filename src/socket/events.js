import { onFoundVillage } from './features/village/index.js'
import { onSendMail, onPullMails, onReplyMail } from './features/mail/index.js'
import { onPullChartMembers } from './features/village/chart.js'

const events = {
  send_mail: onSendMail,
  pull_mails: onPullMails,
  reply_mail: onReplyMail,

  found_village: onFoundVillage,
  pull_chart_members: onPullChartMembers
}

export { events }