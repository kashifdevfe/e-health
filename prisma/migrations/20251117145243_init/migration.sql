-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "user_role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "doctor_patient_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doctor_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "doctor_patient_assignments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "doctor_patient_assignments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "caregiver_patient_assignments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caregiver_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "assigned_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "caregiver_patient_assignments_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "caregiver_patient_assignments_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "patient_demographics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "father_husband_name" TEXT,
    "cnic" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "blood_group" TEXT,
    "village_town_city" TEXT,
    "province" TEXT,
    "height" REAL,
    "weight" REAL,
    "blood_pressure" TEXT,
    "bp_measurement_method" TEXT,
    "diabetes_level" TEXT,
    "diabetes_measurement_method" TEXT,
    "cvd_treatment" BOOLEAN NOT NULL DEFAULT false,
    "hospital_name" TEXT,
    "doctor_name" TEXT,
    "socioeconomic_status" TEXT,
    "education" TEXT,
    "employment_status" TEXT,
    "employment_type" TEXT,
    "monthly_salary" REAL,
    "household_expenditure" REAL,
    "health_expenditure" REAL,
    "food_expenditure" REAL,
    "travelling_expenditure" REAL,
    "parents_cousins" BOOLEAN NOT NULL DEFAULT false,
    "cousin_relation" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "patient_demographics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gad7_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "q1" INTEGER NOT NULL,
    "q2" INTEGER NOT NULL,
    "q3" INTEGER NOT NULL,
    "q4" INTEGER NOT NULL,
    "q5" INTEGER NOT NULL,
    "q6" INTEGER NOT NULL,
    "q7" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    "severity_level" TEXT NOT NULL,
    "color_code" TEXT NOT NULL,
    "completed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "gad7_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "phq9_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "q1" INTEGER NOT NULL,
    "q2" INTEGER NOT NULL,
    "q3" INTEGER NOT NULL,
    "q4" INTEGER NOT NULL,
    "q5" INTEGER NOT NULL,
    "q6" INTEGER NOT NULL,
    "q7" INTEGER NOT NULL,
    "q8" INTEGER NOT NULL,
    "q9" INTEGER NOT NULL,
    "total_score" INTEGER NOT NULL,
    "severity_level" TEXT NOT NULL,
    "color_code" TEXT NOT NULL,
    "functional_impact" TEXT,
    "completed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "phq9_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dass21_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "depression_q1" INTEGER NOT NULL,
    "depression_q2" INTEGER NOT NULL,
    "depression_q3" INTEGER NOT NULL,
    "depression_q4" INTEGER NOT NULL,
    "depression_q5" INTEGER NOT NULL,
    "depression_q6" INTEGER NOT NULL,
    "depression_q7" INTEGER NOT NULL,
    "anxiety_q1" INTEGER NOT NULL,
    "anxiety_q2" INTEGER NOT NULL,
    "anxiety_q3" INTEGER NOT NULL,
    "anxiety_q4" INTEGER NOT NULL,
    "anxiety_q5" INTEGER NOT NULL,
    "anxiety_q6" INTEGER NOT NULL,
    "anxiety_q7" INTEGER NOT NULL,
    "stress_q1" INTEGER NOT NULL,
    "stress_q2" INTEGER NOT NULL,
    "stress_q3" INTEGER NOT NULL,
    "stress_q4" INTEGER NOT NULL,
    "stress_q5" INTEGER NOT NULL,
    "stress_q6" INTEGER NOT NULL,
    "stress_q7" INTEGER NOT NULL,
    "depression_score" INTEGER NOT NULL,
    "anxiety_score" INTEGER NOT NULL,
    "stress_score" INTEGER NOT NULL,
    "depression_severity" TEXT NOT NULL,
    "anxiety_severity" TEXT NOT NULL,
    "stress_severity" TEXT NOT NULL,
    "depression_color" TEXT NOT NULL,
    "anxiety_color" TEXT NOT NULL,
    "stress_color" TEXT NOT NULL,
    "completed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "dass21_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cvd_assessments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "q1" TEXT NOT NULL,
    "q2" TEXT NOT NULL,
    "q3" TEXT NOT NULL,
    "q4" TEXT NOT NULL,
    "q5" TEXT NOT NULL,
    "q6" TEXT NOT NULL,
    "q7" TEXT NOT NULL,
    "q8" TEXT NOT NULL,
    "q9" TEXT NOT NULL,
    "q10" TEXT NOT NULL,
    "q1_color" TEXT NOT NULL,
    "q2_color" TEXT NOT NULL,
    "q3_color" TEXT NOT NULL,
    "q4_color" TEXT NOT NULL,
    "q5_color" TEXT NOT NULL,
    "q6_color" TEXT NOT NULL,
    "q7_color" TEXT NOT NULL,
    "q8_color" TEXT NOT NULL,
    "q9_color" TEXT NOT NULL,
    "q10_color" TEXT NOT NULL,
    "overall_risk" TEXT NOT NULL,
    "overall_color" TEXT NOT NULL,
    "completed_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cvd_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "doctor_patient_assignments_doctor_id_patient_id_key" ON "doctor_patient_assignments"("doctor_id", "patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "caregiver_patient_assignments_caregiver_id_patient_id_key" ON "caregiver_patient_assignments"("caregiver_id", "patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_demographics_user_id_key" ON "patient_demographics"("user_id");
