const express = require("express")
const path = require("path")
const socketIO = require("socket.io")
const http = require("http")
const formatMessage = require("./utils/messages")
const {joinUser, getCurrentUser, userLeave, getRoomUsers} = require("./utils/users")


const app = express()
const server = http.createServer(app)
const io = socketIO(server)

const botName = "Chatcord bot"

io.on('connection', socket =>{
    //handle the request: join chat room
    socket.on("join-room", ({username, room})=>{
        const user = joinUser(socket.id, username, room)
        socket.join(user.room)
        socket.emit("message", formatMessage(username,"Welcome to the chat"))
        //broadcast when a user joins the chat
        socket.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`))

        //send sidebar info to the client 
        io.to(user.room).emit('room-users', {
            //send this object to client
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    socket.on("chatMessage", msg =>{
        const user = getCurrentUser(socket.id)
        console.log(user);
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })

    //runs when client disconnect
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id)
        if(user){
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))
            //send user info to the sidebar 
            io.to(user.room).emit('room-users', {
                //send this object to client
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
 

})
//set static folder
app.use(express.static('public'))
const PORT = 3000 || process.env.PORT
server.listen(PORT, ()=>{ console.log(`server running on port ${PORT}`);} )