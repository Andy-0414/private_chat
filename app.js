const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'))
app.get("/", (req, res) => [
    res.sendFile("./public/index.html")
])
var userlist = {
    users: [],
    createUser(id, name) {
        this.users.push({
            id,
            name
        })
    },
    deleteUser(id) {
        let idx = this.users.findIndex(x => x.id == id)
        if (idx != -1)
            this.users.splice(idx, 1)
    },
    has(name) {
        return this.users.findIndex(x => x.name == name)
    }
}

io.on("connection", socket => {
    socket.on("joinRoom", data => {
        if (userlist.has(data.name) == -1) {
            userlist.createUser(socket.id, data.name)
            socket.join(data.roomCode)
            socket.emit("joinRoom", data)
        }
    })
    socket.on("boomRoom", data => {
        io.sockets.to(data.roomCode).emit("boomRoom", data)
    })
    socket.on("getMsg", data => {
        socket.broadcast.to(data.roomCode).emit("getMsg", data)
    })
    socket.on('disconnect', data => [
        userlist.deleteUser(socket.id)
    ])
})
http.listen(80)