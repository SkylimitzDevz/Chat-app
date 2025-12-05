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

function setVh(){
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
}

function setInputHeight(){
    const height = msgBar ? msgBar.offsetHeight : 90
    document.documentElement.style.setProperty('--input-height', `${height}px`)
}

msgInput.addEventListener('focus', function(){
    setTimeout(()=>{
        try{ msgContainer.scrollTo({ top: msgContainer.scrollHeight, behavior: 'smooth' }) }catch(e){}
    }, 300)
    setInputHeight()
})

msgInput.addEventListener('blur', function(){
    setTimeout(()=> setInputHeight(), 200)
})

window.addEventListener('resize', function(){ setVh(); setInputHeight() })
window.addEventListener('orientationchange', function(){ setVh(); setInputHeight() })
setVh(); setInputHeight();

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
    // clear and re-render
    msgContainer.innerHTML = ""
    const msgObject = snapshot.val()
    if(!msgObject) return

    for (let key in msgObject) {
        const data = msgObject[key]
        const msgDiv = document.createElement("div")
        const currentMsg = data && data.text ? data.text : ''
        const currentUsername = data && data.user ? data.user : ''

        msgDiv.innerHTML = `\n        <h5>${currentUsername}</h5>\n        <p class = "msg-text">${currentMsg}</p>`;

        msgContainer.appendChild(msgDiv)
        if(currentUsername === getUsernameFromLocalStorage()){
            msgDiv.classList.add("sent-msg")
        }
        else{
            msgDiv.classList.add("recieved-msg")
        }
    }

    // always scroll to newest message when messages update
    requestAnimationFrame(()=>{
        try{ msgContainer.scrollTop = msgContainer.scrollHeight }catch(e){}
    })
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
