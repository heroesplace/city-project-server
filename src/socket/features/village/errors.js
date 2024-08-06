import { DisplayableError } from '../../errors.js'

// Types work as intended
class VillageErrors extends DisplayableError {
  static types = [
    'ALREADY_MEMBER',
    'EMPTY_CHART'
  ]
}

export {
  MailError
}