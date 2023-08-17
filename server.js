const express = require("express");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const userRoutes = require("./routes/userRoutes");
const workplaceRoutes = require("./routes/workplaceRoutes");
const branchRoutes = require("./routes/branchRoutes");
const leafRoutes = require("./routes/leafRoutes");

const connectDB = require("./utils/connectDB");

const app = express();
app.listen(8080, () => {
  console.log("listning (8080)");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
app.use("/api/workplace", workplaceRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/leaf", leafRoutes);

app.use("*", (req, res) => {
  console.log("someone is trying to access a non existing route", req.params);
  res.send("Route Not Found");
});

connectDB();
