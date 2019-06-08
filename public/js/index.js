const go = document.getElementById("go")
const codeInput = document.getElementById("codeInput")
const chatInput = document.getElementById("chatInput")
const chatBox = document.getElementById("chatBox")
const clear = document.getElementById("clear")
const boom = document.getElementById("boom")

const socket = io()

var myCode = null

go.addEventListener("click", e => {
    document.getElementById("app").style.display = "none"
    document.getElementById("chat").style.display = "flex"

    myCode = codeInput.value
    socket.emit("joinRoom", {
        roomCode: myCode
    })
})
codeInput.addEventListener("keypress", e => {
    if (e.keyCode == 13) go.click()
})
chatInput.addEventListener("keypress", e => {
    if (chatInput.value.trim()  && e.keyCode == 13) {
        var div = document.createElement("div")
        var alignDiv = document.createElement("div")
        div.classList.add("chatBox__item")

        div.innerText = chatInput.value
        alignDiv.style.textAlign = "right"
        alignDiv.appendChild(div)

        chatBox.appendChild(alignDiv)
        chatBox.scrollTop = chatBox.scrollHeight

        socket.emit("getMsg", {
            msg: chatInput.value,
            roomCode: myCode
        })
        chatInput.value = ""
    }
})
clear.addEventListener("click", e => {
    chatBox.innerHTML = ""
})
boom.addEventListener("click",e=>{
    socket.emit("boomRoom",{roomCode:myCode})
})
socket.on("boomRoom", data => {
    window.location = ""
})
socket.on("getMsg", data => {
    var div = document.createElement("div")
    var alignDiv = document.createElement("div")
    div.classList.add("chatBox__item")

    div.innerText = data.msg
    alignDiv.style.textAlign = "left"
    alignDiv.appendChild(div)

    chatBox.appendChild(alignDiv)
    chatBox.scrollTop = chatBox.scrollHeight
})