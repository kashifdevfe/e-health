-- CreateTable
CREATE TABLE "treatment_plans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "medications" TEXT,
    "exercises" TEXT,
    "diet_plan" TEXT,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "treatment_plans_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "treatment_plans_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "medications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "vital_signs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "caregiver_id" TEXT NOT NULL,
    "blood_pressure" TEXT,
    "heart_rate" INTEGER,
    "temperature" REAL,
    "oxygen_level" INTEGER,
    "weight" REAL,
    "recorded_at" DATETIME NOT NULL,
    "notes" TEXT,
    CONSTRAINT "vital_signs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "vital_signs_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "nutrition_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "meal_type" TEXT NOT NULL,
    "foods" TEXT NOT NULL,
    "calories" INTEGER,
    "protein" REAL,
    "carbs" REAL,
    "fats" REAL,
    "recorded_at" DATETIME NOT NULL,
    "notes" TEXT,
    CONSTRAINT "nutrition_logs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "exercise_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "exercise_type" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "intensity" TEXT NOT NULL,
    "calories_burned" INTEGER,
    "recorded_at" DATETIME NOT NULL,
    "notes" TEXT,
    CONSTRAINT "exercise_logs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "emergency_alerts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patient_id" TEXT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" DATETIME,
    CONSTRAINT "emergency_alerts_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
