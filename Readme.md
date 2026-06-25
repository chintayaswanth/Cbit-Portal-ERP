# CBIT Unified ERP Platform

CBIT has multiple websites where important information is scattered.
This project aims to provide a **unified platform** allowing fellow mates and juniors to access all essential information in one place.

The platform analyzes attendance data to provide students with attendance management tools and semester attendance requirement calculations and attendance schedule analysis plus various other beneficial features designed for students.

## Key Features

- [x] Subject-wise attendance tracking  
- [x] Attendance analysis and prediction  
- [x] Calculate how many classes can be skipped while maintaining required attendance  
- [x] Attendance planning based on desired internal marks  
- [x] Centralized academic and college information platform  
- [x] Placement updates   
- [x] Access to previous year question papers  
- [x] Holiday list and academic calendar management  
- [x] Semester-wise and subject-wise syllabus access  
- [x] Student club listings and information  
- [x] Easy-to-use student dashboard  
- [x] Single platform for all important CBIT resources  
- [x] Designed to simplify and improve student life at CBIT  

---

## Try It Now

🔗 https://erp-cbit.vercel.app

---

## Method - 1 Manual Setup

### Clone the Repository

```bash
git clone https://github.com/1YaswantH1/Erp-CBIT.git
```

### Install Dependencies

```bash
cd backend
npm install

cd ..
cd frontend
npm install
```

---

## Run the Project

### Terminal 1

```bash
cd frontend
npm run dev
```

### Terminal 2

```bash
cd backend
node server.js
```

# Method 2 - Using Docker

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/1YaswantH1/Erp-CBIT.git
cd erp-cbit
```

### 2. Create the environment file

Create `backend/.env`:

```env
PORT=5000
```

### 3. Build and start

```bash
docker compose up --build
```

> First build takes a few minutes — downloads dependencies and Chromium inside the container.

Once ready, open **http://localhost:5173** in your browser.

---

## Commands

| Action | Command |
|---|---|
| Start | `docker compose up` |
| Stop | `docker compose down` |
| Rebuild after changes | `docker compose up --build` |
| View logs | `docker compose logs -f backend` |

---

## Troubleshooting

**Clean rebuild (fixes most issues)**

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

## For Project Screenshots 
Go to this folders
```bash
| Project-Screenshots-Mobile
| Project-Screenshots-Web
```
