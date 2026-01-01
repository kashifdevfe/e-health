import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { prisma } from './prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'your-jwt-secret-change-in-production';

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://e-health-iota.vercel.app',
      'https://e-health-sage.vercel.app',
      'https://e-health-2j5n.vercel.app',
      'https://e-health-y4rt.vercel.app',
      'https://e-health-delta.vercel.app',
    ];
    // Allow any Vercel preview or production domain
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200,
}));

// Manual OPTIONS handling for preflight
app.options('*', cors() as any);

app.use(bodyParser.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// JWT Auth middleware
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        userRole: role,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        userRole: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    const { password: _, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        userRole: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Patient Demographics routes
app.get('/api/patient-demographics', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const demographics = await prisma.patientDemographics.findUnique({
      where: { userId },
    });

    res.json(demographics);
  } catch (error) {
    console.error('Get demographics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/patient-demographics', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const demographics = await prisma.patientDemographics.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    res.json(demographics);
  } catch (error) {
    console.error('Save demographics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Assessment routes
app.post('/api/assessments/gad7', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const assessment = await prisma.gAD7Assessment.create({
      data: {
        userId,
        ...data,
      },
    });

    res.json(assessment);
  } catch (error) {
    console.error('Save GAD7 error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/assessments/gad7', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const assessments = await prisma.gAD7Assessment.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    res.json(assessments);
  } catch (error) {
    console.error('Get GAD7 error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/assessments/phq9', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const assessment = await prisma.pHQ9Assessment.create({
      data: {
        userId,
        ...data,
      },
    });

    res.json(assessment);
  } catch (error) {
    console.error('Save PHQ9 error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/assessments/phq9', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const assessments = await prisma.pHQ9Assessment.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    res.json(assessments);
  } catch (error) {
    console.error('Get PHQ9 error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/assessments/dass21', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const assessment = await prisma.dASS21Assessment.create({
      data: {
        userId,
        ...data,
      },
    });

    res.json(assessment);
  } catch (error) {
    console.error('Save DASS21 error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/assessments/dass21', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const assessments = await prisma.dASS21Assessment.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    res.json(assessments);
  } catch (error) {
    console.error('Get DASS21 error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/assessments/cvd', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const assessment = await prisma.cVDAssessment.create({
      data: {
        userId,
        ...data,
      },
    });

    res.json(assessment);
  } catch (error) {
    console.error('Save CVD error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/assessments/cvd', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const assessments = await prisma.cVDAssessment.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
    });

    res.json(assessments);
  } catch (error) {
    console.error('Get CVD error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all assessments for results dashboard
app.get('/api/assessments/all', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const [gad7, phq9, dass21, cvd] = await Promise.all([
      prisma.gAD7Assessment.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: 1,
      }),
      prisma.pHQ9Assessment.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: 1,
      }),
      prisma.dASS21Assessment.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: 1,
      }),
      prisma.cVDAssessment.findMany({
        where: { userId },
        orderBy: { completedAt: 'desc' },
        take: 1,
      }),
    ]);

    res.json({
      gad7: gad7[0] || null,
      phq9: phq9[0] || null,
      dass21: dass21[0] || null,
      cvd: cvd[0] || null,
    });
  } catch (error) {
    console.error('Get all assessments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assigned patients for doctors
app.get('/api/doctor/patients', authenticateToken, async (req, res) => {
  try {
    const doctorId = (req as any).user.userId;

    // Verify user is a doctor
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });

    if (!doctor || doctor.userRole !== 'doctor') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignments = await prisma.doctorPatientAssignment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            createdAt: true,
          },
        },
      },
    });

    const patientsData = await Promise.all(
      assignments.map(async (assignment) => {
        const patientId = assignment.patient.id;

        const [gad7, phq9, cvd] = await Promise.all([
          prisma.gAD7Assessment.findFirst({
            where: { userId: patientId },
            orderBy: { completedAt: 'desc' },
            select: {
              totalScore: true,
              severityLevel: true,
              colorCode: true,
            },
          }),
          prisma.pHQ9Assessment.findFirst({
            where: { userId: patientId },
            orderBy: { completedAt: 'desc' },
            select: {
              totalScore: true,
              severityLevel: true,
              colorCode: true,
            },
          }),
          prisma.cVDAssessment.findFirst({
            where: { userId: patientId },
            orderBy: { completedAt: 'desc' },
            select: {
              overallRisk: true,
              overallColor: true,
            },
          }),
        ]);

        return {
          patient: {
            id: assignment.patient.id,
            full_name: assignment.patient.fullName,
            created_at: assignment.patient.createdAt,
          },
          gad7: gad7
            ? {
              total_score: gad7.totalScore,
              severity_level: gad7.severityLevel,
              color_code: gad7.colorCode,
            }
            : null,
          phq9: phq9
            ? {
              total_score: phq9.totalScore,
              severity_level: phq9.severityLevel,
              color_code: phq9.colorCode,
            }
            : null,
          cvd: cvd
            ? {
              overall_risk: cvd.overallRisk,
              overall_color: cvd.overallColor,
            }
            : null,
        };
      })
    );

    res.json(patientsData);
  } catch (error) {
    console.error('Get doctor patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assigned patients for caregivers
app.get('/api/caregiver/patients', authenticateToken, async (req, res) => {
  try {
    const caregiverId = (req as any).user.userId;

    // Verify user is a caregiver
    const caregiver = await prisma.user.findUnique({
      where: { id: caregiverId },
    });

    if (!caregiver || caregiver.userRole !== 'caregiver') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignments = await prisma.caregiverPatientAssignment.findMany({
      where: { caregiverId },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            createdAt: true,
          },
        },
      },
    });

    const patientsData = await Promise.all(
      assignments.map(async (assignment) => {
        const patientId = assignment.patient.id;

        const [gad7, phq9, cvd, caregiverAssignments] = await Promise.all([
          prisma.gAD7Assessment.findFirst({
            where: { userId: patientId },
            orderBy: { completedAt: 'desc' },
            select: {
              totalScore: true,
              severityLevel: true,
              colorCode: true,
            },
          }),
          prisma.pHQ9Assessment.findFirst({
            where: { userId: patientId },
            orderBy: { completedAt: 'desc' },
            select: {
              totalScore: true,
              severityLevel: true,
              colorCode: true,
            },
          }),
          prisma.cVDAssessment.findFirst({
            where: { userId: patientId },
            orderBy: { completedAt: 'desc' },
            select: {
              overallRisk: true,
              overallColor: true,
            },
          }),
          prisma.caregiverPatientAssignment.findMany({
            where: { patientId },
            include: {
              caregiver: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
            },
          }),
        ]);

        return {
          patient: {
            id: assignment.patient.id,
            full_name: assignment.patient.fullName,
            created_at: assignment.patient.createdAt,
          },
          gad7: gad7
            ? {
              total_score: gad7.totalScore,
              severity_level: gad7.severityLevel,
              color_code: gad7.colorCode,
            }
            : null,
          phq9: phq9
            ? {
              total_score: phq9.totalScore,
              severity_level: phq9.severityLevel,
              color_code: phq9.colorCode,
            }
            : null,
          cvd: cvd
            ? {
              overall_risk: cvd.overallRisk,
              overall_color: cvd.overallColor,
            }
            : null,
          caregivers: caregiverAssignments.map(ca => ({
            id: ca.caregiver.id,
            fullName: ca.caregiver.fullName,
            email: ca.caregiver.email,
          })),
        };
      })
    );

    res.json(patientsData);
  } catch (error) {
    console.error('Get caregiver patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available doctors for booking
app.get('/api/doctors/available', authenticateToken, async (req, res) => {
  try {
    const doctors = await prisma.user.findMany({
      where: { userRole: 'doctor' },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
      orderBy: { fullName: 'asc' },
    });

    res.json(doctors);
  } catch (error) {
    console.error('Get available doctors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Book appointment with a doctor
app.post('/api/appointments/book', authenticateToken, async (req, res) => {
  try {
    const patientId = (req as any).user.userId;
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ error: 'Doctor ID is required' });
    }

    // Verify the doctor exists and is actually a doctor
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });

    if (!doctor || doctor.userRole !== 'doctor') {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.doctorPatientAssignment.findUnique({
      where: {
        doctorId_patientId: {
          doctorId,
          patientId,
        },
      },
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'You are already assigned to this doctor' });
    }

    // Create the assignment
    const assignment = await prisma.doctorPatientAssignment.create({
      data: {
        doctorId,
        patientId,
      },
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: 'Appointment booked successfully',
      assignment,
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available caregivers
app.get('/api/caregivers/available', authenticateToken, async (req, res) => {
  try {
    const caregivers = await prisma.user.findMany({
      where: { userRole: 'caregiver' },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
      },
      orderBy: { fullName: 'asc' },
    });

    res.json(caregivers);
  } catch (error) {
    console.error('Get available caregivers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Assign caregiver to patient
app.post('/api/caregivers/assign', authenticateToken, async (req, res) => {
  try {
    const doctorId = (req as any).user.userId;
    const { caregiverId, patientId } = req.body;

    if (!caregiverId || !patientId) {
      return res.status(400).json({ error: 'Caregiver ID and Patient ID are required' });
    }

    // Verify the requesting user is a doctor
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });

    if (!doctor || doctor.userRole !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can assign caregivers' });
    }

    // Verify the patient is assigned to this doctor
    const doctorPatientAssignment = await prisma.doctorPatientAssignment.findUnique({
      where: {
        doctorId_patientId: {
          doctorId,
          patientId,
        },
      },
    });

    if (!doctorPatientAssignment) {
      return res.status(403).json({ error: 'You can only assign caregivers to your own patients' });
    }

    // Verify the caregiver exists and is actually a caregiver
    const caregiver = await prisma.user.findUnique({
      where: { id: caregiverId },
    });

    if (!caregiver || caregiver.userRole !== 'caregiver') {
      return res.status(404).json({ error: 'Caregiver not found' });
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.caregiverPatientAssignment.findUnique({
      where: {
        caregiverId_patientId: {
          caregiverId,
          patientId,
        },
      },
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'This caregiver is already assigned to this patient' });
    }

    // Create the assignment
    const assignment = await prisma.caregiverPatientAssignment.create({
      data: {
        caregiverId,
        patientId,
      },
      include: {
        caregiver: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.json({
      message: 'Caregiver assigned successfully',
      assignment,
    });
  } catch (error) {
    console.error('Assign caregiver error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== TREATMENT PLANS ====================

// Create treatment plan
app.post('/api/treatment-plans', authenticateToken, async (req, res) => {
  try {
    const doctorId = (req as any).user.userId!;
    const { patientId, title, description, goals, medications, exercises, dietPlan, startDate, endDate } = req.body;

    // Verify user is a doctor
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId },
    });

    if (!doctor || doctor.userRole !== 'doctor') {
      return res.status(403).json({ error: 'Only doctors can create treatment plans' });
    }

    // Verify patient is assigned to this doctor
    const assignment = await prisma.doctorPatientAssignment.findUnique({
      where: {
        doctorId_patientId: {
          doctorId,
          patientId,
        },
      },
    });

    if (!assignment) {
      return res.status(403).json({ error: 'You can only create treatment plans for your own patients' });
    }

    const treatmentPlan = await prisma.treatmentPlan.create({
      data: {
        patientId,
        doctorId,
        title,
        description,
        goals,
        medications,
        exercises,
        dietPlan,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: 'active',
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    res.json(treatmentPlan);
  } catch (error) {
    console.error('Create treatment plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get treatment plans for a patient
app.get('/api/treatment-plans/patient/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const userId = (req as any).user.userId!;

    const plans = await prisma.treatmentPlan.findMany({
      where: { patientId },
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(plans);
  } catch (error) {
    console.error('Get treatment plans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update treatment plan
app.put('/api/treatment-plans/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = (req as any).user.userId!;
    const updates = req.body;

    // Verify the plan belongs to this doctor
    const existingPlan = await prisma.treatmentPlan.findUnique({
      where: { id },
    });

    if (!existingPlan || existingPlan.doctorId !== doctorId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedPlan = await prisma.treatmentPlan.update({
      where: { id },
      data: updates,
    });

    res.json(updatedPlan);
  } catch (error) {
    console.error('Update treatment plan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== MEDICATIONS ====================

// Create medication
app.post('/api/medications', authenticateToken, async (req, res) => {
  try {
    const { patientId, name, dosage, frequency, time, startDate, endDate, notes } = req.body;

    const medication = await prisma.medication.create({
      data: {
        patientId,
        name,
        dosage,
        frequency,
        time,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        notes,
      },
    });

    res.json(medication);
  } catch (error) {
    console.error('Create medication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get medications for a patient
app.get('/api/medications/patient/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;

    const medications = await prisma.medication.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(medications);
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update medication
app.put('/api/medications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const medication = await prisma.medication.update({
      where: { id },
      data: updates,
    });

    res.json(medication);
  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete medication
app.delete('/api/medications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.medication.delete({
      where: { id },
    });

    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== VITAL SIGNS ====================

// Record vital signs
app.post('/api/vital-signs', authenticateToken, async (req, res) => {
  try {
    const caregiverId = (req as any).user.userId!;
    const { patientId, bloodPressure, heartRate, temperature, oxygenLevel, weight, recordedAt, notes } = req.body;

    const vitalSigns = await prisma.vitalSigns.create({
      data: {
        patientId,
        caregiverId,
        bloodPressure,
        heartRate,
        temperature,
        oxygenLevel,
        weight,
        recordedAt: new Date(recordedAt),
        notes,
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    res.json(vitalSigns);
  } catch (error) {
    console.error('Record vital signs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vital signs for a patient
app.get('/api/vital-signs/patient/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;

    const vitalSigns = await prisma.vitalSigns.findMany({
      where: { patientId },
      include: {
        caregiver: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { recordedAt: 'desc' },
    });

    res.json(vitalSigns);
  } catch (error) {
    console.error('Get vital signs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== NUTRITION LOGS ====================

// Create nutrition log
app.post('/api/nutrition-logs', authenticateToken, async (req, res) => {
  try {
    const { patientId, mealType, foods, calories, protein, carbs, fats, recordedAt, notes } = req.body;

    const nutritionLog = await prisma.nutritionLog.create({
      data: {
        patientId,
        mealType,
        foods,
        calories,
        protein,
        carbs,
        fats,
        recordedAt: new Date(recordedAt),
        notes,
      },
    });

    res.json(nutritionLog);
  } catch (error) {
    console.error('Create nutrition log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get nutrition logs for a patient
app.get('/api/nutrition-logs/patient/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;

    const where: any = { patientId };

    if (startDate && endDate) {
      where.recordedAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const nutritionLogs = await prisma.nutritionLog.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
    });

    res.json(nutritionLogs);
  } catch (error) {
    console.error('Get nutrition logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== EXERCISE LOGS ====================

// Create exercise log
app.post('/api/exercise-logs', authenticateToken, async (req, res) => {
  try {
    const { patientId, exerciseType, duration, intensity, caloriesBurned, recordedAt, notes } = req.body;

    const exerciseLog = await prisma.exerciseLog.create({
      data: {
        patientId,
        exerciseType,
        duration,
        intensity,
        caloriesBurned,
        recordedAt: new Date(recordedAt),
        notes,
      },
    });

    res.json(exerciseLog);
  } catch (error) {
    console.error('Create exercise log error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get exercise logs for a patient
app.get('/api/exercise-logs/patient/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;

    const where: any = { patientId };

    if (startDate && endDate) {
      where.recordedAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const exerciseLogs = await prisma.exerciseLog.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
    });

    res.json(exerciseLogs);
  } catch (error) {
    console.error('Get exercise logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== EMERGENCY ALERTS ====================

// Create emergency alert
app.post('/api/emergency-alerts', authenticateToken, async (req, res) => {
  try {
    const { patientId, alertType, severity, description } = req.body;

    const alert = await prisma.emergencyAlert.create({
      data: {
        patientId,
        alertType,
        severity,
        description,
        status: 'active',
      },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    res.json(alert);
  } catch (error) {
    console.error('Create emergency alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get emergency alerts
app.get('/api/emergency-alerts', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    let alerts: any[];

    if (user?.userRole === 'doctor') {
      // Get alerts for all patients assigned to this doctor
      const assignments = await prisma.doctorPatientAssignment.findMany({
        where: { doctorId: userId },
        select: { patientId: true },
      });

      const patientIds = assignments.map(a => a.patientId);

      alerts = await prisma.emergencyAlert.findMany({
        where: {
          patientId: { in: patientIds },
          status: { in: ['active', 'acknowledged'] },
        },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else if (user?.userRole === 'caregiver') {
      // Get alerts for all patients assigned to this caregiver
      const assignments = await prisma.caregiverPatientAssignment.findMany({
        where: { caregiverId: userId },
        select: { patientId: true },
      });

      const patientIds = assignments.map(a => a.patientId);

      alerts = await prisma.emergencyAlert.findMany({
        where: {
          patientId: { in: patientIds },
          status: { in: ['active', 'acknowledged'] },
        },
        include: {
          patient: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      alerts = [];
    }

    res.json(alerts);
  } catch (error) {
    console.error('Get emergency alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update alert status
app.put('/api/emergency-alerts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const alert = await prisma.emergencyAlert.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'resolved' ? new Date() : null,
      },
    });

    res.json(alert);
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== ANALYTICS ====================

// Get doctor analytics
app.get('/api/analytics/doctor', authenticateToken, async (req, res) => {
  try {
    const doctorId = (req as any).user.userId!;

    // Get all patients assigned to this doctor
    const assignments = await prisma.doctorPatientAssignment.findMany({
      where: { doctorId },
      include: {
        patient: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    const patientIds = assignments.map(a => a.patientId);

    // Get latest assessments for each patient
    const [gad7Assessments, phq9Assessments, cvdAssessments] = await Promise.all([
      prisma.gAD7Assessment.findMany({
        where: { userId: { in: patientIds } },
        orderBy: { completedAt: 'desc' },
        distinct: ['userId'],
      }),
      prisma.pHQ9Assessment.findMany({
        where: { userId: { in: patientIds } },
        orderBy: { completedAt: 'desc' },
        distinct: ['userId'],
      }),
      prisma.cVDAssessment.findMany({
        where: { userId: { in: patientIds } },
        orderBy: { completedAt: 'desc' },
        distinct: ['userId'],
      }),
    ]);

    // Calculate risk distribution
    const riskDistribution = {
      green: 0,
      yellow: 0,
      orange: 0,
      maroon: 0,
      red: 0,
    };

    [...gad7Assessments, ...phq9Assessments, ...cvdAssessments].forEach(assessment => {
      const color = (assessment as any).colorCode || (assessment as any).overallColor;
      if (color && riskDistribution.hasOwnProperty(color.toLowerCase())) {
        riskDistribution[color.toLowerCase() as keyof typeof riskDistribution]++;
      }
    });

    // Get high-risk patients
    const highRiskPatients = new Set<string>();
    [...gad7Assessments, ...phq9Assessments, ...cvdAssessments].forEach(assessment => {
      const color = (assessment as any).colorCode || (assessment as any).overallColor;
      if (color && ['red', 'maroon'].includes(color.toLowerCase())) {
        highRiskPatients.add(assessment.userId);
      }
    });

    res.json({
      totalPatients: patientIds.length,
      riskDistribution,
      highRiskPatientCount: highRiskPatients.size,
      assessmentCounts: {
        gad7: gad7Assessments.length,
        phq9: phq9Assessments.length,
        cvd: cvdAssessments.length,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Import progress tracking endpoints
import {
  getAssessmentHistory,
  getPatientTreatmentPlans,
  getPatientCareActivities,
  getDoctorPatientProgress,
  getCaregiverPatientProgress,
} from './progressEndpoints.js';

// Patient progress tracking routes
app.get('/api/patient/assessment-history', authenticateToken, getAssessmentHistory);
app.get('/api/patient/treatment-plans', authenticateToken, getPatientTreatmentPlans);
app.get('/api/patient/care-activities', authenticateToken, getPatientCareActivities);
app.get('/api/doctor/patient/:patientId/progress', authenticateToken, getDoctorPatientProgress);
app.get('/api/caregiver/patient/:patientId/progress', authenticateToken, getCaregiverPatientProgress);

// Resources endpoint - public access for educational content
app.get('/api/resources', async (req, res) => {
  try {
    const resources = await prisma.resourceCategory.findMany({
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    
    console.log(`[Resources API] Found ${resources.length} categories`);
    resources.forEach(cat => {
      console.log(`[Resources API] Category: ${cat.title}, Items: ${cat.items.length}`);
    });
    
    res.json(resources);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
  }
});

// Export for Vercel
export default app;

// Only listen if not on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
