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
    // create msg
    let msgInputText = msgInput.value
    let msg = {
        text: msgInputText,
        id: 12345
    }
    push(msgRef, msg)
    msgInput.value = ""
}

// ----- gets the snapshot of the msgs-----
onValue(msgRef, function (snapshot) {
    msgContainer.innerHTML = ""
    const msgObject = snapshot.val()

    for (let key in msgObject) {
        const msgDiv = document.createElement("div")
        const currentMsg = msgObject[key].text
        const msgID = msgObject[key].id


        msgDiv.innerText = currentMsg
        msgContainer.appendChild(msgDiv)
        if(msgID === 12345){
            msgDiv.classList.add("sent-msg")
        }
        else{
            msgDiv.classList.add("recieved-msg")
        }
    }
})



