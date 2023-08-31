const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const userRoutes = require("./routes/userRoutes");
const workplaceRoutes = require("./routes/workplaceRoutes");
const branchRoutes = require("./routes/branchRoutes");
const leafRoutes = require("./routes/leafRoutes");

const connectDB = require("./utils/connectDB");
const Leaf = require("./models/leafModel");
const User = require("./models/userModel");
const Workplace = require("./models/workplaceModel");
const Branch = require("./models/branchModel");
const path = require("path");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

server.listen(8080, () => {
  console.log("listning (8080)");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
app.use("/api/workplace", workplaceRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/leaf", leafRoutes);

app.get("/", function (req, res) {
  const options = {
    root: path.join(__dirname),
  };

  const fileName = "README.md";
  res.sendFile(fileName, options);
});

Leaf.watch().on("change", (change) => {
  io.emit("change", "changed");
});
User.watch().on("change", (change) => {
  io.emit("change", "changed");
});
Workplace.watch().on("change", (change) => {
  io.emit("change", "changed");
});
Branch.watch().on("change", (change) => {
  io.emit("change", "changed");
});
app.use("*", (req, res) => {
  console.log("someone is trying to access a non existing route", req.params);
  res.send("Route Not Found");
});

connectDB();
