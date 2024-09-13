import { DisplayableError } from '../../errors.js'

// Types work as intended
class VillageError extends DisplayableError {
  static types = [
    'VILLAGE_NOT_FOUND',
    'VILLAGE_NAME_TAKEN',
    'ALREADY_VILLAGER',
    'EMPTY_CHART',
  ]
}

export {
  VillageError
}