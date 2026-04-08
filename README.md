# AI-Powered Ticket Management System (Frontend)

## Project Overview
A React-based user interface for managing support tickets. It allows users to view, create, and manage tickets while leveraging AI to auto-fill/set ticket attributes.

## Tech Stack Used
*   **Framework:** React 19 + Vite 8
*   **Styling:** Tailwind CSS v4
*   **Routing:** React Router DOM v7
*   **HTTP Client:** Native Fetch API

## Setup Instructions
1.  Ensure Node.js is installed.
2.  Navigate to the directory and install dependencies: `pnpm install`
3.  Ensure your backend is running on port 8080.
4.  Start the development server: `pnpm run dev`
5.  Access the app at `http://localhost:5173`

## API Details
The frontend communicates entirely via the backend REST APIs.
*   The `vite.config.js` is configured to proxy all `/api` requests to `http://localhost:8080`.
*   All API operations (CRUD & AI) are abstracted in the `src/api` directory using `fetch`.

## AI Feature Explanation
During ticket creation, users input a draft title and description and click "✨ Auto-fill". The frontend sends this data to the backend AI endpoint, retrieves a structured JSON response, and dynamically populates the Category, Priority, and Summary form fields for user review before final submission.

## Deployment Links
*   **Live Frontend:** https://ticketmanager-frontend.vercel.app (Deployed on Vercel)
