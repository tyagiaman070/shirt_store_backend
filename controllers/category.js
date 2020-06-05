const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save Category inDB",
      });
    }
    res.json({
      category,
    });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  //the exec should be written as it is else it causes error
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category; //it says undefined when i access category.name
  // console.log(res);
  // console.log(res.body.name);
  category.name = req.body.name;
  //console.log(category);
  // console.log(req.body.name);
  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Failed to delete category",
      });
    }
    category;
    res.json({
      "category deleted success": category.name,
    });
  });
};
