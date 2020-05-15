let socket = io();

let loginBox = $(".loginBox");
let chatBox = $(".chatBox");

let btnLogin = $("#btnLogin");
let btnSend = $("#btnSend");

let inpMessage = $("#inpMessage");
let inpRecieverName = $("#inpRecieverName");

let inpPassword = $("#inpPassword");
let inpName = $("#inpName");

let msgList = $("#msgList");

loginBox.show();
chatBox.hide();

//login request
btnLogin.click(() => {
  let username = inpName.val();
  let password = inpPassword.val();
  if (!username || !password) {
    alert("Please fill both username and password");
  } else {
    socket.emit("login_req", {
      username,
      password,
    });
  }
});

//login failed
socket.on("login_failed", () => {
  alert("Please make sure you enter the correct username and password");
});
socket.on("login_success", () => {
  loginBox.hide();
  chatBox.show();
});

//send message
btnSend.click(() => {
  let msg = inpMessage.val();
  let to = inpRecieverName.val();

  if (!msg) {
    alert("Please fill some message");
  } else {
    socket.emit("send_msg", {
      to,
      msg,
    });
  }
});

//receive msg
socket.on("receive_msg", (data) => {
  msgList.append($(`<li>`).text(`[${data.from}] : ${data.msg}`));
});
