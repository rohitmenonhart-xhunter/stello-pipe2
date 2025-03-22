# Website Generator Application

A web application that helps users generate websites based on their business requirements. The application guides users through a step-by-step process to collect requirements, generate an information architecture diagram, select a template, and save their information to MongoDB.

## Features

- Business Requirements Document (BRD) form to collect user requirements
- Information Architecture (IA) diagram generation
- Template selection based on business type
- User information collection and storage in MongoDB
- Clerk authentication integration with required sign-in before accessing the application

## Authentication

The application uses Clerk for authentication. Users must sign in before they can access any part of the application. The authentication flow works as follows:

1. When a user visits the application, they are presented with a sign-in/sign-up screen
2. After successful authentication, they can access the application features
3. User data is linked to their Clerk user ID for future reference
4. Users can sign out using the profile menu in the header

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=mongodb+srv://your-mongodb-connection-string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
VITE_NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
VITE_OPENAI_API_KEY=your-openai-api-key
```

> Note: For Vite applications, environment variables that need to be accessible in the browser must be prefixed with `VITE_`.

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Start the API server in a separate terminal:

```bash
npm run server
```

The API server will run on port 8000 and the frontend will run on port 5173 (or the port specified by your development environment).

3. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

The application provides the following API endpoints:

- `POST /api/save-user-data` - Save user data to MongoDB
  - Request body: User data including name, email, phone, BRD answers, and selected template
  - Response: Saved user data with MongoDB ID

## Project Structure

- `src/` - Frontend React application
  - `components/` - React components
  - `services/` - API and service functions
  - `templates/` - Website templates
- `api/` - Backend API server
  - `server.ts` - Express server
  - `save-user-data.ts` - API endpoint for saving user data

## Workflow

1. User signs in with Clerk authentication
2. User fills out the BRD form
3. System generates an IA diagram
4. User selects a template
5. User provides contact information (name and email required, phone optional)
6. System saves all information to MongoDB
7. User can download the selected template

## Technologies Used

- React
- TypeScript
- Material-UI
- MongoDB
- Mongoose
- Express
- Clerk Authentication
- OpenAI API 

## Troubleshooting

If you encounter any issues:

1. Check that MongoDB is properly connected by looking at the server logs in `api/server.log`
2. Ensure all environment variables are correctly set in your `.env` file
3. If the server doesn't start, check for errors in the console or log files 