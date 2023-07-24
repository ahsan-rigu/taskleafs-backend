const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const userRoutes = require("./routes/userRoutes");

const connectDB = require("./utils/connectDB");

const app = express();
app.listen(8080, () => {
  console.log("listning (8080)");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);

app.use("*", (req, res) => {
  console.log("someone is trying to access a non existing route", req.params);
  res.send("Route Not Found");
});

const myPromise = new Promise((res, rej) => {
  setTimeout(() => res("Asdasdasd"), 0);
});

console.log(myPromise);

console.log("hgere");

connectDB();
