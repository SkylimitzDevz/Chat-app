const sendBtn = document.getElementById("send-btn")
const createMsg = document.createElement("div")
const msgContainer = document.getElementById("msg-section");
const msgBar = document.querySelector(".msg-bar")

const msgInput = document.getElementById("msg-input")

sendBtn.addEventListener("click", function() {
    console.log("cliked")
    if(msgInput.value === ""){

        sendBtn.classList.add("button-shake-animation")
        setTimeout(function() {
        sendBtn.classList.remove("button-shake-animation")
        }, 500) 

        msgBar.classList.add("red-border-adder")
        setTimeout(function() {
            msgBar.classList.remove("red-border-adder")
        }, 500)
    }
    else{
       writeMsg(msgInput)
        sendBtn.classList.add("jump--animation-class")

        setTimeout(function() {
            sendBtn.classList.remove("jump--animation-class")
        }, 1000)
    }
    
})

// creates the new messge
function writeMsg() {
    const msgDiv = document.createElement("div"); // create NEW element
    msgDiv.innerText = msgInput.value;
    msgDiv.classList.add("sent-msg");

    msgContainer.appendChild(msgDiv); // add it to screen

    msgInput.value = ""; // clear input
}