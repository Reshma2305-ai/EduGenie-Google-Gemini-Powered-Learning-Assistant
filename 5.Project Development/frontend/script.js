/* ==========================================
   EduGenie AI Learning Assistant
   script.js - Part 1
========================================== */

// ===============================
// Backend URL
// ===============================

// Local FastAPI
const API_BASE = "http://127.0.0.1:8000";

// For Render deployment use:
// const API_BASE = "https://your-render-url.onrender.com";


// ===============================
// DOM Elements
// ===============================

const toolSelect = document.getElementById("tool");

const userInput = document.getElementById("userInput");

const submitBtn = document.getElementById("submitBtn");

const responseBox = document.getElementById("response");

const loading = document.getElementById("loading");

const scrollTopBtn = document.getElementById("scrollTop");

const floatingAI = document.getElementById("floatingAI");

const toast = document.getElementById("toast");

const toastText = document.getElementById("toastText");

const darkBtn = document.getElementById("themeBtn");
const voiceBtn = document.getElementById("voiceBtn");
const speakBtn = document.getElementById("speakBtn");
const stopSpeakBtn = document.getElementById("stopSpeakBtn");
const copyBtn=document.getElementById("copyBtn");

const downloadTxtBtn=document.getElementById("downloadTxtBtn");

const downloadPdfBtn=document.getElementById("downloadPdfBtn");




const pdfFile = document.getElementById("pdfFile");

const choosePdfBtn = document.getElementById("choosePdfBtn");

const uploadPdfBtn = document.getElementById("uploadPdfBtn");

const pdfName = document.getElementById("pdfName");


// ===============================
// Toast Notification
// ===============================

function showToast(message){

    toastText.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}


// ===============================
// Loading Animation
// ===============================

function showLoading(){

    loading.classList.remove("hidden");

}

function hideLoading(){

    loading.classList.add("hidden");

}


// ===============================
// Scroll To Top
// ===============================

window.addEventListener("scroll",()=>{

    if(window.scrollY>300){

        scrollTopBtn.style.display="block";

    }else{

        scrollTopBtn.style.display="none";

    }

});

scrollTopBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});


// ===============================
// Floating AI Button
// ===============================
choosePdfBtn.addEventListener("click", () => {

    pdfFile.click();

});
pdfFile.addEventListener("change", () => {

    if(pdfFile.files.length > 0){

        pdfName.textContent = pdfFile.files[0].name;

    }

    else{

        pdfName.textContent = "No file selected";

    }

});
floatingAI.addEventListener("click",()=>{

    userInput.focus();

    userInput.scrollIntoView({

        behavior:"smooth",

        block:"center"

    });

});
uploadPdfBtn.addEventListener("click", async () => {

    if(pdfFile.files.length === 0){

        alert("Please choose a PDF first.");

        return;

    }

    const formData = new FormData();

    formData.append("file", pdfFile.files[0]);

    responseBox.innerHTML = `
        <div class="loading">
            ⏳ Uploading PDF...
        </div>
    `;

    try{

        const response = await fetch("http://127.0.0.1:8000/upload-pdf",{

            method:"POST",

            body:formData

        });

        const data = await response.json();

        if(data.success){

            responseBox.innerHTML = `
                <h3>📄 PDF Summary</h3>
                <pre>${data.response}</pre>
            `;

        }

        else{

            responseBox.innerHTML = `
                <span style="color:red">
                    ${data.response}
                </span>
            `;

        }

    }

    catch(error){

        console.log(error);

        responseBox.innerHTML = `
            <span style="color:red">
                Unable to connect to backend.
            </span>
        `;

    }

});

// ===============================
// Dark Mode
// ===============================

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark");

}

darkBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("theme","dark");

    }else{

        localStorage.setItem("theme","light");

    }

});


// ===============================
// API Mapping
// ===============================

function getEndpoint(){

    const tool = toolSelect.value;

    switch(tool){

        case "qna":

            return "/qna";

        case "explain":

            return "/explain";

        case "summary":

            return "/summarize";

        case "quiz":

            return "/quiz";

        case "learning":

            return "/learning-path";

        default:

            return "/qna";

    }

}function showToast(message){

    toastText.innerText=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}
copyBtn.addEventListener("click",()=>{

    const text=responseBox.innerText;

    if(text===""){

        showToast("No response available.");

        return;

    }

    navigator.clipboard.writeText(text);

    showToast("Response copied successfully!");

});
copyBtn.addEventListener("click",()=>{

    const text=responseBox.innerText;

    if(text===""){

        showToast("No response available.");

        return;

    }

    navigator.clipboard.writeText(text);

    showToast("Response copied successfully!");

});
downloadTxtBtn.addEventListener("click",()=>{

    const text=responseBox.innerText;

    if(text===""){

        showToast("Nothing to download.");

        return;

    }

    const blob=new Blob([text],{

        type:"text/plain"

    });

    const link=document.createElement("a");

    link.href=URL.createObjectURL(blob);

    link.download="EduGenie_Response.txt";

    link.click();

    showToast("TXT downloaded.");

});
downloadPdfBtn.addEventListener("click",()=>{

    const text=responseBox.innerText;

    if(text===""){

        showToast("Nothing to download.");

        return;

    }

    const { jsPDF }=window.jspdf;

    const pdf=new jsPDF();

    const lines=pdf.splitTextToSize(text,180);

    pdf.text(lines,10,20);

    pdf.save("EduGenie_Response.pdf");

    showToast("PDF downloaded.");

});/* ==========================================
   EduGenie AI Learning Assistant
   script.js - Part 2
========================================== */

// ===============================
// Generate AI Response
// ===============================

submitBtn.addEventListener("click", async () => {

    const text = userInput.value.trim();

    if(text===""){

        showToast("Please enter your question.");

        return;

    }

    responseBox.innerHTML="";

    showLoading();

    try{

        const endpoint = getEndpoint();

        const response = await fetch(API_BASE + endpoint,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                text:text

            })

        });

        if(!response.ok){

            throw new Error("Server Error");

        }

        const data = await response.json();

        hideLoading();

        typeWriter(data.response);

        showToast("Response Generated Successfully");

    }

    catch(error){

        hideLoading();

        responseBox.innerHTML=`

        <div style="color:red;
                    font-size:18px;
                    font-weight:600;">

            ❌ Unable to connect to FastAPI Server

            <br><br>

            Make sure

            <br>

            ✔ Backend is running

            <br>

            ✔ URL is correct

            <br>

            ✔ CORS is enabled

        </div>

        `;

        console.error(error);

        showToast("Connection Failed");

    }

});
const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

if(SpeechRecognition){

    const recognition = new SpeechRecognition();

    recognition.lang="en-US";

    recognition.interimResults=false;

    recognition.maxAlternatives=1;

    voiceBtn.addEventListener("click",()=>{

        recognition.start();

        voiceBtn.innerHTML="🎙 Listening...";

    });

    recognition.onresult=(event)=>{

        const speech=event.results[0][0].transcript;

        userInput.value=speech;

        voiceBtn.innerHTML="🎤 Voice Input";

    };

    recognition.onerror=()=>{

        alert("Voice recognition failed.");

        voiceBtn.innerHTML="🎤 Voice Input";

    };

    recognition.onend=()=>{

        voiceBtn.innerHTML="🎤 Voice Input";

    };

}
else{

    voiceBtn.disabled=true;

    voiceBtn.innerHTML="Voice Not Supported";

}
let speech;

speakBtn.addEventListener("click",()=>{

    speechSynthesis.cancel();

    const text=responseBox.innerText;

    if(text===""){

        alert("No response available.");

        return;

    }

    speech=new SpeechSynthesisUtterance(text);

    speech.lang="en-US";

    speech.rate=1;

    speech.pitch=1;

    speech.volume=1;

    speechSynthesis.speak(speech);

});
stopSpeakBtn.addEventListener("click",()=>{

    speechSynthesis.cancel();

});


// ===============================
// Enter Key Support
// ===============================

userInput.addEventListener("keydown",(event)=>{

    if(event.key==="Enter" && event.ctrlKey){

        submitBtn.click();

    }

});


// ===============================
// Clear Response when Tool Changes
// ===============================

toolSelect.addEventListener("change",()=>{

    responseBox.innerHTML=`

    <div style="opacity:.6">

        Ready for new request...

    </div>

    `;

});


// ===============================
// Character Counter
// ===============================

const counter=document.createElement("div");

counter.style.marginTop="10px";

counter.style.textAlign="right";

counter.style.fontSize="14px";

counter.style.color="#777";

userInput.parentNode.appendChild(counter);

userInput.addEventListener("input",()=>{

    counter.innerHTML=

    userInput.value.length+

    " Characters";

});


// ===============================
// Disable Button During Request
// ===============================

function disableButton(){

    submitBtn.disabled=true;

    submitBtn.innerHTML=

    '<i class="fa fa-spinner fa-spin"></i> Processing...';

}

function enableButton(){

    submitBtn.disabled=false;

    submitBtn.innerHTML=

    '<i class="fa-solid fa-paper-plane"></i> Generate';

}
/* ==========================================
   EduGenie AI Learning Assistant
   script.js - Part 3
========================================== */

// ===============================
// Typewriter Effect
// ===============================

function typeWriter(text){

    responseBox.innerHTML = "";

    let index = 0;

    const speed = 15;

    function type(){

        if(index < text.length){

            responseBox.innerHTML += text.charAt(index);

            index++;

            responseBox.scrollTop = responseBox.scrollHeight;

            setTimeout(type, speed);

        }

    }

    type();

}

// ===============================
// Welcome Toast
// ===============================

window.addEventListener("load",()=>{

    setTimeout(()=>{

        showToast("Welcome to EduGenie AI 🚀");

    },800);

});

// ===============================
// Animated Statistics
// ===============================

const statNumbers=document.querySelectorAll(".stat-card h2");

statNumbers.forEach((card)=>{

    const value=card.innerText;

    if(!isNaN(parseInt(value))){

        let current=0;

        let target=parseInt(value);

        let timer=setInterval(()=>{

            current++;

            card.innerText=current+"+";

            if(current>=target){

                clearInterval(timer);

                card.innerText=value;

            }

        },20);

    }

});

// ===============================
// Sidebar Active Menu
// ===============================

const menuItems=document.querySelectorAll(".sidebar ul li");

menuItems.forEach((item)=>{

    item.addEventListener("click",()=>{

        menuItems.forEach((i)=>{

            i.classList.remove("active");

        });

        item.classList.add("active");

    });

});

// ===============================
// Keyboard Shortcut
// Ctrl + Enter
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="Enter"){

        submitBtn.click();

    }

});

// ===============================
// Escape clears textbox
// ===============================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        userInput.value="";

    }

});

// ===============================
// Auto Resize Textarea
// ===============================

userInput.addEventListener("input",()=>{

    userInput.style.height="auto";

    userInput.style.height=userInput.scrollHeight+"px";

});

// ===============================
// Floating Button Animation
// ===============================

setInterval(()=>{

    floatingAI.animate(

        [

            {transform:"translateY(0px)"},

            {transform:"translateY(-8px)"},

            {transform:"translateY(0px)"}

        ],

        {

            duration:1800

        }

    );

},1800);

// ===============================
// Copy Response on Double Click
// ===============================

responseBox.addEventListener("dblclick",()=>{

    const text=responseBox.innerText;

    if(text.trim()==="") return;

    navigator.clipboard.writeText(text);

    showToast("Response copied to clipboard!");

});

// ===============================
// Tool Change Placeholder
// ===============================

toolSelect.addEventListener("change",()=>{

    const tool=toolSelect.value;

    switch(tool){

        case "qna":

            userInput.placeholder="Ask any educational question...";

            break;

        case "explain":

            userInput.placeholder="Enter a concept to explain...";

            break;

        case "summary":

            userInput.placeholder="Paste text to summarize...";

            break;

        case "quiz":

            userInput.placeholder="Enter a topic for quiz generation...";

            break;

        case "learning":

            userInput.placeholder="Enter a topic for a learning path...";

            break;

    }

});

// ===============================
// Console Message
// ===============================

console.log("%cEduGenie AI Learning Assistant","color:#2563eb;font-size:20px;font-weight:bold;");
console.log("Powered by FastAPI + Google Gemini");

// ===============================
// End
// ===============================