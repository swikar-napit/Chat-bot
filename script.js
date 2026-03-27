const userMessage = [
  ["hi", "hey", "hello", "namaste"],
  ["location", "where is shikshyalaya college", "address"],
  ["about", "tell me about shikshyalaya", "shikshyalaya college"],
  ["courses", "programs", "study", "faculties", "what can i study"],
  ["admission", "apply", "how to join"],
  ["motto", "vision", "aim"],
  ["scholarship", "financial aid", "discount"],
  ["facilities", "library", "lab", "computer lab"],
  ["principal", "chairman", "who leads"],
  ["contact", "phone", "email"]
];

const botReply = [
  ["Hello! I am the Shikshyalaya Assistant. Ask me anything about our college!"],
  ["Shikshyalaya College is located in Lokanthali, Bhaktapur. It's very accessible from both Kathmandu and Lalitpur."],
  ["Shikshyalaya College is a premier institution affiliated with Far Western University (FWU). We focus on practical learning."],
  ["We offer undergraduate and graduate programs: <br>1. BSc.CSIT<br>2. BBA<br>3. MBA"],
  ["You can apply by visiting our campus in Lokanthali or through our website. Admissions involve an entrance exam."],
  ["Our motto is 'A Gateway to Excellence: Building Foundations for Lifelong Success.'"],
  ["Yes! We offer merit-based scholarships and need-based support for deserving students."],
  ["We provide high-tech computer labs, a digital library, and interactive classrooms."],
  ["The college is led by a team of experienced educators, including Mr. Tanka Raj Acharya."],
  ["Call us: 01-6636400 / 01-6636100 or email: info@shikshyalayacollege.edu.np"]
];

const alternative = [
  "I'm still learning! Could you please rephrase that?",
  "I don't have that info yet. Try asking about our BSc.CSIT or BBA programs!",
  "Sorry, I didn't catch that."
];

function sendMessage() {
  const inputField = document.getElementById("input");
  let input = inputField.value.trim();
  if (input != "") output(input);
  inputField.value = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("input");
  inputField.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      let input = inputField.value.trim();
      if (input != "") output(input);
      inputField.value = "";
    }
  });
});

function output(input) {
  let product;
  let text = input.toLowerCase().replace(/[^\w\s]/gi, "").trim();

  let found = false;
  for (let i = 0; i < userMessage.length; i++) {
    for (let j = 0; j < userMessage[i].length; j++) {
      if (text.includes(userMessage[i][j])) {
        product = botReply[i][Math.floor(Math.random() * botReply[i].length)];
        found = true;
        break;
      }
    }
    if (found) break;
  }

  if (!product) {
    product = alternative[Math.floor(Math.random() * alternative.length)];
  }

  addChat(input, product);
}

function addChat(input, product) {
  const mainDiv = document.getElementById("message-section");

  let userDiv = document.createElement("div");
  userDiv.id = "user";
  userDiv.classList.add("message");
  userDiv.innerHTML = `<span id="user-response">${input}</span>`;
  mainDiv.appendChild(userDiv);

  let botDiv = document.createElement("div");
  botDiv.id = "bot";
  botDiv.classList.add("message");
  botDiv.innerHTML = `<span id="bot-response">${product}</span>`;
  mainDiv.appendChild(botDiv);

  mainDiv.scrollTop = mainDiv.scrollHeight;
}