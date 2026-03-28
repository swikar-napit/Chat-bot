const BYTEZ_API_KEY = '8c824b6a2cbf762622ed1c9e5e66e60c';

const systemPrompt = `You are the official, friendly AI Chatbot for "Shikshyalaya College". You know everything about the college based on the website https://shikshyalayacollege.edu.np/. 
    
    DO NOT SEARCH THE WEB. Use ONLY the following factual knowledge base to answer questions:

--- COLLEGE DETAILS ---
- Name: Shikshyalaya College
- Tagline: "A Gateway to Excellence: Building Foundations for Lifelong Success"
- Location: Lokanthali, Bhaktapur, Nepal
- Affiliation: Far Western University (FWU)
- Contact Email: info@shikshyalayacollege.edu.np
- Phone Numbers: 016636400, 016636100
- Principal: Ashutosh Rimal
- Established Year: 2024
- Type: Private College
- Academic Environment: Student-focused and career-oriented
- Medium of Instruction: English
- Focus Areas: IT, Business, and Management Studies

--- ACADEMIC PROGRAMS ---
1. B.Sc. CSIT (Bachelor of Science in Computer Science & Information Technology):
   - Total Capacity: 76 Students
   - Duration: 4 Years (8 Semesters)
   - Key Subjects: Programming, Database, Networking, AI basics
   - Career Scope: Software Developer, IT Officer, System Analyst

2. BBA (Bachelor of Business Administration):
   - Total Capacity: 30 Students
   - Duration: 4 Years (8 Semesters)
   - Key Subjects: Marketing, Finance, HRM, Entrepreneurship
   - Career Scope: Manager, Entrepreneur, Business Analyst

3. MBA (Master of Business Administration):
   - Duration: 2 Years
   - Specializations: Finance, Marketing, HRM
   - Focus: Leadership, strategic management, real-world business skills

--- STUDENT CLUBS & LIFE ---
- Clubs Available:
  - Shikshyalaya IT Club (coding, tech events, workshops)
  - Shikshyalaya Unity Club (social work, teamwork activities)
- Life:
  - Regular extracurricular activities and competitions
  - Leadership development programs
  - Hult Prize active participation on campus
  - Workshops, seminars, and training sessions
  - Sports and cultural events
  - Friendly and inclusive student community

--- INSTRUCTIONS ---
1. Always be polite, warm, and helpful. Start with "Namaste" if it's a greeting.
2. Keep answers concise, clear, and easy to read.
3. Provide accurate information about programs, facilities, and student life.
4. Encourage students with a positive and supportive tone.`;

let chatHistory = [
  { role: 'system', content: systemPrompt }
];

// FIX 1: Add absolute safety check to ensure text is ALWAYS a string
function formatText(text) {
  if (!text) return "";
  const str = typeof text === 'string' ? text : JSON.stringify(text);
  return str.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
}

async function sendMessage() {
  const inputEl = document.getElementById('user-input');
  const message = inputEl.value.trim();
  if (!message) return;

  appendMessage('user', message);
  inputEl.value = '';

  chatHistory.push({ role: 'user', content: message });

  const typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.style.display = 'block';

  try {
    const options = {
      method: 'POST',
      headers: {
        'Authorization': BYTEZ_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: chatHistory
      })
    };

    const response = await fetch('https://api.bytez.com/models/v2/google/gemini-3.1-pro-preview', options);

    if (!response.ok) throw new Error("API Network error");

    const data = await response.json();

    if (data.error) {
      console.error("Bytez API Error:", data.error);
      appendMessage('bot', 'Sorry, the AI encountered an error processing your request.');
      return;
    }

    let reply = data.output;

    // FIX 2: Gracefully extract text if Gemini returns an Array or Object
    if (Array.isArray(reply)) {
      // If it's an array, grab the text from the first item
      reply = reply[0]?.generated_text || reply[0]?.text || reply[0]?.content || reply[0];
    } else if (typeof reply === 'object' && reply !== null) {
      // If it's an object, grab the text parameter
      reply = reply.generated_text || reply.text || reply.content;
    }

    // Fallback for OpenAI style formats
    if (!reply && data.choices && data.choices[0].message) {
      reply = data.choices[0].message.content;
    }

    // Final safety net before sending to HTML
    if (typeof reply !== 'string') {
      reply = JSON.stringify(reply) || "Sorry, I received an unreadable response.";
    }

    chatHistory.push({ role: 'assistant', content: reply });
    appendMessage('bot', reply);

  } catch (error) {
    console.error("Chatbot Error:", error);
    appendMessage('bot', 'Sorry, I am having trouble connecting to the Bytez server right now.');
  } finally {
    typingIndicator.style.display = 'none';
  }
}

function appendMessage(sender, text) {
  const messagesDiv = document.getElementById('chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `message ${sender}`;
  msgDiv.innerHTML = formatText(text);
  messagesDiv.appendChild(msgDiv);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function handleKeyPress(e) {
  if (e.key === 'Enter') {
    sendMessage();
  }
}
