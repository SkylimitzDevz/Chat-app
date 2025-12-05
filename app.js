// firebase
const firebaseConfig = {
    databaseURL: "https://gibber-chat-app-default-rtdb.asia-southeast1.firebasedatabase.app",
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getDatabase,
    push,
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";


// --------------------------------------------

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)
const msgRef = ref(database, "messages")


const sendBtn = document.getElementById("send-btn")
const createMsg = document.createElement("div")
const msgContainer = document.getElementById("msg-section");
const msgBar = document.querySelector(".msg-bar")
const msgInput = document.getElementById("msg-input")




//-------------------send btn onclick----------------------

sendBtn.addEventListener("click", function () {

    if (msgInput.value === "") {
        // cant send button animation
        sendBtn.classList.add("button-shake-animation")
        setTimeout(function () {
            sendBtn.classList.remove("button-shake-animation")
        }, 500)

        // red input glow animation
        msgBar.classList.add("red-border-adder")
        setTimeout(function () {
            msgBar.classList.remove("red-border-adder")
        }, 500)
    }

    else {
        //send animation + send msg
        writeMsg(msgInput)

        sendBtn.classList.add("jump--animation-class")
        setTimeout(function () {
            sendBtn.classList.remove("jump--animation-class")
        }, 1000)
    }

})



// -------------creates the new messge-----------------------

function writeMsg(msgInput) {
    const msgDiv = document.createElement("div"); // create NEW msg :D
    // create msg
    let msg = msgInput.value
    msgDiv.innerText = msg; //sets the msg

    msgDiv.classList.add("sent-msg");
    msgContainer.appendChild(msgDiv);

    push(msgRef, msg)
    msgInput.value = ""
}


onValue(msgRef, function (snapshot) {
    const msgObject = snapshot.val()
    for (let key in msgObject) {
        const msgDiv = document.createElement("div")
        const currentMsg = msgObject[key]

        msgDiv.innerText = currentMsg
        msgDiv.classList.add("recieved-msg")
        msgContainer.appendChild(msgDiv)
    }
})
