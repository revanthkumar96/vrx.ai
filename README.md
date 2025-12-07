# 🌟 Vrx.ai

**Your Holistic Student Success Platform**

A comprehensive AI-powered platform designed for students and professionals to manage career goals, mental wellness, and physical health in one integrated dashboard. Track your coding progress, get personalized coaching, and achieve your goals with intelligent insights.

## ✨ Features

### 📊 **Dashboard & Analytics**
- Real-time coding statistics from LeetCode, CodeChef, and Codeforces
- Monthly goal tracking with progress visualization
- Streak tracking and performance analytics
- Comprehensive activity calendar

### 🎯 **Day Tracker**
- Daily progress monitoring
- Goal setting and achievement tracking
- Activity synchronization across platforms
- Performance insights and trends

### 🧠 **AI Career Companion**
- AI-powered career guidance
- Career path planning
- Skill development guidance


### 🗺️ **Career Roadmaps**
- Interactive career path planning
- Milestone tracking and progress monitoring
- Template-based learning journeys
- Skill development guidance

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **PostgreSQL**: v14 or higher
- **Git**

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/revanthkumar96/vrx.ai.git
    cd vrx.ai
    ```

2.  **Quick Start (Windows)**
    Double-click the `START_SERVERS.bat` file in the root directory to start both backend and frontend servers automatically.

3.  **Manual Setup**

    **Backend Setup:**
    ```bash
    cd backend
    # Install dependencies
    npm install
    
    # Configure environment
    cp .env.example .env
    # Edit .env with your credentials
    
    # Start the server
    npm start
    ```

    **Frontend Setup:**
    ```bash
    cd Frontend
    # Install dependencies
    npm install
    
    # Configure environment
    cp .env.example .env
    
    # Start the development server
    npm run dev
    ```

### Access the Application
- **Frontend**: http://localhost:8080 (or port shown in terminal)
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🏗️ Project Architecture

```
vrx.ai/
├── Frontend/           # React + TypeScript + Vite Application
│   ├── src/
│   │   ├── components/ # Reusable UI components (shadcn/ui)
│   │   ├── pages/      # Main application routes
│   │   ├── lib/        # Utilities and hooks
│   │   └── styles/     # Tailwind CSS configuration
│   └── ...
│
├── backend/            # Express.js Application
│   ├── routes/         # API Route definitions
│   ├── services/       # Business logic & External APIs
│   ├── config/         # DB & App configuration
│   ├── middleware/     # Auth & Error handling
│   └── migrations/     # Database schema scripts
│
└── START_SERVERS.bat   # Windows Startup Script
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Query, React Context
- **Routing**: React Router DOM

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (via `pg`)
- **AI/ML**: @huggingface/inference, groq-sdk, OpenAI
- **Web Scraping**: Puppeteer, Cheerio
- **Authentication**: JWT, bcrypt

## 🔧 Configuration

### Environment Variables
You must verify your `.env` files in both directories.

**Backend (.env):**
See `backend/.env.example` for reference.
- `DATABASE_URL`: Connection string for PostgreSQL (e.g., Aiven, Supabase, or local).
- `JWT_SECRET`: Secret key for session management.
- `OPENAI_API_KEY`: For AI features.

**Frontend (.env):**
See `Frontend/.env.example` for reference.
- `VITE_API_BASE_URL`: URL of your backend API.

## 🤝 Contributing
We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📄 License
This project is licensed under the MIT License.

## 🆘 Support
For support, please create an issue on the [GitHub repository](https://github.com/revanthkumar96/vrx.ai).

---
**Built with ❤️ for student success and holistic wellness**
