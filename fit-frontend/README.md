# Fit Web Blog - Frontend

This is the frontend for the Fit Web Blog, a modern blogging application built with React, TypeScript, Vite, and Tailwind CSS. It provides a clean, responsive UI for user authentication, blog browsing, and content management.

## Features
- User registration and login (with JWT authentication)
- Protected routes and session management
- Responsive design using Tailwind CSS and NextUI
- Blog browsing and (optionally) post creation/editing
- API integration with the backend server

## Getting Started

### Prerequisites
- Node.js (v18 or newer recommended)
- npm (v9 or newer)

### Installation
1. Clone the repository and navigate to the `frontend` directory:
   ```sh
   git clone <your-repo-url>
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Running Locally (with HTTPS)
1. Generate a local SSL certificate (if not already present):
   ```sh
   openssl req -x509 -newkey rsa:2048 -nodes -keyout localhost-key.pem -out localhost-cert.pem -days 365 -subj "/CN=localhost"
   ```
2. Start the development server:
   ```sh
   npm run dev
   ```
3. Open [https://localhost:5173](https://localhost:5173) in your browser. You may need to accept a self-signed certificate warning.

### Project Structure
- `src/components/` - Reusable UI components (AuthContext, LoginForm, RegisterForm, NavBar)
- `src/pages/` - Main application pages (Home, Login, Register)
- `src/services/` - API service for backend communication
- `vite.config.ts` - Vite configuration (including HTTPS setup)

### Environment
- The frontend expects the backend API to be available at `https://localhost:8443/api/v1` (see Vite proxy config).

## Customization
- Update styles in `src/App.css` or via Tailwind classes.
- Add new pages or components as needed.

## License
MIT
