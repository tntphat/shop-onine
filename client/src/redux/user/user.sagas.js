import { takeLatest, put, all, call, select } from "redux-saga/effects";
import axios from "axios";
import Cookies from "js-cookie";

import UserActionTypes from "./user.types";
import {
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
  signUpSuccess,
  signUpFailure,
  fetchEmployeesSuccess,
  fetchEmployeesFailure,
  addEmployeeSuccess,
} from "./user.actions";

import { selectCurrentUser } from "./user.selector";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
});

export function* signIn({ payload: { email, password } }) {
  try {
    console.log("helo from saga SIGN IN ");
    const { data } = yield axiosInstance.post("/user/sign-in", {
      email,
      password,
    });
    console.log(data);
    yield Cookies.set("user", JSON.stringify(data));
    yield put(signInSuccess(data));
  } catch (error) {
    yield put(signInFailure(error.response.data));
  }
}

export function* signUp({ payload }) {
  try {
    console.log("helo from saga SIGN Up ");
    const { notClient, ...others } = payload;
    others.isNotClient = notClient && 1;
    const { data } = yield axiosInstance.post("/user/register", others);
    if (!notClient) {
      yield Cookies.set("user", JSON.stringify(data));

      yield put(signUpSuccess(data));
    } else {
      yield put(addEmployeeSuccess(data));
    }
  } catch (error) {
    yield put(signUpFailure(error.response.data));
  }
}

export function* isUserAuthenticated() {
  try {
    const data = yield Cookies.get("user");
    console.log(!data);
    const curUser = yield select(selectCurrentUser);
    if (!data) {
      if (curUser) yield signOut();
      return;
    }
    yield put(signInSuccess(JSON.parse(data)));
  } catch (error) {
    yield put(signInFailure(error));
  }
}

export function* signOut() {
  try {
    yield Cookies.remove("user");
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailure(error));
  }
}

export function* fetchEmployees() {
  try {
    console.log("helo from saga FETCH EMPLOYEES");
    const { data } = yield axiosInstance.get("/user/employees");
    console.log("emplyees:", data);
    yield put(fetchEmployeesSuccess(data));
  } catch (error) {
    yield put(fetchEmployeesFailure(error));
  }
}

export function* testHeader() {
  try {
    const data = yield select(selectCurrentUser);
    console.log(data);
    yield axiosInstance.post(
      "/test",
      { data: 1 },
      {
        headers: {
          Authorization: "Bearer " + data.token,
        },
      }
    );
  } catch (error) {
    console.log(error);
    // yield put(signOutFailure(error));
  }
}

export function* onSignInStart() {
  yield takeLatest(UserActionTypes.SIGN_IN_START, signIn);
}

export function* onSignUpStart() {
  yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignOutStart() {
  yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onCheckUserSession() {
  yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onFetchEmployeesStart() {
  yield takeLatest(UserActionTypes.FETCH_EMPLOYEES_START, fetchEmployees);
}

export function* onTestHeader() {
  yield takeLatest(UserActionTypes.TEST_HEADER, testHeader);
}

export function* userSagas() {
  yield all([
    call(onSignInStart),
    call(onSignUpStart),
    call(onCheckUserSession),
    call(onSignOutStart),
    call(onTestHeader),
    call(onFetchEmployeesStart),
  ]);
}
