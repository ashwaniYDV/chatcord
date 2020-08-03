const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const inputMsg = document.querySelector('#msg');
const sendLocation = document.querySelector('.send-location');
inputMsg.focus();


const socket = io();

// Join chatroom (username, room, currentRoom are coming from script above this script)
if (!room && currentRoom && currentRoom !== undefined && currentRoom !== 'undefined') {
  socket.emit('joinRoom', { username: username, room: currentRoom });
} else {
  socket.emit('joinRoom', { username: username, room: room });
}

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  // console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Location message from server
socket.on('locationMessage', message => {
  console.log(message);
  outputLocationMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
  $("div.emojionearea-editor").text("");
  $("div.emojionearea-editor").focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Output location message to DOM
function outputLocationMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    <iframe src="${message.text}&output=embed" width="100%" height="240px"></iframe>
    <a href="${message.text}" target="_bl">Open map in new tab</a>
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}

sendLocation.addEventListener('click',()=>{
  if(!navigator.geolocation){
      return alert('Geolocation api not supported')
  }
  // $sendlocation.setAttribute('disabled','disabled')
  navigator.geolocation.getCurrentPosition((position)=>{
    console.log(position);
    socket.emit('shareLocation', { latitude : position.coords.latitude, longitude : position.coords.longitude }, ( message ) => {
        console.log(message)
      })
    })
})
