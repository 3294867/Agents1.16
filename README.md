# Agents

A modern AI agent management platform built with Express.js and React that allows users to create, manage, and interact with specialized AI agents.

## 🚀 Features

- **Multi-Agent System**: Support for specialized AI agents (General, Math, Geography, Literature)
- **Real-time Chat Interface**: Interactive conversations with AI agents
- **User Authentication**: Secure sign-up, login, and session management
- **Thread Management**: Organize conversations into threads
- **Real-time Updates**: Live chat with streaming responses

## 🏗️ Architecture

### Frontend (Client)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules
- **State Management**: IndexedDB, localStorage, Custom hooks
- **Routing**: React Router DOM
- **UI Components**: Custom component library

### Backend (Server)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: express-session for session management
- **AI Integration**: OpenAI API integration
- **Security**: CORS, compression, secure session handling

## 📁 Project Structure

```
Agents1.16/
├── client/                   # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── features/         # Feature-based modules
│   │   │   ├── agent/        # Agent management
│   │   │   ├── layout/       # Application layout
│   │   │   └── thread/       # Chat thread management
│   │   ├── hooks/            # Custom React hooks
│   │   ├── storage/          # Data layer
|   |   |   ├── indexedDB     # Storing data on the client
|   |   |   ├── postgresDB    # Server calls management
|   |   |   └── localStorage  # Mainly storing tabs data
│   │   ├── opanai/           # OpenAI API integration
│   │   └── types.ts          # TypeScript type definitions
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
├── server/                   # Backend Node.js application
│   ├── src/
│   │   ├── controllers/      # API endpoint handlers
│   │   ├── db.ts             # Database connection
│   │   ├── route.ts          # API route definitions
│   │   └── index.ts          # Server entry point
│   ├── schema.sql            # Postgres database schema
│   └── package.json          # Backend dependencies
└── README.md                 # This file
```

## 🎯 Usage

### Creating an Account
1. Create a new account with username and password
2. Log in to access the platform

### Using AI Agents
2. Start a new conversation thread in the General Agent
3. Type your questions or requests
4. Receive AI-generated responses in real-time
5. Add new Agent (Math, Geography, Literature) for more specific tasks

### Managing Threads
- Create new threads for different topics
- Bookmark important conversations
- Navigate between multiple active threads
- Delete threads when no longer needed

## 🔮 Roadmap

- [ ] Advanced agent customization
- [ ] File upload capabilities
- [ ] Advanced analytics and insights 