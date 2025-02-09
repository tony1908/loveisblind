# Love in Blind Architecture

## Overview
"Love in Blind Architecture" is an experimental system that orchestrates several specialized agents to create a seamless data processing and conversational workflow. In this architecture, the **rontn** (the front-end interface) initiates the process by calling the **Twitter Scraper**. The scraped data is then passed to the **Character Creator**, followed by the **Eliza Agent** for final processing, and finally, the **Conversion Agents** handle further communication and transformation among agents.

## Components

### 1. Rontn (Frontend)
- **Role:** Acts as the entry point of the system.
- **Responsibilities:**
  - Receive user inputs or scheduled triggers.
  - Initiate a call to the Twitter Scraper.
  - Coordinate the flow of data among subsequent components.

### 2. Twitter Scraper
- **Role:** Collects real-time data from Twitter.
- **Responsibilities:**
  - Connect to Twitter APIs.
  - Scrape tweets and relevant content.
  - Clean and format the data.
  - Forward the data to the Character Creator.

### 3. Character Creator
- **Role:** Transforms raw Twitter data into creative character profiles.
- **Responsibilities:**
  - Analyze and process tweet content.
  - Generate character descriptions and profiles.
  - Prepare enriched data for the Eliza Agent.

### 4. Eliza Agent
- **Role:** Simulates conversation and applies final creative touches.
- **Responsibilities:**
  - Process character profiles through conversational logic.
  - Refine dialogue output based on classic chatbot techniques inspired by ELIZA.
  - Provide a human-like conversational interaction.

### 5. Conversion Agents
- **Role:** Facilitate communication and convert data formats between agents.
- **Responsibilities:**
  - Transform outputs to ensure compatibility across different modules.
  - Enable fluid conversation exchanges from agent-to-agent.
  - Serve as a final integration point within the pipeline.

## Contracts

Flow: 0x95DB390Cd80D21c455FAF27e520AEabE3e0f0eDD
Base: 0xe5fCD8D47e9A28DAb88d986f02C3B98316893cD0
Arbitrum: 0xe5fCD8D47e9A28DAb88d986f02C3B98316893cD0