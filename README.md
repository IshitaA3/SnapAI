# Snap.AI ✨
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/IshitaA3/SnapAI)

🌐 **Live Preview**: [https://snap-ai-beta.vercel.app/](https://snap-ai-beta.vercel.app/)

Snap.AI is a full-stack application that leverages multiple AI services to provide a suite of tools for content creation and image manipulation. It features a React frontend and a Node.js/Express backend, integrated with Clerk for user authentication.

## Features

-   🔐 **User Authentication**: Secure sign-up, sign-in, and user management powered by Clerk.
-   **AI Content Generation**:
    -   **Article Writer**: Generate complete articles on any topic with specified lengths.
    -   **Blog Title Generator**: Create catchy and relevant blog titles from a keyword.
-   🎨 **AI Image Manipulation**:
    -   **Image Generation**: Create images from text prompts using different artistic styles.
    -   **Background Removal**: Automatically remove the background from any image.
    -   **Object Removal**: Seamlessly remove a specified object from an image.
-   📄 **AI Document Analysis**:
    -   **Resume Reviewer**: Upload a resume in PDF format to receive an AI-generated review and feedback.
-   🌍 **Community Hub**: Share your generated images with the community and see what others are creating.
-   📊 **User Dashboard**: View your recent creations and manage your account.
-   💎 **Subscription Tiers**: Supports both free and premium user plans, with usage limits for free users.

## Tech Stack

### Backend

-   **Framework**: Node.js, Express.js
-   **Database**: MongoDB with Mongoose
-   **Authentication**: Clerk
-   **AI Services**:
    -   Google Gemini API (via OpenAI SDK wrapper) for text generation.
    -   Cloudinary for image storage, background removal, and object removal.
    -   ClipDrop API for text-to-image generation.
-   **File Handling**: Multer for file uploads, `pdf-parse` for PDF text extraction.
-   **Deployment**: Configured for Vercel.

### Frontend

-   **Framework**: React (with Vite)
-   **Styling**: Tailwind CSS
-   **Routing**: React Router
-   **State Management/API**: Axios for HTTP requests
-   **Authentication**: Clerk React SDK
-   **UI Components**: Lucide React for icons, React Hot Toast for notifications.

## Project Structure

The repository is organized into two main directories:

-   `frontend/`: Contains the React client application built with Vite. All components, pages, and assets for the user interface are located here.
-   `backend/`: Contains the Node.js/Express server. This includes API routes, controllers for handling AI logic, database models, and server configuration.

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

-   Node.js (v20.19.0 or later)
-   npm or a compatible package manager
-   Access keys for Clerk, MongoDB, Cloudinary, Gemini, and ClipDrop.

### Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

```bash
# MongoDB
DATABASE_URL=your_mongodb_connection_string

# Clerk
CLERK_SECRET_KEY=your_clerk_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI APIs
GEMINI_API_KEY=your_google_gemini_api_key
CLIPDROP_API_KEY=your_clipdrop_api_key

# Server
PORT=3000
```

Create a `.env` file in the `frontend` directory and add the following variable:

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### Backend Setup

1.  Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2.  Install the required dependencies:
    ```sh
    npm install
    ```
3.  Start the development server:
    ```sh
    npm run server
    ```
    The backend server will be running on `http://localhost:3000`.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2.  Install the required dependencies:
    ```sh
    npm install
    ```
3.  Start the development server:
    ```sh
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## API Endpoints

The backend exposes the following API route groups:

-   `/api/ai/`: Handles all AI-related tasks.
    -   `POST /generate-article`: Creates an article from a text prompt.
    -   `POST /generate-blog-title`: Generates blog titles from a keyword.
    -   `POST /generate-image`: Creates an image from a text prompt.
    -   `POST /remove-image-background`: Removes the background from an uploaded image.
    -   `POST /remove-image-object`: Removes a specified object from an uploaded image.
    -   `POST /resume-review`: Analyzes an uploaded PDF resume.
-   `/api/user/`: Manages user-specific data.
    -   `GET /user-creations`: Fetches all creations for the authenticated user.
    -   `GET /published-creations`: Fetches all publicly shared image creations.
    -   `POST /toggle-like-creations`: Likes or unlikes a creation.
