# E-Health Assessment Platform

A health assessment platform built with React, TypeScript, Prisma, and SQLite.

## Features

- User authentication (JWT-based)
- Patient demographics collection
- Health assessments:
  - GAD-7 (Anxiety)
  - PHQ-9 (Depression)
  - DASS-21 (Depression, Anxiety, Stress)
  - CVD Risk Assessment
- Results dashboard
- Role-based access (Patient, Doctor, Caregiver)

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Formik, Yup
- **Backend**: Express, Prisma, SQLite
- **Authentication**: Express Sessions, bcryptjs

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory:
```
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

3. Initialize the database:
```bash
npx prisma migrate dev --name init
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Start the development servers:
```bash
npm run dev
```

This will start both the backend server (port 3001) and the frontend dev server (port 5173).

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:server` - Start only the backend server
- `npm run dev:client` - Start only the frontend dev server
- `npm run build` - Build the frontend for production
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio to view/edit database

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── server/
│   ├── index.ts                # Express server
│   └── prisma.ts               # Prisma client
├── src/
│   ├── components/             # React components
│   ├── contexts/               # React contexts (Auth)
│   ├── lib/                    # API client
│   ├── types/                  # TypeScript types
│   └── utils/                  # Utility functions
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Demographics
- `GET /api/patient-demographics` - Get patient demographics (requires auth)
- `POST /api/patient-demographics` - Save/update demographics (requires auth)

### Assessments
- `POST /api/assessments/gad7` - Save GAD-7 assessment (requires auth)
- `GET /api/assessments/gad7` - Get GAD-7 assessments (requires auth)
- `POST /api/assessments/phq9` - Save PHQ-9 assessment (requires auth)
- `GET /api/assessments/phq9` - Get PHQ-9 assessments (requires auth)
- `POST /api/assessments/dass21` - Save DASS-21 assessment (requires auth)
- `GET /api/assessments/dass21` - Get DASS-21 assessments (requires auth)
- `POST /api/assessments/cvd` - Save CVD assessment (requires auth)
- `GET /api/assessments/cvd` - Get CVD assessments (requires auth)
- `GET /api/assessments/all` - Get all latest assessments (requires auth)

## Environment Variables

- `DATABASE_URL` - SQLite database file path
- `SESSION_SECRET` - Secret key for session signing (optional, has default)
- `PORT` - Backend server port (default: 3001)
- `VITE_API_URL` - Frontend API URL (default: http://localhost:3001)

## Notes

- The database file (`prisma/dev.db`) is created automatically on first migration
- Make sure to change `SESSION_SECRET` in production
- The frontend expects the API to be available at the URL specified in `VITE_API_URL`

