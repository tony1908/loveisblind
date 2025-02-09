// Load environment variables from .env file
require('dotenv').config();

// dependencies and setup
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // allow cross origin requests

const app = express();
app.use(express.json());
app.use(cors()); // enable CORS for all routes

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY environment variable.");
  process.exit(1);
}

// Global in‑memory conversation store
const conversations = {};

// POST endpoint to send a message using a conversation id and username passed on the path
app.post('/api/conversations/:conversationId/:username/sendMessage', async (req, res) => {
  // Extract message from request body
  const { message } = req.body;
  // Extract conversationId and username from the path parameters
  const conversationId = req.params.conversationId;
  const username = req.params.username;

  console.log(conversationId);
  console.log(username);
  console.log(message); 
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  
  // Load character data dynamically based on the username in the path
  let characterData;
  try {
    const charFilePath = path.join(__dirname, 'characters', `${username}-dating.character.json`);
    console.log(charFilePath);
    const charData = fs.readFileSync(charFilePath, 'utf8');
    characterData = JSON.parse(charData);
  } catch (error) {
    console.error(`Error loading character file for ${username}:`, error);
    return res.status(500).json({ error: `Character file for ${username} not found.` });
  }
  
  // Construct system message including personality and style guidelines from dynamically loaded characterData
  const systemMessage = characterData.system +
    (characterData.style && characterData.style.chat ? " " + characterData.style.chat.join(" ") : "");
  
  // Create a unique conversation key combining conversationId and username
  const conversationKey = `${conversationId}-${username}`;
  
  // Initialize conversation if it doesn't exist using the composite conversation key
  if (!conversations[conversationKey]) {
    conversations[conversationKey] = [{ role: "system", content: systemMessage }];
  }
  
  // Append the new user message to the conversation context using the provided username
  conversations[conversationKey].push({ role: "user", name: username, content: message });

  // Use the conversation history as the messages payload for OpenAI
  const openaiMessages = conversations[conversationKey];

  // Prepare payload for OpenAI API
  const openaiPayload = {
    model: "gpt-4",
    messages: openaiMessages,
    temperature: 0.7,
    max_tokens: 150
  };

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
  };

  try {
    // Call OpenAI's Chat Completion API using axios
    const apiResponse = await axios.post("https://api.openai.com/v1/chat/completions", openaiPayload, { headers });

    // Extract the reply and append it to conversation context
    const reply = apiResponse.data.choices[0].message.content;
    conversations[conversationKey].push({ role: "assistant", content: reply });
    res.json({ reply, conversationId });
  } catch (error) {
    console.error("Error calling OpenAI API:", error.message);
    res.status(500).json({ error: "Failed to generate a reply." });
  }
});

// NEW endpoint to list all available character names
app.get('/api/characters', (req, res) => {
  const charactersDir = path.join(__dirname, 'characters');
  try {
    const files = fs.readdirSync(charactersDir);
    const availableCharacters = files
      .filter(file => file.endsWith('-dating.character.json'))
      .map(file => file.replace('-dating.character.json', ''));
    console.log(availableCharacters);
    res.json({ characters: availableCharacters });
  } catch (error) {
    console.error('Error reading characters directory:', error);
    res.status(500).json({ error: 'Failed to list characters.' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
