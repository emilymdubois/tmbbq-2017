import * as Constants from '../constants'

const initialState = {
  activeId: null
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case Constants.SET_ACTIVE_ID: {
      return Object.assign({}, state, {
        activeId: action.activeId
      });
    }
    case Constants.SET_VALID_IDS: {
      return Object.assign({}, state, {
        validIds: action.validIds
      });
    }
    case Constants.SET_RATING: {
      return Object.assign({}, state, {
        rating: action.rating
      });
    }
    case Constants.SET_OPENED: {
      return Object.assign({}, state, {
        opened: action.opened
      });
    }
    case Constants.SET_PITMASTER_AGE: {
      return Object.assign({}, state, {
        pitmasterAge: action.pitmasterAge
      });
    }
    case Constants.SET_OPEN: {
      return Object.assign({}, state, {
        open: action.open
      });
    }
    case Constants.SET_METHOD: {
      return Object.assign({}, state, {
        method: action.method
      });
    }
    default:
      return state;
  }
}

export { reducer, initialState };
