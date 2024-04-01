const express = require("express");
const bodyParser = require("body-parser");
//CORS
const cors = require("cors");

const GCloudManager = require("./GCloudManager");
const router = require("./router");

const app = express();
const http = require("http").Server(app);

const gcloudManager = new GCloudManager();

const NODE_ENV = process.env.NODE_ENV;
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});
require("dotenv").config({ path: `./.env.${NODE_ENV}` });

app.use(cors());
const topicName = process.env.TOPIC_NAME;
const subscriptionName = process.env.SUBSCRIPTION_NAME;

io.on("connection", (socket) => {
  let previousId;

  console.log(`Socket ${socket.id} connected`)

  const safeJoin = (currentId) => {
    socket.leave(previousId);
    socket.join(currentId, () =>
      console.log(`Socket ${socket.id} joined room ${currentId}`)
    );
    previousId = currentId;
  };

  // ...
});

gcloudManager.listenForMessages(
  topicName,
  subscriptionName,
  (message) => {
    console.log(`Received message: ${message.data.toString()}`);
    io.emit("message", { content: message.data.toString(), sender: message.attributes.sender });
    message.ack();
  },
  (error) => {
    console.error(`Received error: ${error.message}`);
  }
);

app.use(bodyParser.json());
app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  http.listen(4444, () => {
    console.log("Socket listening on port 4444");
  });
});

process.on("SIGINT", () => {
  gcloudManager.stopListening();
  process.exit();
});
