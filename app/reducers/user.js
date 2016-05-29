import {
  USER_DATA,
  USER_LOADING,
  USER_ERROR,
  REMOVE_USER
} from '../actions/user';

export default function user(state={}, action) {
  switch(action.type) {
    case USER_DATA:
      return { ...action.user };
    case USER_LOADING:
      return { ...state, loading: true, error: null };
    case USER_ERROR:
      return { ...state, loading: false, error: action.error };
    case REMOVE_USER:
      return {};
    default:
      return state;
  }
}
