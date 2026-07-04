// ==========================================
// EduGenie AI - Professional Script.js
// Part 1
// ==========================================

// Backend URL
const API_URL = "http://127.0.0.1:8000";

// -------------------------------
// Elements
// -------------------------------

const chatBox = document.getElementById("chatBox");
const askInput = document.getElementById("askInput");
const mode = document.getElementById("mode");
const loading = document.getElementById("loading");

// -------------------------------
// Send Message
// -------------------------------

async function sendMessage() {

    const text = askInput.value.trim();

    if (text === "") {
        alert("Please enter a question.");
        return;
    }

    addUserMessage(text);

    askInput.value = "";

    loading.style.display = "flex";

    let endpoint = "";

    switch (mode.value) {

        case "ask":
            endpoint = "/ask";
            break;

        case "explain":
            endpoint = "/explain";
            break;

        case "quiz":
            endpoint = "/quiz";
            break;

        case "summary":
            endpoint = "/summary";
            break;

        case "roadmap":
            endpoint = "/roadmap";
            break;
    }

    try {

        const response = await fetch(API_URL + endpoint, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                text: text
            })

        });

        const data = await response.json();

        loading.style.display = "none";

        let answer = data.response || "No response.";

        // Format quiz if Quiz mode
        if (mode.value === "quiz") {
            answer = formatQuiz(answer);
        }

        typingEffect(answer);

    }

    catch (error) {

        loading.style.display = "none";

        addBotMessage("❌ Unable to connect to backend.");

        console.log(error);

    }

}

// -------------------------------
// Format Quiz
// -------------------------------

function formatQuiz(text) {

    text = text.replace(/Question\s*(\d+):/gi, "\n\nQuestion $1\n");

    text = text.replace(/\s+A\./g, "\n\nA.");
    text = text.replace(/\s+B\./g, "\nB.");
    text = text.replace(/\s+C\./g, "\nC.");
    text = text.replace(/\s+D\./g, "\nD.");

    text = text.replace(/Answer:/gi, "\n\n✅ Correct Answer:");

    return text;

}

// -------------------------------
// Typing Animation
// -------------------------------

function typingEffect(text) {

    const bot = document.createElement("div");

    bot.className = "bot-message";

    bot.innerHTML = `

        <div class="avatar">🤖</div>

        <div class="message"></div>

    `;

    chatBox.appendChild(bot);

    const msg = bot.querySelector(".message");

    let i = 0;

    const speed = 10;

    function type() {

        if (i < text.length) {

            msg.innerHTML += text.charAt(i);

            i++;

            chatBox.scrollTop = chatBox.scrollHeight;

            setTimeout(type, speed);

        }

    }

    type();

}

// -------------------------------
// User Message
// -------------------------------

function addUserMessage(text) {

    chatBox.innerHTML += `

    <div class="user-message">

        <div class="avatar">👤</div>

        <div class="message">

            ${text}

        </div>

    </div>

    `;

    chatBox.scrollTop = chatBox.scrollHeight;

}

// -------------------------------
// Bot Message
// -------------------------------

function addBotMessage(text) {

    chatBox.innerHTML += `

    <div class="bot-message">

        <div class="avatar">🤖</div>

        <div class="message" style="white-space:pre-wrap;line-height:1.8">

            ${text}

        </div>

    </div>

    `;

    chatBox.scrollTop = chatBox.scrollHeight;

}

// -------------------------------
// Suggested Question
// -------------------------------

function fillQuestion(question) {

    askInput.value = question;

}

// -------------------------------
// Enter Key
// -------------------------------

askInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        sendMessage();

    }

});// ==========================================
// EduGenie AI - Professional Script.js
// Part 2
// ==========================================

// -------------------------------
// Get Last AI Response
// -------------------------------

function getLastBotResponse() {

    const messages = document.querySelectorAll(".bot-message .message");

    if(messages.length === 0) return "";

    return messages[messages.length - 1].innerText;

}

// -------------------------------
// Copy Response
// -------------------------------

function copyResponse(){

    const text = getLastBotResponse();

    if(text === ""){

        alert("No response available.");

        return;

    }

    navigator.clipboard.writeText(text);

    showToast("✅ Response Copied");

}

// -------------------------------
// Text To Speech
// -------------------------------

function speakText(){

    const text = getLastBotResponse();

    if(text === ""){

        alert("No response available.");

        return;

    }

    speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "en-US";

    speech.rate = 1;

    speech.pitch = 1;

    speech.volume = 1;

    speechSynthesis.speak(speech);

}

// -------------------------------
// Voice Input
// -------------------------------

function voiceInput(){

    if(!("webkitSpeechRecognition" in window)){

        alert("Speech Recognition is not supported.");

        return;

    }

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.start();

    const mic = document.getElementById("micBtn");

    if(mic){

        mic.classList.add("recording");

    }

    recognition.onresult = function(event){

        askInput.value = event.results[0][0].transcript;

    };

    recognition.onerror = function(){

        showToast("Voice Recognition Error");

    };

    recognition.onend = function(){

        if(mic){

            mic.classList.remove("recording");

        }

    };

}

// -------------------------------
// Download PDF
// -------------------------------

function downloadPDF(){

    const text = getLastBotResponse();

    if(text === ""){

        alert("Nothing to download.");

        return;

    }

    const win = window.open("", "_blank");

    win.document.write(`

    <html>

    <head>

        <title>EduGenie Response</title>

    </head>

    <body style="font-family:Arial;padding:40px;">

        <h1>EduGenie AI</h1>

        <hr>

        <pre style="white-space:pre-wrap;font-size:18px;">

${text}

        </pre>

    </body>

    </html>

    `);

    win.print();

}

// -------------------------------
// Favorites
// -------------------------------

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function saveFavorite(){

    const text = getLastBotResponse();

    if(text === ""){

        showToast("No response found.");

        return;

    }

    favorites.unshift(text);

    favorites = favorites.slice(0,10);

    localStorage.setItem("favorites",JSON.stringify(favorites));

    loadFavorites();

    showToast("⭐ Saved");

}

function loadFavorites(){

    const list = document.getElementById("favoriteList");

    if(!list) return;

    list.innerHTML = "";

    favorites.forEach(item=>{

        list.innerHTML += `

        <div class="favorite-item">

            ${item.substring(0,120)}...

        </div>

        `;

    });

}

loadFavorites();

// -------------------------------
// Chat History
// -------------------------------

let history = JSON.parse(localStorage.getItem("history")) || [];

function saveHistory(question){

    history.unshift(question);

    history = history.slice(0,15);

    localStorage.setItem("history",JSON.stringify(history));

    loadHistory();

}

function loadHistory(){

    const list = document.getElementById("historyList");

    if(!list) return;

    list.innerHTML = "";

    history.forEach(item=>{

        list.innerHTML += `

        <div class="history-item"

        onclick="fillQuestion('${item.replace(/'/g,"\\'")}')">

        ${item}

        </div>

        `;

    });

}

loadHistory();// ==========================================
// EduGenie AI - Professional Script.js
// Part 3
// ==========================================

// -------------------------------
// Dark Mode
// -------------------------------

const darkBtn = document.getElementById("darkBtn");

if (darkBtn) {

    darkBtn.onclick = () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

            showToast("🌙 Dark Mode Enabled");

        } else {

            localStorage.setItem("theme", "light");

            showToast("☀️ Light Mode Enabled");

        }

    };

}

// Load Saved Theme

window.addEventListener("load", () => {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark");

    }

});

// -------------------------------
// Statistics Dashboard
// -------------------------------

function updateStats(type) {

    function increase(id) {

        let value = Number(localStorage.getItem(id)) || 0;

        value++;

        localStorage.setItem(id, value);

        const element = document.getElementById(id);

        if (element) {

            element.innerText = value;

        }

    }

    switch (type) {

        case "ask":
            increase("questionCount");
            break;

        case "quiz":
            increase("quizCount");
            break;

        case "summary":
            increase("summaryCount");
            break;

        case "roadmap":
            increase("roadmapCount");
            break;

        case "explain":
            increase("questionCount");
            break;

    }

}

// -------------------------------
// Load Statistics
// -------------------------------

function loadStats() {

    const ids = [

        "questionCount",

        "quizCount",

        "summaryCount",

        "roadmapCount"

    ];

    ids.forEach(id => {

        const element = document.getElementById(id);

        if (element) {

            element.innerText =

                localStorage.getItem(id) || 0;

        }

    });

}

loadStats();

// -------------------------------
// Toast Notification
// -------------------------------

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

// -------------------------------
// Scroll Animation
// -------------------------------

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

});

document.querySelectorAll(

    ".feature,.tool-card,.stat-card,.history"

).forEach(el => {

    el.classList.add("hidden");

    observer.observe(el);

});

// -------------------------------
// Auto Scroll Chat
// -------------------------------

function scrollChat() {

    chatBox.scrollTop = chatBox.scrollHeight;

}

// -------------------------------
// Clear Chat
// -------------------------------

function clearChat() {

    if (confirm("Clear chat history?")) {

        chatBox.innerHTML = "";

        showToast("🗑️ Chat Cleared");

    }

}

// -------------------------------
// Clear Favorites
// -------------------------------

function clearFavorites() {

    favorites = [];

    localStorage.removeItem("favorites");

    loadFavorites();

    showToast("⭐ Favorites Cleared");

}

// -------------------------------
// Clear History
// -------------------------------

function clearHistory() {

    history = [];

    localStorage.removeItem("history");

    loadHistory();

    showToast("🗑️ History Cleared");

}

// -------------------------------
// Window Loaded
// -------------------------------

window.onload = () => {

    loadHistory();

    loadFavorites();

    loadStats();

};// ==========================================
// EduGenie AI - Professional Script.js
// Part 4 (Final)
// ==========================================

// -------------------------------
// Format AI Response
// -------------------------------

function formatAIResponse(text) {

    if (!text) return "";

    // Remove markdown
    text = text.replace(/\*\*/g, "");
    text = text.replace(/```/g, "");
    text = text.replace(/---/g, "");
 // Roadmap formatting
    text = text.replace(/Beginner/gi, "\n📘 Beginner");
    text = text.replace(/Intermediate/gi, "\n📗 Intermediate");
    text = text.replace(/Advanced/gi, "\n📕 Advanced");
    text = text.replace(/Projects/gi, "\n💻 Projects");
    text = text.replace(/Resources/gi, "\n📚 Resources");

    return text.trim();

}

// -------------------------------
// Loading
// -------------------------------

function showLoading() {

    if (loading) {

        loading.style.display = "flex";

    }

}

function hideLoading() {

    if (loading) {

        loading.style.display = "none";

    }

}

// -------------------------------
// Typing Effect
// -------------------------------

function typingEffect(message) {

    message = formatAIResponse(message);

    const wrapper = document.createElement("div");

    wrapper.className = "bot-message";

    wrapper.innerHTML = `

        <div class="avatar">🤖</div>

        <div class="message"></div>

    `;

    chatBox.appendChild(wrapper);

    const output = wrapper.querySelector(".message");

    let i = 0;

    const speed = 8;

    function type() {

        if (i < message.length) {

            output.innerHTML += message.charAt(i);

            i++;

            chatBox.scrollTop = chatBox.scrollHeight;

            setTimeout(type, speed);

        }

    }

    type();

}

// -------------------------------
// Smooth Scroll
// -------------------------------

function scrollBottom() {

    chatBox.scrollTo({

        top: chatBox.scrollHeight,

        behavior: "smooth"

    });

}

// -------------------------------
// Focus Input
// -------------------------------

function focusInput() {

    askInput.focus();

}

// -------------------------------
// Reset Input
// -------------------------------

function resetInput() {

    askInput.value = "";

    focusInput();

}

// -------------------------------
// Keyboard Shortcut
// -------------------------------

document.addEventListener("keydown", function(e){

    if(e.ctrlKey && e.key==="Enter"){

        sendMessage();

    }

});

// -------------------------------
// Welcome Message
// -------------------------------

window.addEventListener("load", ()=>{

    setTimeout(()=>{

        if(chatBox.children.length===0){

            addBotMessage(

`👋 Welcome to EduGenie AI!

I can help you with:

📘 Ask Questions

📖 Explain Concepts

📝 Generate Quizzes

📄 Summarize Notes

🛣️ Learning Roadmaps`

            );

        }

    },600);

});

// -------------------------------
// Auto Focus
// -------------------------------

focusInput();

// -------------------------------
// End of File
// -------------------------------