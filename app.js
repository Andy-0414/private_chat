const express = require('express')
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'))
app.get("/", (req, res) => [
    res.sendFile("./public/index.html")
])

io.on("connection", socket => {
    socket.on("joinRoom", data => {
        socket.join(data.roomCode)
        socket.emit("joinRoom", data)
    })
    socket.on("boomRoom", data => {
        io.sockets.to(data.roomCode).emit("boomRoom", data)
    })
    socket.on("getMsg", data => {
        socket.broadcast.to(data.roomCode).emit("getMsg", data)
    })

})
http.listen(3000)