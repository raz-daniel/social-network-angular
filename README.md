
# Social Network Application

A full-stack social network application with user authentication, posts, comments, and follow functionality.

## Project Structure

- `backend/`: Express.js backend with TypeScript
- `database/`: MongoDB initialization scripts and data
- `frontend/`: Frontend application
- `io/`: Socket.IO implementation
- `lib/`: Shared libraries
- `localstack/`: Local AWS service mocks

## Technologies Used

- **Backend**: Express.js, TypeScript, MongoDB with Mongoose
- **Frontend**: React (or your frontend framework)
- **Database**: MongoDB
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Cloud Services**: AWS S3, SQS (mocked locally with LocalStack)

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (v14+)
- npm or yarn

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/social-network-app.git
   cd social-network-app
   ```

2. Start the application with Docker Compose:
   ```
   docker-compose up -d
   ```

3. The application will be available at:
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:8080 (adjust as needed)

### Using the Application

You can log in with any of these test accounts:
- Username: `annie123`, Password: `123456`
- Username: `bobjohn`, Password: `123456`
- (and 6 more users with the same password)

## Features

- User authentication (login/signup)
- Create, read, update, delete posts
- Comment on posts
- Follow/unfollow users
- View feed of posts from followed users
- Real-time updates via Socket.IO

## Development

### Backend Development

```
cd backend
npm install
npm run dev
```

### Frontend Development

```
cd frontend
npm install
npm start
```

## License

[Your License Choice]