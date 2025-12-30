# E-Health Platform - Mental Health & CVD Assessment System

A comprehensive healthcare platform for mental health and cardiovascular disease (CVD) risk assessment, patient monitoring, and treatment management. The system supports three user roles: Patients, Doctors, and Caregivers.

## 🎯 Project Overview

This platform provides:
- **Mental Health Assessments**: GAD-7 (Anxiety), PHQ-9 (Depression), DASS-21 (Depression, Anxiety, Stress)
- **CVD Risk Assessment**: 10-question cardiovascular disease risk evaluation
- **Patient Progress Tracking**: Historical assessment data, treatment plans, and care activities
- **Doctor Analytics**: Patient monitoring, treatment plan creation, and emergency alerts
- **Caregiver Support**: Patient vital signs tracking and care activity logging

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.344.0
- **Form Management**: Formik 2.4.9 with Yup validation
- **State Management**: React Context API

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 4.18.2
- **Database**: PostgreSQL
- **ORM**: Prisma 6.19.0
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcryptjs 2.4.3
- **Session Management**: express-session 1.18.2

### Development Tools
- **TypeScript**: 5.5.3
- **ESLint**: 9.9.1
- **Process Manager**: tsx 4.20.6 (for development)
- **Concurrent Execution**: concurrently 8.2.2

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **PostgreSQL**: v14 or higher
- **Git**: Latest version

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd e-health
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/ehealth_db"

# JWT Secret (use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Server Configuration
PORT=5000

# Session Secret (use a strong random string)
SESSION_SECRET="your-super-secret-session-key-change-this-in-production"
```

> [!IMPORTANT]
> Replace `username`, `password`, and the secret keys with your actual values. Never commit the `.env` file to version control.

### 4. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ehealth_db;

# Exit psql
\q
```

#### Run Prisma Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 5. Run the Application

#### Development Mode

```bash
# Runs both frontend (Vite) and backend (Express) concurrently
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

#### Production Mode

```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
e-health/
├── prisma/
│   └── schema.prisma          # Database schema (14 models)
├── server/
│   ├── index.ts               # Express server & API routes
│   ├── prisma.ts              # Prisma client instance
│   ├── progressEndpoints.ts   # Patient progress tracking endpoints
│   └── types/                 # TypeScript type definitions
├── src/
│   ├── components/
│   │   ├── Auth/              # Login & Registration
│   │   ├── Patient/           # Patient dashboard & assessments
│   │   ├── Doctor/            # Doctor dashboard & analytics
│   │   ├── Caregiver/         # Caregiver dashboard
│   │   ├── Assessments/       # GAD-7, PHQ-9, DASS-21, CVD
│   │   └── Shared/            # Emergency alerts, video consultation
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/
│   │   └── api.ts             # API client methods
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
├── .env                       # Environment variables (not in git)
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration
```

## 🗄️ Database Schema

The application uses 14 Prisma models:

### Core Models
- **User**: Base user model (patient, doctor, caregiver)
- **PatientDemographics**: Comprehensive patient information
- **DoctorPatientAssignment**: Doctor-patient relationships
- **CaregiverPatientAssignment**: Caregiver-patient relationships

### Assessment Models
- **GAD7Assessment**: Generalized Anxiety Disorder assessment
- **PHQ9Assessment**: Patient Health Questionnaire for depression
- **DASS21Assessment**: Depression, Anxiety, and Stress Scale
- **CVDAssessment**: Cardiovascular disease risk assessment

### Care Management Models
- **TreatmentPlan**: Doctor-created treatment plans
- **Medication**: Patient medication tracking
- **VitalSigns**: Blood pressure, heart rate, temperature, etc.
- **NutritionLog**: Meal and calorie tracking
- **ExerciseLog**: Physical activity tracking
- **EmergencyAlert**: High-risk patient alerts

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
POST   /api/auth/logout        # Logout user
GET    /api/auth/me            # Get current user
```

### Patient Assessments
```
POST   /api/patient/demographics           # Submit demographics
POST   /api/patient/gad7                   # Submit GAD-7 assessment
POST   /api/patient/phq9                   # Submit PHQ-9 assessment
POST   /api/patient/dass21                 # Submit DASS-21 assessment
POST   /api/patient/cvd                    # Submit CVD assessment
GET    /api/patient/results                # Get assessment results
```

### Patient Progress Tracking
```
GET    /api/patient/assessment-history     # Get all assessment history
GET    /api/patient/treatment-plans        # Get assigned treatment plans
GET    /api/patient/care-activities        # Get medications, vitals, nutrition, exercise
```

### Doctor Endpoints
```
GET    /api/doctor/patients                # Get assigned patients
GET    /api/doctor/patient/:id             # Get patient details
POST   /api/doctor/treatment-plan          # Create treatment plan
GET    /api/doctor/analytics               # Get patient analytics
POST   /api/doctor/assign-patient          # Assign patient to doctor
```

### Caregiver Endpoints
```
GET    /api/caregiver/patients             # Get assigned patients
POST   /api/caregiver/vital-signs          # Record vital signs
POST   /api/caregiver/medication           # Log medication
POST   /api/caregiver/nutrition            # Log nutrition
POST   /api/caregiver/exercise             # Log exercise
```

### Emergency Alerts
```
GET    /api/emergency-alerts               # Get all active alerts
POST   /api/emergency-alerts               # Create manual alert
PATCH  /api/emergency-alerts/:id/acknowledge  # Acknowledge alert
PATCH  /api/emergency-alerts/:id/resolve      # Resolve alert
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server generates JWT token
3. Token is stored in localStorage
4. Token is sent with each API request in Authorization header
5. Server validates token and extracts user information

**Token Format**:
```
Authorization: Bearer <jwt-token>
```

## 🎨 Color-Coded Risk Levels

The platform uses a traffic light system for risk assessment:

| Color  | Severity Level | Description |
|--------|---------------|-------------|
| 🟢 Green | Minimal/Low | No significant risk |
| 🟡 Yellow | Mild/Moderate | Some concern, monitoring needed |
| 🟠 Orange | Moderately Severe | Significant concern, intervention recommended |
| 🔴 Red | Severe/Critical | High risk, immediate attention required |

## 📊 Assessment Scoring

### GAD-7 (Anxiety)
- **Score Range**: 0-21
- **Minimal**: 0-4 (Green)
- **Mild**: 5-9 (Yellow)
- **Moderate**: 10-14 (Orange)
- **Severe**: 15-21 (Red)

### PHQ-9 (Depression)
- **Score Range**: 0-27
- **Minimal**: 0-4 (Green)
- **Mild**: 5-9 (Yellow)
- **Moderate**: 10-14 (Orange)
- **Moderately Severe**: 15-19 (Orange)
- **Severe**: 20-27 (Red)

### DASS-21
Separate scores for Depression, Anxiety, and Stress (each 0-21):
- **Normal**: 0-4 (Green)
- **Mild**: 5-6 (Yellow)
- **Moderate**: 7-10 (Orange)
- **Severe**: 11-13 (Orange)
- **Extremely Severe**: 14+ (Red)

### CVD Risk
Based on 10 risk factors with color-coded overall risk assessment.

## 🧪 Testing

### Manual Testing
```bash
# Start development server
npm run dev

# Test user flows:
# 1. Register as patient
# 2. Complete demographics
# 3. Complete all assessments
# 4. View results and progress
# 5. Register as doctor
# 6. Assign patient
# 7. Create treatment plan
```

### Database Inspection
```bash
# Open Prisma Studio
npm run prisma:studio
```

## 🚢 Deployment

### Render.com Deployment

The project includes a `render.yaml` configuration file for easy deployment on Render.

#### Prerequisites
1. Create a Render account
2. Create a PostgreSQL database on Render
3. Note the database connection string

#### Steps
1. Push code to GitHub
2. Connect repository to Render
3. Render will auto-detect `render.yaml`
4. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SESSION_SECRET`
5. Deploy

### Manual Deployment

```bash
# Build frontend
npm run build

# Set environment to production
export NODE_ENV=production

# Run migrations
npm run migrate:deploy

# Start server
npm start
```

## 🔧 Available Scripts

```bash
npm run dev              # Start development (frontend + backend)
npm run dev:client       # Start only frontend (Vite)
npm run dev:server       # Start only backend (Express)
npm run build            # Build frontend for production
npm start                # Start production server
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript type checking
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Verify DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
npx prisma db pull
```

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 5173
npx kill-port 5173
```

### Prisma Client Issues
```bash
# Regenerate Prisma Client
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 📝 License

This project is proprietary and confidential.

## 👥 Contributors

- Development Team

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for better mental health and cardiovascular care**
