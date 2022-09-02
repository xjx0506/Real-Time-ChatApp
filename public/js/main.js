const chatForm = document.getElementById("chat-form")
const chatMessages = document.querySelector(".chat-messages")
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//create an socket object
const socket = io()
//extract the username and room from the query string
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

//send the request: join chat room
socket.emit("join-room", {username, room})

//get room and users
socket.on('room-users',({room, users})=>{
    outputRoomName(room)
    outputUsers(users)
})
//get message from server
socket.on("message", message =>{
    console.log(message);
    outputMessage(message)
    //always srolls down to the new message
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//message submit
chatForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const message = e.target.elements.msg.value
    //emit a message to the server
    socket.emit('chatMessage', message)
    //clear the input
    e.target.elements.msg.value = ''
})

//output message to dom
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text }
    </p>`
    document.querySelector('.chat-messages').appendChild(div)
}
//add room name to dom
function outputRoomName(room){
    roomName.innerText = room
}

//add users to dom
function outputUsers(users){
    userList.innerHTML = ` 
        ${users.map(user => `<li>${user.username}</li>`).join("")}`; 
}