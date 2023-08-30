const chatInput = document.querySelector(".chat-input textarea"); 
const sendChatBtn = document.querySelector(".chat-input span"); 
const chatBox = document.querySelector(".chatbox"); 
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message,  className) => {
    //create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: userMessage}]
        })
    }

    // send POST request to API, get respose
    fetch(API_URL, requestOptions). then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textCOntent = "Oops! Something went wrong. Please try again";
    }).finally(() => chatBox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.requestFullscreen.height = `${inputInitHeight}px`;

    //Append the user's messae to the chatbox
    chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(()=> {
        //Display "Typing ..." message while waiting for the response
        const incomingChatLi = createChatLi("Typing...", "incoming")
        chatBox.appendChild(incomingChatLi);
        chatBox.scrollTo(0, chatBox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600)
}


chatInput.addEventListener("input", () => {
    //This addjusts the height of the input textarea based on its content     
    chatInput.computedStyleMap.height = `${inputInitHeight}px`;
    chatInput.computedStyleMap.height = `${chatInput.scrollHeight}px`;
})

chatInput.addEventListener("keydown", (e) => {
    //If Enter key is pressed without Shift key and the window
    // width is greater than 800px, handle the chat
   if(e.key === "Enter" && !e.shiftKey && winsows.innerWidth > 800) {
        e.preventDefault();
        handleChat();
   }
})



sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));