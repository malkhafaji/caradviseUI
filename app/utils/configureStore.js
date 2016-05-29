import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import storage from './storage';
import rootReducer from '../reducers';

const saveMiddleware = store => next => action => {
  const result = next(action);
  storage.set('caradvise:state', store.getState());
  return result;
};

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware, saveMiddleware)
  );
}
