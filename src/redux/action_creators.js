import * as Constants from '../constants'

export const setActiveId = activeId => {
  return { type: Constants.SET_ACTIVE_ID, activeId };
}

export const setValidIds = validIds => {
  return { type: Constants.SET_VALID_IDS, validIds };
}

export const setRating = rating => {
  return { type: Constants.SET_RATING, rating };
}

export const setOpened = opened => {
  return { type: Constants.SET_OPENED, opened };
}
