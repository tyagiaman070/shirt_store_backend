const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");

const { getToken, processPayment } = require("../controllers/paypalpayment");

//add is authenticated in below line it should be there it causes some error so i have removed it
router.get("/payment/gettoken/:userId", isSignedIn, getToken);

router.post(
  "/payment/braintree/:userId",
  isSignedIn,

  processPayment
);

module.exports = router;
