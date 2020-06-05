const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  //the exec should be written as it is else it causes error
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "No user found in DB",
      });
    }

    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //req.profile.salt = undefined; or req.profile.salt = "";
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.profile._id, //it return error if it does not find user so we can write !user or we can leave
    },
    {
      $set: req.body,
    },
    {
      new: true,
      useFindAndModify: false,
    },
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({
          error: "You are not authorized to update this user",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({
    user: req.profile._id,
  })
    .populate("user", "_id name")
    //the exec should be written as it is else it causes error
    .exec((err, order) => {
      if (err || !order) {
        return res.status(400).json({
          error: "no product found",
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //Store in database
  user.findOneAndUpdate(
    {
      _id: req.profile._id,
    },
    {
      $push: {
        purchases: purchases,
      },
    },
    {
      new: true,
    },
    (err, purchases) => {
      if (err || !purchases) {
        return res.status(400).json({
          error: "unable to load data from purchases",
        });
      }
      next();
    }
  );
};

/*
exports.getAllUsers = (req, res) => {
    User.find(((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "No user found in DB"
            });
        }
        return res.json({
            usersArray: user
        });
    }));
}
*/
