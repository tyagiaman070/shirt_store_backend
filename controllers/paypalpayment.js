var braintree = require("braintree");
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "2vf4wmc2mtmn2ktk",
  publicKey: "j6g7n8vgr3rfkb3t",
  privateKey: "61a1f85d587f46acdb35f06927e9b8f0",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate(
    {
      // customerId: aCustomerId,
    },
    function (err, response) {
      var clientToken = response.clientToken;
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(response);
      }
    }
  );
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(result);
      }
    }
  );
};
