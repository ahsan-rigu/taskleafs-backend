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
const questionRoutes = require("./routes/questionRoutes");

const connectDB = require("./utils/connectDB");
const path = require("path");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://taskleafs.vercel.app",
    methods: ["GET", "POST"],
  },
});

server.listen(process.env.PORT || 8080, () => {
  console.log("listning (8080)");
});

io.use((socket, next) => {
  const { userId, workplaces } = socket.handshake.auth;
  socket.userId = userId;
  socket.workplaces = workplaces;
  next();
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
app.use("/api/workplace", workplaceRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/leaf", leafRoutes);
app.use("/api/question", questionRoutes);

app.get("/", function (req, res) {
  const options = {
    root: path.join(__dirname),
  };

  const fileName = "README.md";
  res.sendFile(fileName, options);
});

app.use("*", (req, res) => {
  console.log("someone is trying to access a non existing route", req.params);
  res.send("Route Not Found");
});

connectDB();
