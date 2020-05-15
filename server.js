const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use("/", express.static(__dirname + "/public"));

const users = {};
const socketUserMap = {};

io.on("connection", (socket) => {
  console.log("connection established");

  //login_req event
  socket.on("login_req", (data) => {
    console.log("got a login request");

    if (users[data.username]) {
      if (users[data.username] == data.password) {
        socket.emit("login_success");
        socket.join(data.username);
        socketUserMap[socket.id] = data.username;
      } else {
        socket.emit("login_failed");
      }
    } else {
      users[data.username] = data.password;
      socket.emit("login_success");
      socket.join(data.username);
      socketUserMap[socket.id] = data.username;
    }
    console.log("All users are ..");
    console.log(users);
  });

  //send_msg event
  socket.on("send_msg", (data) => {
    console.log("got a msg req");

    if (data.to) {
      io.to(data.to).emit("receive_msg", {
        from: socketUserMap[socket.id],
        msg: data.msg,
      });
    } else {
      io.emit("receive_msg", {
        from: socketUserMap[socket.id],
        msg: data.msg,
      });
    }
  });
});

server.listen(5000, () =>
  console.log("Server is running at http://localhost:5000")
);
