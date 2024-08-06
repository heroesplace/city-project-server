import { DisplayableError } from '../../errors.js'

// Types work as intended
class MailError extends DisplayableError {
  static types = [
    'SELF_MAIL',
    'CHARACTER_NOT_FOUND',
    'INVALID_CATEGORY',
    'MAIL_NOT_FOUND',
    'ALREADY_INVITED',
    'REPLY_NOT_ALLOWED'
  ]
}

export {
  MailError
}