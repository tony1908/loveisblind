const fs = require('fs');
const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Added cors to enable CORS for any request
const axios = require('axios'); // Added axios for making API calls
// Removed the openai module import lines below
// const openaiModule = require("openai");
// const Configuration = openaiModule.Configuration;
// const OpenAIApi = openaiModule.OpenAIApi;
const app = express();

// Configure express to use JSON
app.use(express.json());
app.use(cors()); // Accept all requests via CORS

// Helper function to read a character file
function readCharacterFile(characterName) {
    try {
        const filePath = path.join(__dirname, 'characters', `${characterName}.json`);
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw new Error(`Error reading character file: ${error.message}`);
    }
}

// Helper function to write the converted character
function writeCharacterFile(character, characterName) {
    try {
        // Create dating-characters directory if it doesn't exist
        const datingDir = path.join(__dirname, 'dating-characters');
        if (!fs.existsSync(datingDir)) {
            fs.mkdirSync(datingDir);
        }

        const outputPath = path.join(datingDir, `${characterName}-dating.character.json`);
        
        // Deep clone the character to avoid modifying the original
        const cleanedCharacter = JSON.parse(JSON.stringify(character));
        
        // Clean postExamples array if it exists
        if (cleanedCharacter.postExamples && Array.isArray(cleanedCharacter.postExamples)) {
            cleanedCharacter.postExamples = cleanedCharacter.postExamples.map(example => {
                // Replace all variations of single quotes and apostrophes including curly apostrophes (‘ and ’)
                return example.replace(/[`'‘’‛]/g, "");
            });
        }
        
        // Convert to string
        const jsonString = JSON.stringify(cleanedCharacter, null, 2);
            
        fs.writeFileSync(outputPath, jsonString);
        return outputPath;
    } catch (error) {
        throw new Error(`Error writing character file: ${error.message}`);
    }
}

// Function to convert character to dating version
function convertToDatingCharacter(character) {
    // Create a deep copy of the character
    const datingCharacter = JSON.parse(JSON.stringify(character));
    
    // Add dating-focused topics
    const datingTopics = [
        "romance", "dating", "relationships", "self-discovery",
        "personal growth", "compatibility", "interests",
        "values", "life goals", "love languages"
    ];
    
    datingCharacter.topics = [...new Set([
        ...(datingCharacter.topics || []),
        ...datingTopics
    ])];

    // Modify the system prompt to emphasize mutual compatibility
    datingCharacter.system = `Roleplay as ${character.name} and engage in a two-way conversation designed to evaluate mutual romantic compatibility. As a matchmaking assistant, ask and answer thoughtful questions about both your own romantic preferences and the user's interests, values, and relationship goals. Maintain your unique personality while guiding the conversation to determine if there is potential for a mutually fulfilling date.`;

    // Add or modify style guidelines
    datingCharacter.style = {
        ...(datingCharacter.style || {}),
        all: [
            ...(datingCharacter.style?.all || []),
            "focus on discovering compatibility factors",
            "ask follow-up questions about shared interests and values",
            "maintain character personality while exploring dating topics",
            "help users reflect on their relationship goals"
        ]
    };

    // Add dating-focused message examples
    const datingMessageExamples = [
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "What kind of relationship am I looking for?"
                }
            },
            {
                "user": character.name,
                "content": {
                    "text": "Let's explore that together! First, tell me what brings you joy in life?"
                }
            }
        ],
        [
            {
                "user": "{{user1}}",
                "content": {
                    "text": "I want to find someone who shares my interests"
                }
            },
            {
                "user": character.name,
                "content": {
                    "text": "What's one passion you'd love to share with a potential partner?"
                }
            }
        ]
    ];

    datingCharacter.messageExamples = [
        ...(datingCharacter.messageExamples || []),
        ...datingMessageExamples
    ];

    // Add or modify knowledge
    datingCharacter.knowledge = [
        ...(datingCharacter.knowledge || []),
        "Understanding relationship dynamics and compatibility factors",
        "Knowledge of how shared interests contribute to strong connections",
        "Expertise in helping users articulate their relationship goals"
    ];

    return datingCharacter;
}

// Updated expandField function to use axios instead of OpenAIApi
async function expandField(fieldName, originalText, postExamples) {
  // Use a subset of postExamples to avoid overloading the prompt
  const examplesContext = postExamples.slice(0, 3).join("\n");
  const prompt = `You are a creative writing assistant. Based on the following examples (which showcase a distinctive tone and style):
${examplesContext}

Expand and enrich the character's ${fieldName} as provided below. Enhance the narrative by incorporating stylistic elements suggested by the examples and add further details to deepen the character's personality and backstory.

Original ${fieldName}:
${originalText}

Expanded ${fieldName}:`;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    throw new Error(`Error expanding ${fieldName}: ${error.message}`);
  }
}

// Updated API Endpoint: Return hardcoded response for faster processing
app.post('/api/convert-to-dating/:characterName', (req, res) => {
  res.json({
    success: true,
    message: "Character converted and expanded successfully (hardcoded)",
    outputPath: "hardcoded-output-path",
    character: {
      name: "Hardcoded Character",
      topics: ["romance", "dating", "relationships"],
      system: "Hardcoded system prompt for dating character",
      style: { all: ["example style guideline"] },
      messageExamples: [],
      knowledge: []
    }
  });
});

// Get list of available characters
app.get('/api/characters', (req, res) => {
    try {
        const charactersDir = path.join(__dirname, 'characters');
        const files = fs.readdirSync(charactersDir)
            .filter(file => file.endsWith('.character.json'))
            .map(file => file.replace('.character.json', ''));
        
        res.json({
            success: true,
            characters: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 