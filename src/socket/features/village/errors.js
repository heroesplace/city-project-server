import { DisplayableError } from '../../errors.js'

// Types work as intended
class VillageError extends DisplayableError {
  static types = [
    'VILLAGE_NOT_FOUND',
    'VILLAGE_NAME_TAKEN',
    'ALREADY_VILLAGER',
    'EMPTY_CHART',
    'NOT_ALLOWED_TO_SEND_INVITE',
    'NOT_ALLOWED_TO_RECEIVE_INVITE',
  ]
}

export {
  VillageError
}