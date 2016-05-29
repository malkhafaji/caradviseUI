import { postJSON } from '../utils/fetch';

const SIGN_UP_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/users';
const SIGN_IN_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/sessions/';
const SIGN_OUT_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/sessions/destroy';

export const USER_LOADING = 'USER_LOADING';
function setUserLoading() {
  return { type: USER_LOADING };
}

export const USER_ERROR = 'USER_ERROR';
function setUserError(error) {
  return { type: USER_ERROR, error };
}

export const USER_DATA = 'USER_DATA';
function setUserData(user) {
  return { type: USER_DATA, user };
}

export const REMOVE_USER = 'REMOVE_USER';
function removeUser() {
  return { type: REMOVE_USER };
}

export function signUp({ email, password }) {
  return async function(dispatch) {
    dispatch(setUserLoading());

    let response = await postJSON(SIGN_UP_URL, { email, password });
    if (response.result) {
      dispatch(setUserData(response.result.user));
    } else {
      dispatch(setUserError(response.error));
    }
  };
}

export function signIn({ email, password }) {
  return async function(dispatch) {
    dispatch(setUserLoading());

    let response = await postJSON(SIGN_IN_URL, { email, password });
    if (response.result) {
      dispatch(setUserData(response.result.user));
    } else {
      dispatch(setUserError(response.error));
    }
  };
}

export function signOut() {
  return async function(dispatch, getState) {
    dispatch(setUserLoading());

    let { authentication_token } = getState().user || {};
    let response = await postJSON(SIGN_OUT_URL, { authentication_token });

    if (response.error) {
      dispatch(setUserError(response.error));
    } else {
      dispatch(removeUser());
    }
  };
}
