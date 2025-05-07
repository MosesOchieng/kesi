# KESI Backend

A Node.js + Express + MongoDB backend for the KESI legal simulation platform.

## Features
- User registration/login (JWT authentication, hashed passwords)
- CRUD for cases, evidence, chat history, notifications, community posts
- File uploads (Cloudinary-ready)
- Endpoints for AI chat, simulation state, and more

## Stack
- Node.js + Express
- MongoDB (Mongoose)
- JWT for authentication
- Cloudinary for file uploads

## Setup
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `/api/auth` - Register/login
- `/api/cases` - Case management
  - `POST /ai-generate` - Create an AI-generated case
  - `POST /manual` - Create a manual case
  - `GET /historical` - List historical cases
  - `POST /:id/join` - Join a case
  - `POST /:id/leave` - Leave a case
  - `POST /:id/assign-role` - Assign role in a case
  - `POST /seed` - Seed five example cases (dev only)
- `/api/evidence` - Evidence upload/view
- `/api/chat` - Chat history and AI chat
- `/api/notifications` - User notifications
- `/api/community` - Forum, mentorship, Q&A

---

MIT License 