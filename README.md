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

### 🧠 **Mental Wellness Coach**
- AI-powered mental health assistant
- Mood tracking and analysis
- Stress management techniques
- Professional psychologist recommendations (Premium)

### 💪 **Physical Wellness Coach**
- BMI calculation and health metrics
- Food analysis through image recognition
- Personalized diet and exercise plans
- Certified trainer connections (Premium)

### 🗺️ **Career Roadmaps**
- Interactive career path planning
- Milestone tracking and progress monitoring
- Template-based learning journeys
- Skill development guidance

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd aura-synergy-hub-55
```

2. **Quick Start (Windows)**
```bash
# Double-click to start both servers
START_SERVERS.bat
```

3. **Manual Setup**

**Backend Setup:**
```bash
cd backend
npm install
npm start
```

**Frontend Setup:**
```bash
cd Frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🏗️ Project Architecture

```
aura-synergy-hub-55/
├── Frontend/                    # React + TypeScript Application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Main application pages
│   │   ├── lib/               # API client and utilities
│   │   └── styles/            # CSS and styling
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
│
├── backend/                    # Node.js + Express API
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic
│   ├── config/                # Database configuration
│   ├── middleware/            # Authentication & validation
│   └── migrations/            # Database migrations
│
└── START_SERVERS.bat          # Quick start script
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Hooks + Context API
- **HTTP Client**: Custom API wrapper

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Web Scraping**: Puppeteer
- **AI Integration**: OpenAI API

### Database Schema
- **Users & Profiles**: Authentication and user data
- **Coding Stats**: Platform statistics and progress
- **Activity Tracking**: Daily progress and goals
- **Roadmap System**: Career paths and milestones
- **Health Metrics**: Physical and mental wellness data

## 🔧 Configuration

### Environment Variables
Create `.env` files in both `Frontend/` and `backend/` directories:

**Backend (.env):**
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=3001
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📱 Key Pages

1. **Dashboard** - Overview of all metrics and progress
2. **Day Tracker** - Daily activity and goal management
3. **Mental Coach** - AI-powered wellness assistance
4. **Physical Coach** - Health metrics and coaching
5. **Roadmaps** - Career planning and milestone tracking

## 🎨 UI Components

- **Modern Design**: Clean, responsive interface
- **Dark/Light Mode**: Automatic theme switching
- **Interactive Charts**: Progress visualization
- **Real-time Updates**: Live data synchronization
- **Mobile Responsive**: Works on all devices

## 🔐 Security Features

- JWT-based authentication
- Secure API endpoints
- Input validation and sanitization
- CORS protection
- Environment variable protection

## 📊 Data Sources

- **LeetCode**: Problem solving statistics
- **CodeChef**: Contest participation and ratings
- **Codeforces**: Competitive programming metrics
- **Manual Input**: Goals, health metrics, activities

## 🚀 Deployment

The application is ready for deployment on:
- **Frontend**: Netlify, Vercel, or any static hosting
- **Backend**: Heroku, Railway, or any Node.js hosting
- **Database**: PostgreSQL on Heroku, Supabase, or similar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the application's built-in help sections
- Review the API documentation at `/health`
- Contact the development team

---

**Built with ❤️ for student success and holistic wellness**
