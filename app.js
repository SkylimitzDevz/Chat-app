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
    onValue,
    get
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

// Register/login elements
const registerBtn = document.getElementById("register-btn")
const usernameInput = document.getElementById("username-input")
const passwordInput = document.getElementById("password-input")
const loginTab = document.querySelector(".login-popup")
const registerTab = document.querySelector(".register-popup")
const registerCheckout = document.getElementById("checkout-register")
const loginCheckout = document.getElementById("checkout-login")




//-------------------send btn onclick----------------------

sendBtn.addEventListener("click", function () {

    const haveUsername = checkLocalStorage()

    if(haveUsername){

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
            writeMsg(msgInput, getUsernameFromLocalStorage())
            console.log(getUsernameFromLocalStorage())
            sendBtn.classList.add("jump--animation-class")
            setTimeout(function () {
                sendBtn.classList.remove("jump--animation-class")
            }, 1000)
        }
    }

    else{
        loginTab.style.transform = "scale(1)"
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
    

})

//localstorage check
function checkLocalStorage(){
    let username = localStorage.getItem("username")
    if(username){
        return true
    }
    else{
        return false
    }
}


function getUsernameFromLocalStorage(){
    return localStorage.getItem("username")
}



// -------------creates the new messge-----------------------

function writeMsg(msgInput, username) {
    // create msg
    let msgInputText = msgInput.value
    let msg = {
        user: username,
        text: msgInputText
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
        const currentUsername = msgObject[key].user


        msgDiv.innerHTML = `
        <h5>${currentUsername}</h5>
        <p class = "msg-text">${currentMsg}</p>`;

        msgContainer.appendChild(msgDiv)
        if(currentUsername === getUsernameFromLocalStorage()){
            msgDiv.classList.add("sent-msg")
        }
        else{
            msgDiv.classList.add("recieved-msg")
        }
    }
})


// ------------- login/register -------------
const userInfoDB = ref(database, "userInfo")

registerBtn.addEventListener("click", async function() {
    const desiredUsername = usernameInput.value
    const password = passwordInput.value
    
    const snapshot = await get(userInfoDB)
    const usernameTaken = checkUsername(snapshot.val(), desiredUsername)

    if(usernameTaken){
        console.log("sorry this username is already taken")
    }
    else{
        const registrationInfo = {
            username: desiredUsername,
            password: password,
            uuid: 1234
        }

        push(userInfoDB, registrationInfo)

        registerTab.style.transform = "scale(0)"
        loginTab.style.transform = "scale(1)"
    }

})



// check if the username is already taken
function checkUsername(snapshot, nameInput) {
    if(!snapshot){
        return false
    }

    const userArray = Object.values(snapshot)

    for(let key in userArray) {
        if (userArray[key].username === nameInput){
            return true
        }
    }
    
    return false
}


// ----------------- login --------------------


const loginBtn = document.getElementById("login-btn")
const usernameLogin = document.getElementById("username-login")
const pwdLogin = document.getElementById("password-login")


loginBtn.addEventListener("click", async function() {
    const snapshot = await get(userInfoDB)
    const users = snapshot.val()
    const userArray = Object.values(users)

    console.log(users)
    console.log(snapshot)

    for(let key in userArray) {
        if(usernameLogin.value === userArray[key].username && pwdLogin.value === userArray[key].password){
            let username = userArray[key].username
            console.log("logged in")
            localStorage.setItem("username", username)
            loginTab.style.transform = "scale(0)"
        }
        else{
            console.log("no matching accounts")
        }
    }


})


registerCheckout.addEventListener("click", function() {
    loginTab.style.transform = "scale(0)"
    registerTab.style.transform = "scale(1)"
})


loginCheckout.addEventListener("click", function() {
    registerTab.style.transform = "scale(0)"
    loginTab.style.transform = "scale(1)"
})
