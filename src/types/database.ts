export type UserRole = 'patient' | 'doctor' | 'caregiver';

export interface Profile {
  id: string;
  full_name: string;
  user_role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface PatientDemographics {
  id: string;
  user_id: string;
  father_husband_name?: string;
  cnic?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  village_town_city?: string;
  province?: string;
  height?: number;
  weight?: number;
  blood_pressure?: string;
  bp_measurement_method?: string;
  diabetes_level?: string;
  diabetes_measurement_method?: string;
  cvd_treatment: boolean;
  hospital_name?: string;
  doctor_name?: string;
  socioeconomic_status?: string;
  education?: string;
  employment_status?: string;
  employment_type?: string;
  monthly_salary?: number;
  household_expenditure?: number;
  health_expenditure?: number;
  food_expenditure?: number;
  travelling_expenditure?: number;
  parents_cousins: boolean;
  cousin_relation?: string;
  created_at: string;
  updated_at: string;
}

export interface GAD7Assessment {
  id: string;
  user_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  total_score: number;
  severity_level: string;
  color_code: string;
  functional_impact?: string;
  completed_at: string;
}

export interface PHQ9Assessment {
  id: string;
  user_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  total_score: number;
  severity_level: string;
  color_code: string;
  functional_impact?: string;
  completed_at: string;
}

export interface DASS21Assessment {
  id: string;
  user_id: string;
  depression_q1: number;
  depression_q2: number;
  depression_q3: number;
  depression_q4: number;
  depression_q5: number;
  depression_q6: number;
  depression_q7: number;
  anxiety_q1: number;
  anxiety_q2: number;
  anxiety_q3: number;
  anxiety_q4: number;
  anxiety_q5: number;
  anxiety_q6: number;
  anxiety_q7: number;
  stress_q1: number;
  stress_q2: number;
  stress_q3: number;
  stress_q4: number;
  stress_q5: number;
  stress_q6: number;
  stress_q7: number;
  depression_score: number;
  anxiety_score: number;
  stress_score: number;
  depression_severity: string;
  anxiety_severity: string;
  stress_severity: string;
  depression_color: string;
  anxiety_color: string;
  stress_color: string;
  completed_at: string;
}

export interface CVDAssessment {
  id: string;
  user_id: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q1_color: string;
  q2_color: string;
  q3_color: string;
  q4_color: string;
  q5_color: string;
  q6_color: string;
  q7_color: string;
  q8_color: string;
  q9_color: string;
  q10_color: string;
  overall_risk: string;
  overall_color: string;
  completed_at: string;
}
