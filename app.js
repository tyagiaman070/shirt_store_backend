require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");

const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//MY Routes
//const authRoutes = require("./routes/auth.js")
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripePayment");
const paypalRoutes = require("./routes/paypalpayment");

//Stripe route

//Mongoose DB connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//My Middlewares
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

//My Routes
// app.use();
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", paypalRoutes);

//myfun.run().then().catch()

//My port number
const port = process.env.PORT || 8000;

//My server is starting
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
