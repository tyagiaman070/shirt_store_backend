const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

//get product by ID
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "No product found in DB",
        });
      }
      req.product = product;
      next();
    });
};

//create product
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        //aagr koi yaha taak pocha ha matlab vo admin ha lakin usski image ma kuch dekat ha ya to vo bhoot badi ha ya fhir not uploadable
        error: "Not able save product due to the image problem",
      });
    }

    //destructure the fields
    const { name, price, category, description, stock } = fields;
    //check if your doesnot send empty data
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "please include all fields",
      });
    }

    let product = new Product(fields);
    //handle file here
    //1. check size
    if (file.photo) {
      //3mb or 2097153
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //console.log(product);

    //save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "file is not saved in DB",
        });
      }
      res.json(product);
    });
  });
};

//get product and send the product as json file
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

//Middleware
//aak baar remove karka dekhyo it optimizes our application only if i remove this then undefined vala jo ha upper ussa hatta deyo
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//delete products
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err || !deletedProduct) {
      return res.status(400).json({
        error: "not able to delete product",
      });
    }
    return res.json({
      message: "Deleting was success",
      deletedProduct,
    });
  });
};

//update products
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        //aagr koi yaha taak pocha ha matlab vo admin ha lakin usski image ma kuch dekat ha ya to vo bhoot badi ha ya fhir not uploadable
        error: "Not able save product",
      });
    }
    //updation CODE
    let product = req.product;
    product = _.extend(product, fields);

    //handle file here
    //1. check size
    if (file.photo) {
      //3md or 2097153
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "file size too big",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //console.log(product);

    //save to DB
    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "updation of product failed in DB",
        });
      }
      res.json(product);
    });
  });
};

//get all products
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    //"-ve sign photo means do not select it"
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No Product Found In DB",
        });
      }
      // console.log(products);
      res.json(products);
    });
};

//get all categories uniquely
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO Category Found",
      });
    }
    res.json(category);
  });
};
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: {
          _id: prod._id,
        },
        update: {
          $inc: {
            stock: -prod.count,
            sold: +prod.count,
          },
        },
      },
    };
  });
  //bulkWrite is a moongoose methos it is very imp and used in real world application
  product.bulkWrite(myOperations, {}, (err, products) => {
    if (err || !products) {
      return res.status(400).json({
        error: "Bulk Opr Failed",
      });
    }
    next();
  });
};
