import { takeLatest, put, all, call } from "redux-saga/effects";
import axiosInstance from "../../helpers/axiosInstance";

import CategoryActionTypes from "./category.types";

import {
  addCategoryFailure,
  addCategorySuccess,
  editCategorySuccess,
  editCategoryFailure,
  deleteCategorySuccess,
  deleteCategoryFailure,
  addSubCategoryFailure,
  addSubCategorySuccess,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
} from "./category.actions";

export function* addCategory({ payload }) {
  try {
    const { data } = yield axiosInstance.post("/categories/add", payload);
    yield put(addCategorySuccess(data));
  } catch (error) {
    yield put(addCategoryFailure(error.response.data));
  }
}

export function* editCategory({ payload }) {
  try {
    const { data } = yield axiosInstance.patch("/categories/edit", payload);
    yield put(editCategorySuccess(data));
  } catch (error) {
    yield put(editCategoryFailure(error.response.data));
  }
}

export function* deleteCategory({ payload }) {
  try {
    const { data } = yield axiosInstance.delete("/categories/delete", {
      data: {
        id: payload,
      },
    });
    yield put(deleteCategorySuccess(payload));
  } catch (error) {
    yield put(deleteCategoryFailure(error.response.data));
  }
}

export function* addSubCategory({ payload }) {
  try {
    const { data } = yield axiosInstance.post("/sub-categories/add", payload);
    yield put(addSubCategorySuccess(data));
  } catch (error) {
    yield put(addSubCategoryFailure(error.response.data));
  }
}

export function* fetchCategories() {
  try {
    const { data } = yield axiosInstance.get("/categories");
    yield put(fetchCategoriesSuccess(data));
  } catch (error) {
    yield put(fetchCategoriesFailure(error.response.data));
  }
}

export function* onAddCategoryStart() {
  yield takeLatest(CategoryActionTypes.ADD_CATEGORY_START, addCategory);
}

export function* onEditCategoryStart() {
  yield takeLatest(CategoryActionTypes.EDIT_CATEGORY_START, editCategory);
}

export function* onDeleteCategoryStart() {
  yield takeLatest(CategoryActionTypes.DELETE_CATEGORY_START, deleteCategory);
}

export function* onFetchCategoriesStart() {
  yield takeLatest(CategoryActionTypes.FETCH_CATEGORIES_START, fetchCategories);
}

export function* onAddSubCategoryStart() {
  yield takeLatest(CategoryActionTypes.ADD_SUBCATEGORY_START, addSubCategory);
}

export function* categorySagas() {
  yield all([
    call(onAddCategoryStart),
    call(onEditCategoryStart),
    call(onDeleteCategoryStart),
    call(onAddSubCategoryStart),
    call(onFetchCategoriesStart),
  ]);
}
