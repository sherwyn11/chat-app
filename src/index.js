// Server side JS

const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const {generateMessage,generateLocation} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 8000;
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// let count = 0

io.on('connection',(socket) => {
    console.log('New web connection')

    socket.on('join',({username,room},callback) => {
        const{error,user} = addUser({id: socket.id,username,room})
        if(error){
            return callback(error)
        }

        socket.join(user.room)
        
        socket.emit('message', generateMessage('admin','Welcome!') ) //only updates on the current browser
        socket.broadcast.to(user.room).emit('message',generateMessage(user.username+" has joined the chat room"))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
        
    })

    socket.on('newMessage',(msg,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message',generateMessage(user.username,msg)) //updates on all connected browser
        callback('Delivered')
    })

    socket.on('sendLocation',({latitude,longitude},callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocation(user.username,'https://google.com/maps?q='+latitude+","+longitude))
        callback('Location shared')
    })

    socket.on('disconnect',() =>{ //disconnect --> inbuilt in socket.io lib
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message',generateMessage('admin',user.username+' has left'))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

})

server.listen(port, () => {
    console.log("Server is up on port "+port)
});