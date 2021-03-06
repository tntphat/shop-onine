import { takeLatest, put, all, call, select } from "redux-saga/effects";
import axiosInstance from "../../helpers/axiosInstance";

import { selectCurrentUser } from "../user/user.selector";

import InvoiceActionTypes from "./invoice.types";

import {
  addInvoiceFailure,
  addInvoiceSuccess,
  fetchInvoicesSuccess,
  fetchInvoicesFailure,
  editInvoiceSuccess,
  editInvoiceFailure,
} from "./invoice.actions";

export function* payInvoice({ payload }) {
  try {
    const { setClientSecret, total } = payload;
    // const data = yield select(selectCurrentUser);
    const { data: clientSecret } = yield axiosInstance.post(
      "/invoice/pay",
      { total },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setClientSecret(clientSecret.clientSecret);
  } catch (error) {
    // yield put(signOutFailure(error));
  }
}

export function* addInvoice({ payload }) {
  try {
    const {
      products,
      total_price,
      productsQuantityLeft,
      clearCart,
      setNotify,
      productsPurchased,
      obj,
      history,
    } = payload;
    const curUser = yield select(selectCurrentUser);
    if (!curUser) {
      yield setNotify({
        isOpen: true,
        message: "Pls sign in before paying",
        type: "error",
      });
    } else {
      obj.paid = Boolean(+obj.paid);
      const { data } = yield axiosInstance.post(
        "/invoice",
        { products, total_price, productsQuantityLeft, productsPurchased, obj },
        {
          headers: {
            Authorization: "Bearer " + curUser.token,
          },
        }
      );

      yield setNotify({
        isOpen: true,
        message: "Bn đã pay thành công",
        type: "success",
      });
      yield clearCart();
      yield put(addInvoiceSuccess(data));
      yield setTimeout(() => {
        history.push("/products");
      }, 1000);
    }
  } catch (error) {
    yield put(addInvoiceFailure(error.response.data));
  }
}

export function* editInvoice({ payload }) {
  try {
    const { data } = yield axiosInstance.patch("/invoice", payload);
    yield put(editInvoiceSuccess(data));
  } catch (e) {
    yield put(editInvoiceFailure());
  }
}

export function* fetchUserInvoices() {
  try {
    const curUser = yield select(selectCurrentUser);
    const { data } = yield axiosInstance.get("/invoice/user", {
      headers: {
        Authorization: "Bearer " + curUser.token,
      },
    });
    if (process.env.NODE_ENV !== "development") {
      data.forEach((invoice) => {
        invoice.products.forEach((product) => {
          if (product.product_id)
            product.product_id.imgs = product.product_id.imgs.replace(
              "http://localhost:5000",
              "https://shop-onl-tntp.herokuapp.com"
            );
        });
      });
    }
    yield put(fetchInvoicesSuccess(data));
  } catch (error) {
    yield put(fetchInvoicesFailure(error));
  }
}

export function* fetchInvoices() {
  try {
    const { data } = yield axiosInstance.get("/invoice");
    console.log("data: ", data);
    if (process.env.NODE_ENV !== "development") {
      data.forEach((invoice) => {
        invoice.products.forEach((product) => {
          if (product.product_id)
            product.product_id.imgs = product.product_id.imgs.replace(
              "http://localhost:5000",
              "https://shop-onl-tntp.herokuapp.com"
            );
        });
      });
    }

    yield put(fetchInvoicesSuccess(data));
  } catch (error) {
    yield put(error);
  }
}

export function* onAddInvoiceStart() {
  yield takeLatest(InvoiceActionTypes.ADD_INVOICE_START, addInvoice);
}

export function* onEditInvoiceStart() {
  yield takeLatest(InvoiceActionTypes.EDIT_INVOICE_START, editInvoice);
}

export function* onFetchInvoicesStart() {
  yield takeLatest(InvoiceActionTypes.FETCH_INVOICES_START, fetchInvoices);
}

export function* onFetchUserInvoicesStart() {
  yield takeLatest(
    InvoiceActionTypes.FETCH_USER_INVOICES_START,
    fetchUserInvoices
  );
}

export function* onPayInvoiceStart() {
  yield takeLatest(InvoiceActionTypes.PAY_INVOICE_START, payInvoice);
}

export function* invoiceSagas() {
  yield all([
    call(onAddInvoiceStart),
    call(onFetchInvoicesStart),
    call(onEditInvoiceStart),
    call(onPayInvoiceStart),
    call(onFetchUserInvoicesStart),
  ]);
}
