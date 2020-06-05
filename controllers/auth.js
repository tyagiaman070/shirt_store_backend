const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);
  console.log(req.body);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
      location: errors.array()[0].location,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT ABLE TO SAVE IN DB",
      });
    }

    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
      password: user.password,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      param: errors.array()[0].param,
      location: errors.array()[0].location,
    });
  }
  User.findOne(
    {
      email,
    },
    (err, user) => {
      if (err || !user) {
        res.status(400).json({
          error: "User email does not exist",
        });
      }
      if (!user.autheticate(password) || password == "") {
        return res.status(401).json({
          error: "Email and password do not match",
        });
      }

      //create cookie
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.SECRET
      );

      //put token in cookie in user browser
      res.cookie("token", token, {
        expire: new Date() + 9999,
      });

      //send res to front end
      const { _id, name, email, role } = user;
      return res.json({
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    }
  );
};

exports.signout = (req, res) => {
  res.json({
    message: "user sign out Success",
  });
};

//Protected Routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//Custom Middleware
//check the front
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(401).json({
      error: "You are not an ACCESS DENIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN ACCESS DENIED",
    });
  }
  next();
};
