import { createSelector } from "reselect";
import { subtractTimeByString } from "../../helpers/date-time";

const selectProduct = (state) => state.product;

export const selectProducts = createSelector(
  [selectProduct],
  (product) => product.products
);

export const selectIsProductsFetching = createSelector(
  [selectProduct],
  (product) => product.isFetching
);

export const selectIsProductsLoaded = createSelector(
  [selectProduct],
  (product) => !product.products.length
);

export const selectProductSpecified = (productUrlParam) =>
  createSelector([selectProducts], (productsData) => {
    let b = null;
    productsData.forEach((product) => {
      if (product._id === productUrlParam) b = product;
    });
    return b;
  });

function nonAccentVietnamese(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

const filterSearchByKw = (arr, kw) => {
  let res = new Set();
  const newKw = kw.toLowerCase().trim();
  const words = nonAccentVietnamese(newKw).split(" ");
  console.log("words");
  words.forEach((word) => {
    arr
      .filter((element) => {
        return nonAccentVietnamese(element.name.toLowerCase()).includes(word);
      })
      .forEach((newE) => {
        res.add(newE);
      });
  });
  return Array.from(res);
};

const filterBySort = (arr, valueSort) => {
  switch (+valueSort) {
    case 1:
      return arr.sort((a, b) => -a.purchased + b.purchased);
    case 2:
      // return arr.sort((a, b) => -new Date(a.createdAt) + new Date(b.createdAt));
      return arr.sort((a, b) => subtractTimeByString(a.createdAt, b.createdAt));
    case 3:
      return arr.sort((a, b) => a.price - b.price);
    case 4:
      return arr.sort((a, b) => -a.price + b.price);
    default:
      return arr;
  }
};

const filterByCategory = (productsData, categoryId, subCategoryId) =>
  (subCategoryId &&
    productsData.filter(
      (product) => product.sub_category_id.slug === subCategoryId
    )) ||
  (categoryId &&
    productsData.filter((product) => {
      return product.category_id && product.category_id.slug === categoryId;
    })) ||
  productsData;

const filterByRange = (products, from, to) =>
  products.filter((product) => product.price >= from && product.price <= to);

const findMax = (products) => {
  let max = 0;
  products.forEach((product) => {
    max = (product.price > max && product.price) || max;
  });
  return max;
};

export const selectProductsByFiler = (
  categoryId,
  subCategoryId,
  kw,
  sortValue,
  from,
  to,
  quantity
) =>
  createSelector([selectProducts], (productsState) => {
    var productsData = JSON.parse(JSON.stringify(productsState));
    productsData = (kw && filterSearchByKw(productsData, kw)) || productsData;
    productsData = filterByCategory(productsData, categoryId, subCategoryId);
    const max = findMax(productsData);
    productsData =
      (from && to && filterByRange(productsData, from, to)) || productsData;
    productsData =
      (sortValue && filterBySort(productsData, sortValue)) || productsData;

    productsData =
      (quantity && productsData.slice(0, quantity)) || productsData;

    return { products: productsData, max };
  });

const selectTopExcept = (productsData, id, n) => {
  let count = 0;
  const res = [];
  for (let i = 0; i < productsData.length && count < n; ++i) {
    if (productsData[i]._id !== id) {
      res.push(productsData[i]);
      count++;
    }
  }
  return res;
};

export const selectProductsByProduct = (product) =>
  createSelector([selectProducts], (productsState) => {
    var productsData = JSON.parse(JSON.stringify(productsState));
    productsData = filterByCategory(productsData, product.category_id.slug);
    productsData = filterBySort(productsData, 1);
    productsData = selectTopExcept(productsData, product._id, 4);
    console.log("product: ", productsData);

    return productsData;
  });

const selectProductsByCategory = (categoryId, productsState) => {
  var productsData = JSON.parse(JSON.stringify(productsState));
  productsData = filterByCategory(productsData, categoryId);
  productsData = filterBySort(productsData, 1);
  // productsData = selectTopExcept(productsData, null, 6);

  return productsData.slice(0, 6);
};

export const selectTopsProductsByCategories = (categories) =>
  createSelector([selectProducts], (productsState) => {
    // var productsData = JSON.parse(JSON.stringify(productsState));
    const arrsProducts = [];
    // for (let i = 0; i < categories.length; ++i) arrsProducts.push([]);
    categories.forEach((category, i) => {
      arrsProducts.push(selectProductsByCategory(category.slug, productsState));
      // console.log("test: ", category._id, arrsProducts[i]);
    });
    // productsData = filterByCategory(productsData, product.category_id.slug);
    // productsData = filterBySort(productsData, 1);
    // productsData = selectTopExcept(productsData, product._id, 4);
    // console.log("product: ", productsData);

    return arrsProducts;
  });

export const selectErrors = createSelector(
  [selectProduct],
  (product) => product.error
);
