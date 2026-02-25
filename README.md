# DHSUD Tracker - Negros Island Region

A comprehensive web-based tracking system built for the Department of Human Settlements and Urban Development (DHSUD) Negros Island Region. This system manages project applications, Certificates of Registration (CR), Licenses to Sell (LS), and compliance records with built-in analytics and bulk processing features.

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Tailwind CSS, Vite, Recharts, SheetJS (XLSX)
* **Backend:** Python, Django, Django REST Framework
* **Database:** PostgreSQL

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* [Python 3.10+](https://www.python.org/downloads/)
* [Node.js v18+](https://nodejs.org/) & npm
* [PostgreSQL](https://www.postgresql.org/download/)
* Git

---

## 🚀 Installation & Setup Guide

### 1. Clone the Repository
```bash
git clone [https://github.com/YourFriendsName/TheProjectName.git](https://github.com/YourFriendsName/TheProjectName.git)
cd TheProjectName
2. Backend Setup (Django)
Open a terminal and navigate to your backend directory (if separated):

Create and activate a virtual environment:

Windows:

Bash
python -m venv venv
.\venv\Scripts\activate
Mac/Linux:

Bash
python3 -m venv venv
source venv/bin/activate
Install dependencies:
Make sure your virtual environment is active, then run:

Bash
pip install -r requirements.txt
Database Configuration:

Open pgAdmin or your PostgreSQL command line and create a new database named dhsud_db (or whatever name is specified in settings.py).

Update the DATABASES configuration in your Django settings.py with your local PostgreSQL username and password.

Run Migrations:

Bash
python manage.py makemigrations
python manage.py migrate
Start the Backend Server:

Bash
python manage.py runserver
The backend API will now be running at http://127.0.0.1:8000

3. Frontend Setup (React)
Open a new terminal window (keep the backend running) and navigate to the frontend directory:

Install node modules:

Bash
npm install
(Note: This will install all required UI packages including Axios, Tailwind, Recharts, and XLSX).

Start the Frontend Development Server:

Bash
npm run dev
The frontend will now be running at http://localhost:5173

✨ Key Features
Interactive Dashboard: Real-time analytics using Recharts (Bar and Donut charts) to visualize project types and application statuses.

Bulk Processing: Select multiple records at once to batch archive, restore, or permanently delete projects.

Excel Import/Export: Seamlessly map and export database records to the exact DHSUD-formatted Excel template using SheetJS.

Search & Filter: Instantly filter records by status, project name, or location.

🤝 Contributing
Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push -u origin feature/AmazingFeature)

Open a Pull Request


### A Quick Tip for the README
In the **Database Configuration** section, I put a placeholder name (`dhsud_db`). You
