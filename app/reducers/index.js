import { combineReducers } from 'redux';
import { LOAD_STATE } from '../actions';
import user from './user';

const combinedReducers = combineReducers({ user });

export default function rootReducer(state={}, action) {
  if (action.type === LOAD_STATE)
    return { ...action.state };
  else
    return combinedReducers(state, action);
}
