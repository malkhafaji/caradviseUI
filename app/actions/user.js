import { postJSON, putJSON, deleteJSON } from '../utils/fetch';

const SIGN_UP_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/users';
const SIGN_IN_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/sessions/';
const SIGN_OUT_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/sessions/destroy';
const VEHICLES_URL = 'http://ec2-52-34-200-111.us-west-2.compute.amazonaws.com:3000/api/v1/vehicles/';

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

export function signUp(data) {
  return async function(dispatch) {
    dispatch(setUserLoading());

    let response = await postJSON(SIGN_UP_URL, data);
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
    let response = await deleteJSON(SIGN_OUT_URL, { authentication_token });

    if (response.error) {
      dispatch(setUserError(response.error));
    } else {
      dispatch(removeUser());
    }
  };
}

export function updateInfo(data) {
  return async function(dispatch, getState) {
    dispatch(setUserLoading());

    let { authentication_token, customerNumber } = getState().user || {};
    let url = `${SIGN_UP_URL}/${customerNumber}`;
    let response = await putJSON(url, data, { Authorization: authentication_token });

    if (response.result) {
      dispatch(setUserData(response.result.user));
    } else {
      dispatch(setUserError(response.error));
    }

    dispatch(updateVehicle({ miles: data.miles }));
  }
}

export function updateVehicle(data) {
  return async function(dispatch, getState) {
    dispatch(setUserLoading());

    let user = getState().user || {};
    let { authentication_token, vehicles } = user;
    let url = `${VEHICLES_URL}/${vehicles[0].id}`;
    let response = await putJSON(url, data, { Authorization: authentication_token });

    if (response.result) {
      user.loading = false;
      user.error = null;
      user.vehicles = [response.result.vehicle];

      dispatch(setUserData(user));
    } else {
      dispatch(setUserError(response.error));
    }
  }
}
