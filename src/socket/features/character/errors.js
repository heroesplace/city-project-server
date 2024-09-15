import { DisplayableError } from '../../errors.js'

class CharacterError extends DisplayableError {
  static types = [
    'CHARACTER_NOT_FOUND',
    'IS_VILLAGE_MEMBER',
    'EMPTY_CHARACTER_NAME'
  ]
}

export {
  CharacterError
}