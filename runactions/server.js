const express = require('express');
// Import cors for cross-origin resource sharing
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());

const port = 3005;

app.get('/scrape-twitter/:username', (req, res) => {
    const username = req.params.username;
    const scriptPath = '/Users/tony/Documents/Development/hackathones/ethglobal/agentic/tests/twitter-scraper-finetune';

    console.log(`[Twitter Scraper] Starting Twitter scraping for user: ${username}`);
    
    // Send immediate response
    res.json({ 
        status: 'processing', 
        message: `Started Twitter scraping for user: ${username}` 
    });

    // Spawn the twitter scraping process with stdio configuration
    const process = spawn('npm', ['run', 'twitter', '--', username], {
        cwd: scriptPath,
        stdio: ['pipe', 'pipe', 'pipe'] // Enable stdin, stdout, stderr
    });

    // Handle the prompt by writing 'n' when we see it
    process.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[Twitter Scraper Output]: ${output}`);
        
        if (output.includes('Would you like to see a sample of collected tweets?')) {
            process.stdin.write('n\n'); // Write 'n' and newline
            console.log('[Twitter Scraper]: Automatically responded "n" to sample prompt');
        }
    });

    // Log stderr
    process.stderr.on('data', (data) => {
        console.error(`[Twitter Scraper Error]: ${data}`);
    });

    // When twitter scraping ends, run character command
    process.on('close', (code) => {
        console.log(`[Twitter Scraper] Process exited with code ${code}`);
        
        // Continue with character generation even if Twitter scraper had cleanup errors
        console.log('[Character Generation] Starting character generation...');
        const date = '2025-02-07';
        
        const characterProcess = spawn('npm', ['run', 'character', '--', username, date], {
            cwd: scriptPath
        });

        characterProcess.stdout.on('data', (data) => {
            console.log(`[Character Generation Output]: ${data}`);
        });

        characterProcess.stderr.on('data', (data) => {
            console.error(`[Character Generation Error]: ${data}`);
        });

        characterProcess.on('close', (characterCode) => {
            console.log(`[Character Generation] Process exited with code ${characterCode}`);
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 