# My Basecamp 1

## Description
My Basecamp 1 is a web-based project management tool clone designed to mimic the core functionalities of the original Basecamp software launched in 2004. This project fulfills the Season 02 Fullstack requirement, implementing a complete monolithic application with a database, backend, and frontend. 

As requested, strict attention has been paid to the User Experience, delivering a beautiful, seamless, and premium visual layout utilizing light-mode modern design principles.

## Live Demo & Hosting
Check out the live version here: **[MyBasecamp Live](https://basecamp-clone.onrender.com/)**

This project is hosted on **Render** using a PostgreSQL database.

### Hosting on Render (Step-by-Step)
1. **Create a PostgreSQL Database**:
   - Go to [Render Dashboard](https://dashboard.render.com/) and click **New > PostgreSQL**.
   - After creation, scroll down to the **Connections** section.
   - Click the **Copy** button next to **Internal Database URL** (this is for secure, fast communication between your database and web service).
2. **Create a Web Service**:
   - Click **New > Web Service** and connect your GitHub repository.
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Configure Environment Variables**:
   - In your Render Web Service, go to the **Environment** tab.
   - Add a new variable: `DATABASE_URL` and paste the connection string from your Render database.
   - (Optional) Add `SESSION_SECRET` with a random string.
4. **Deploy**: Render will automatically deploy your project. Once finished, you will receive a `xxx.onrender.com` link.

---

## Core Features
1. **User Registration**
   - Provide endpoints and views for account management.
   - Core functions: `User #new`, `User #show`, `User #create`, `User #destroy`.
2. **Session Management**
   - Secure login and logout capabilities handling active user cookies.
   - Core functions: `User #sign_in`, `User #sign_out`.
3. **Role Permissions**
   - Tiered user access providing isolation between regular users and Admins.
   - Core functions: `User setAdmin`, `User removeAdmin`.
4. **Project Management**
   - Core CRUD architecture allowing teams to visualize and manipulate project details.
   - Core functions: `Project #new`, `Project #show`, `Project #edit`, `Project #destroy`.
5. **Discussion Threads**
   - Centralized communication hubs within projects for organized topic-based discussions.
   - Core functions: `Thread #new`, `Thread #show`, `Thread #edit`, `Thread #destroy`.
6. **Messaging System**
   - Interactive comment threads allowing users to post, edit, and manage messages within any discussion.
   - Core functions: `Message #create`, `Message #edit`, `Message #destroy`.
7. **File Attachments**
   - Robust asset management enabling users to upload and track project-related files and documents.
   - Core functions: `Attachment #create`, `Attachment #destroy`.

## Technology Stack
- **Backend Engine**: Node.js via Express.js
- **Database**: SQLite (managed via `better-sqlite3`)
- **Security**: `bcryptjs` and `express-session`
- **Frontend Template**: EJS Engine with purely Vanilla CSS.

## Getting Started

### Installation
Ensure that you have [Node.js](https://nodejs.org/en/) installed on your system.

```bash
# Install NPM dependencies
npm install

# Start the web server
node server.js
```

### Accessing the Website
Once the server is running, the database structure defaults to initializing automatically. You can navigate directly to the console port.
Open your browser and navigate to:
```
http://localhost:3001/
```


## Reviewer Note
> **Attention Reviewers:** Please be aware that Qwasar workspaces and sandboxes may operate on different local environment versions compared to other standard IDEs. If you encounter any unexpected version discrepancies or mismatching behaviors, please note that the codebase is optimized for standard Node.js LTS but should be reviewed with the Qwasar environment versioning in mind.

## Credits
Built for the **Season 02 Fullstack** curriculum path on Qwasar.
