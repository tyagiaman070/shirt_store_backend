const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  //aak baar remove karka dekhyo it optimizes our application only photo
  photo,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//Parameters data fetch
router.param("userId", getUserById);
router.param("productId", getProductById);

//Actual Routes
//create routes
router.post(
  "/product/create/:userId",
  /*[
  check("name", "name should be at least 3 char").isLength({
    min: 3
  }),
  check("description", "description should be at least 10 char").isLength({
    min: 10
  }),
  check("price", "Price should be at least 2 char").isLength({
    min: 2
  }),
  check("category", "Category is required").isLength({
    min: 1
  }),
  check("stock", "Stock is required").isLength({
    min: 1
  })
],*/
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);
//get product with pic or read routes
router.get("/product/:productId", getProduct);
//aak baar remove karka dekhyo it optimizes our application only photo
router.get("/product/photo/:productId", photo);

//deleting
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

//update
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//Listing routes
router.get("/products", getAllProducts);

//get All category
router.get("/products/categories", getAllUniqueCategories);
module.exports = router;
