## GEETHAPRIYAN S - 23CS049
## DEPLOYMENT LINK - https://reading-progress-log.vercel.app/

# 📚 Personal Reading Progress Log

A premium, full-stack personal reading assistant built with **Next.js** and **MongoDB**. Track your books, visualize reading speeds and genre habits with interactive charts, auto-fetch book details via the Open Library API, and set reading goals with automated progress tracking.

---

## ✨ Features

### 🌟 Premium Interface
* **Obsidian Glassmorphism:** A clean, glowing dark theme designed with glass panels, smooth hover animations, and sticky blurred navigation headers.
* **Fully Responsive:** Completely fluid layouts replacing absolute coordinate structures, running flawlessly on mobile, tablets, and desktops.

### 🔍 Automated Book Lookup & Discovery
* **Open Library API Integration:** Autocomplete book search by title. Selecting a book automatically populates:
  * Title & Author
  * Page Count, Primary Genre, and Tags
  * High-resolution Cover Image URL

### 📊 Reading Analytics & SVG Charts
* **Genre Breakdown:** A dynamic SVG donut chart mapping your catalog across different categories.
* **Weekly Speed Chart:** A native SVG bar graph calculating daily page counts read over the last 7 days.
* **Reading Stats Panel:** At-a-glance cards showing total books logged, current reading count, completed count, and total pages logged.

### 🎯 Dynamic Goals Engine
* **Automated Tracking:** Set page-based or book-based targets with custom end dates.
* **Dynamic Calculations:** Backend routes automatically scan reading history timelines and completion records to calculate and persist goal progress percentages.

### 📝 Timeline & Journal Annotations
* **In-Progress Notes:** Save persistent annotations with dates as you read.
* **Quote Keeper:** Save memorable passages indexed by page numbers.
* **Reviews & Star Ratings:** Write dynamic star ratings (1-5 stars) and critiques once a book is marked completed.
* **Reading History:** A visual history logging page progress and timestamps.

### 👤 Profile & Security Controls
* **Account Analytics:** Access account summaries (completed books, pages read, goals reached).
* **Profile Settings:** Update account details (username, email).
* **Password Rotation:** Change account password securely with `bcryptjs` hashing.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 15 (App Router), React 19, Vanilla CSS (with custom themes)
* **Backend:** Next.js Serverless API endpoints
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Authentication:** Password hashing with `bcryptjs` and client session persistence

---

## 🚀 Getting Started

### 1. Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A MongoDB connection URI

### 2. Setup Environment Variables
Create a `.env.local` file in the root directory and add your MongoDB connection URI:
```env
MONGODB_URI=your_mongodb_connection_string
```

### 3. Installation
Install project dependencies:
```bash
npm install
```

### 4. Development Server
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 5. Production Build
To build the application for production:
```bash
npm run build
```
*(Ensure to temporarily stop `npm run dev` before building to avoid folder file-locking conflicts).*
