// Patient Progress Tracking Endpoints
import { Request, Response } from 'express';
import { prisma } from './prisma.js';

// Patient assessment history (for retaking surveys and viewing trends)
export const getAssessmentHistory = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const [gad7History, phq9History, cvdHistory, dass21History] = await Promise.all([
            prisma.gAD7Assessment.findMany({
                where: { userId },
                orderBy: { completedAt: 'desc' },
            }),
            prisma.pHQ9Assessment.findMany({
                where: { userId },
                orderBy: { completedAt: 'desc' },
            }),
            prisma.cVDAssessment.findMany({
                where: { userId },
                orderBy: { completedAt: 'desc' },
            }),
            prisma.dASS21Assessment.findMany({
                where: { userId },
                orderBy: { completedAt: 'desc' },
            }),
        ]);

        res.json({
            gad7: gad7History,
            phq9: phq9History,
            cvd: cvdHistory,
            dass21: dass21History,
        });
    } catch (error) {
        console.error('Get assessment history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get treatment plans for patient
export const getPatientTreatmentPlans = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const treatmentPlans = await prisma.treatmentPlan.findMany({
            where: { patientId: userId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json(treatmentPlans);
    } catch (error) {
        console.error('Get treatment plans error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get care activities for patient (medications, vitals, etc.)
export const getPatientCareActivities = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const [medications, vitalSigns, nutritionLogs, exerciseLogs] = await Promise.all([
            prisma.medication.findMany({
                where: { patientId: userId },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            prisma.vitalSigns.findMany({
                where: { patientId: userId },
                orderBy: { recordedAt: 'desc' },
                take: 10,
            }),
            prisma.nutritionLog.findMany({
                where: { patientId: userId },
                orderBy: { recordedAt: 'desc' },
                take: 10,
            }),
            prisma.exerciseLog.findMany({
                where: { patientId: userId },
                orderBy: { recordedAt: 'desc' },
                take: 10,
            }),
        ]);

        res.json({
            medications,
            vitalSigns,
            nutritionLogs,
            exerciseLogs,
        });
    } catch (error) {
        console.error('Get care activities error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Doctor: Get patient progress
export const getDoctorPatientProgress = async (req: Request, res: Response) => {
    try {
        const doctorId = (req as any).user.userId;
        const { patientId } = req.params;

        // Verify doctor has access to this patient
        const treatmentPlan = await prisma.treatmentPlan.findFirst({
            where: {
                doctorId,
                patientId,
            },
        });

        if (!treatmentPlan) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Get assessment history
        const [gad7, phq9, cvd] = await Promise.all([
            prisma.gAD7Assessment.findMany({
                where: { userId: patientId },
                orderBy: { completedAt: 'desc' },
                take: 5,
            }),
            prisma.pHQ9Assessment.findMany({
                where: { userId: patientId },
                orderBy: { completedAt: 'desc' },
                take: 5,
            }),
            prisma.cVDAssessment.findMany({
                where: { userId: patientId },
                orderBy: { completedAt: 'desc' },
                take: 5,
            }),
        ]);

        res.json({
            assessmentHistory: {
                gad7,
                phq9,
                cvd,
            },
            treatmentPlan,
        });
    } catch (error) {
        console.error('Get patient progress error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Caregiver: Get patient progress
export const getCaregiverPatientProgress = async (req: Request, res: Response) => {
    try {
        const caregiverId = (req as any).user.userId;
        const { patientId } = req.params;

        // Get care data (simplified - in real app would check caregiver assignment)
        const [medications, vitalSigns, nutritionLogs, exerciseLogs] = await Promise.all([
            prisma.medication.findMany({
                where: { patientId },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.vitalSigns.findMany({
                where: { patientId },
                orderBy: { recordedAt: 'desc' },
                take: 30,
            }),
            prisma.nutritionLog.findMany({
                where: { patientId },
                orderBy: { recordedAt: 'desc' },
                take: 30,
            }),
            prisma.exerciseLog.findMany({
                where: { patientId },
                orderBy: { recordedAt: 'desc' },
                take: 30,
            }),
        ]);

        // Calculate compliance
        const totalMedications = medications.length;
        const totalVitals = vitalSigns.length;
        const totalNutrition = nutritionLogs.length;
        const totalExercise = exerciseLogs.length;

        res.json({
            medications,
            vitalSigns,
            nutritionLogs,
            exerciseLogs,
            compliance: {
                medications: totalMedications,
                vitals: totalVitals,
                nutrition: totalNutrition,
                exercise: totalExercise,
            },
        });
    } catch (error) {
        console.error('Get caregiver patient progress error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
