# Chatbot Backend
This repository contains the backend code for a chatbot application. The backend is built with Node.js, Express, and MongoDB.

## Overview

The chatbot backend provides API endpoints for user authentication, handling chat messages, managing user profiles, and more. It includes routes for user registration, login, user profile retrieval, chat message handling, and other functionalities (Deleting user rofile and clearin chat history).

## Project Structure
Chatbot-backend
- **Models:** Contains the MongoDB schema for the User model.
- **Routes:** Defines routes and controllers for handling authentication and chat-related functionalities.
- **index.js:** Entry point for the Express application.
- **package-lock.json:** Auto-generated file for npm dependencies.
- **package.json:** Configuration file for npm.

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB installed and running

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/Chatbot-backend.git
```

2. install dependencies
```bash
cd Chatbot-backend
npm install
```

3. setup environment variables. ( Create a .env file in the root of the project with the following variables )
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/your-database-name
SECRET_KEY=your-secret-key
```

4. Run the application
```
npm run
```

## API Endpoints
- POST /auth/register: Register a new user.
- POST /auth/login: Log in a user.
- GET /auth/user-profile: Retrieve user profile.
- POST /auth/logout: Log out a user.
- POST /auth/chat/send: Send a chat message.
- GET /auth/chat/history: Retrieve chat history.
- POST /auth/clear-chat-history: Clear chat history.
- DELETE /auth/user/:userId: Delete a user.


Make sure to replace placeholders like `your-username`, `your-database-name`, and `your-secret-key` with your actual details. Additionally, update the MongoDB connection URI in the `.env` example based on your setup.


