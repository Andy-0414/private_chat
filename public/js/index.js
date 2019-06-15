const go = document.getElementById("go")
const codeInput = document.getElementById("codeInput")
const nameInput = document.getElementById("nameInput")
const chatInput = document.getElementById("chatInput")
const chatBox = document.getElementById("chatBox")
const chatSend = document.getElementById("chatSend")
const clear = document.getElementById("clear")
const boom = document.getElementById("boom")
const boomAlert = document.getElementById("boomAlert")
const boomNo = document.getElementById("boomNo")
const boomYes = document.getElementById("boomYes")
const app = document.getElementById("app")
const chat = document.getElementById("chat")

const socket = io()

var myCode = null
var myName = null
var prevUser = null

window.addEventListener('resize', function () {
    document.body.style.height = document.documentElement.clientHeight + 'px';
}, false);

go.addEventListener("click", e => {
    myCode = codeInput.value
    myName = nameInput.value
    if (myCode && myName) {
        socket.emit("joinRoom", {
            name: myName,
            roomCode: myCode
        })
    }
})
socket.on("joinRoom", data => {
    app.style.opacity = 0
    chat.style.zIndex = 20
    chat.style.opacity = 1
    chat.style.transform = "scale(1)"
    chatInput.focus()
    chatInput.addEventListener("blur", e => {
        chatInput.focus()
    })
})

var gotoChat = (e) => {
    if (e.keyCode == 13) go.click()
}
codeInput.addEventListener("keypress", gotoChat)
nameInput.addEventListener("keypress", gotoChat)
chatInput.addEventListener("keypress", e => {
    if (e.keyCode == 13) chatSend.click()
})

chatSend.addEventListener("click", e => {
    chatInput.focus()
    if (chatInput.value.trim()) {
        var div = document.createElement("div")
        var alignDiv = document.createElement("div")
        div.classList.add("chatBox__item")

        div.innerText = chatInput.value
        alignDiv.innerText = myName
        alignDiv.style.textAlign = "right"
        div.style.backgroundColor = "black"
        alignDiv.appendChild(div)

        chatBox.appendChild(alignDiv)
        chatBox.scrollTop = chatBox.scrollHeight

        socket.emit("getMsg", {
            name: myName,
            msg: chatInput.value,
            roomCode: myCode
        })
        chatInput.value = ""
    }
})
clear.addEventListener("click", e => {
    chatBox.innerHTML = ""
})
boom.addEventListener("click", e => {
    boomAlert.style.display = "flex"

})
boomNo.addEventListener("click", e => {
    boomAlert.style.display = "none"
})
boomYes.addEventListener("click", e => {
    boomAlert.style.display = "none"
    socket.emit("boomRoom", {
        roomCode: myCode
    })
})
socket.on("boomRoom", data => {
    window.location = ""
})
const colors = ["#ec407a",
    "#ab47bc",
    "#7e57c2",
    "#5c6bc0",
    "#42a5f5",
    "#29b6f6",
    "#26c6da",
    "#26a69a",
    "#66bb6a",
    "#9ccc65",
    "#d4e157",
    "#ffee58",
    "#ffca28",
    "#ffa726",
    "#ff7043",
    "#8d6e63",
    "#78909c"
]
for (let i = 0; i < colors.length; i++) {
    let rand = Math.floor(Math.random() * colors.length)
    let tmp = colors[i]
    colors[i] = colors[rand]
    colors[rand] = tmp
}
var nameList = []

socket.on("getMsg", data => {
    var colorIndex = nameList.findIndex(x => x.name == data.name)
    if (colorIndex == -1) {
        nameList.push({
            name: data.name,
            color: colors[nameList.length]
        })
        colorIndex = nameList.length - 1
    }

    var div = document.createElement("div")
    var alignDiv = document.createElement("div")
    div.classList.add("chatBox__item")
    div.innerText = data.msg
    div.style.backgroundColor = nameList[colorIndex].color

    if (data.name != prevUser){
        var name = document.createElement("div")
        name.classList.add("name")
        name.innerText = data.name
        name.style.color = nameList[colorIndex].color
        alignDiv.appendChild(name)
        prevUser = data.name
    }

    alignDiv.classList.add("notMe")
    alignDiv.style.textAlign = "left"
    alignDiv.appendChild(div)

    chatBox.appendChild(alignDiv)
    chatBox.scrollTop = chatBox.scrollHeight
})