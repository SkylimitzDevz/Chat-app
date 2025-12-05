// firebase

const socket = new WebSocket('ws://127.0.0.1:5500//ws');
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
    getDatabase,
    push,
    ref,
    set
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";



const firebaseConfig = {
    databaseURL: "https://gibber-chat-app-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app)

const msgRef = ref(database, "messages")



const sendBtn = document.getElementById("send-btn")
const createMsg = document.createElement("div")
const msgContainer = document.getElementById("msg-section");
const msgBar = document.querySelector(".msg-bar")

const msgInput = document.getElementById("msg-input")

sendBtn.addEventListener("click", function () {
    console.log("cliked")
    if (msgInput.value === "") {

        sendBtn.classList.add("button-shake-animation")
        setTimeout(function () {
            sendBtn.classList.remove("button-shake-animation")
        }, 500)

        msgBar.classList.add("red-border-adder")
        setTimeout(function () {
            msgBar.classList.remove("red-border-adder")
        }, 500)
    }
    else {
        writeMsg(msgInput)
        sendBtn.classList.add("jump--animation-class")

        setTimeout(function () {
            sendBtn.classList.remove("jump--animation-class")
        }, 1000)
    }

})

// creates the new messge
function writeMsg(msgInput) {
    const msgDiv = document.createElement("div"); // create NEW element :D
    let msg = msgInput.value
    msgDiv.innerText = msg;
    msgDiv.classList.add("sent-msg");
    msgContainer.appendChild(msgDiv); // add it to screen

    push(msgRef, msg)
        .then(() => {
            // Success! Only run DOM updates if the push was successful
            msgDiv.innerText = msg;
            msgDiv.classList.add("sent-msg");
            msgContainer.appendChild(msgDiv);
            msgInput.value = ""; // clear input
        })
        .catch((error) => {
            // FAILURE! Log the error so you can see *why* it failed
            console.error("Firebase PUSH failed! Check your rules or network:", error);
            // You could display an error message to the user here!
            alert("Failed to send message. Check the console for details!");
        });
}
