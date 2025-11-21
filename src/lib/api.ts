const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiError {
  error: string;
}

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        error: 'An error occurred',
      }));
      throw new Error(error.error);
    }

    return response.json();
  }

  // Auth methods
  async register(email: string, password: string, fullName: string, role: string) {
    const response = await this.request<{ user: any; token: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, role }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/api/auth/me');
  }

  logout() {
    this.removeToken();
  }

  // Patient Demographics
  async getDemographics() {
    return this.request('/api/patient-demographics');
  }

  async saveDemographics(data: any) {
    return this.request('/api/patient-demographics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Assessments
  async saveGAD7(data: any) {
    return this.request('/api/assessments/gad7', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGAD7() {
    return this.request('/api/assessments/gad7');
  }

  async savePHQ9(data: any) {
    return this.request('/api/assessments/phq9', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPHQ9() {
    return this.request('/api/assessments/phq9');
  }

  async saveDASS21(data: any) {
    return this.request('/api/assessments/dass21', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDASS21() {
    return this.request('/api/assessments/dass21');
  }

  async saveCVD(data: any) {
    return this.request('/api/assessments/cvd', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCVD() {
    return this.request('/api/assessments/cvd');
  }

  async getAllAssessments() {
    return this.request('/api/assessments/all');
  }

  // Doctor endpoints
  async getDoctorPatients() {
    return this.request('/api/doctor/patients');
  }

  // Caregiver endpoints
  async getCaregiverPatients() {
    return this.request('/api/caregiver/patients');
  }

  // Doctor booking endpoints
  async getAvailableDoctors() {
    return this.request('/api/doctors/available');
  }

  async bookAppointment(doctorId: string) {
    return this.request('/api/appointments/book', {
      method: 'POST',
      body: JSON.stringify({ doctorId }),
    });
  }

  // Caregiver endpoints
  async getAvailableCaregivers() {
    return this.request('/api/caregivers/available');
  }

  async assignCaregiver(caregiverId: string, patientId: string) {
    return this.request('/api/caregivers/assign', {
      method: 'POST',
      body: JSON.stringify({ caregiverId, patientId }),
    });
  }

  // Treatment Plans
  async createTreatmentPlan(data: any) {
    return this.request('/api/treatment-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTreatmentPlans(patientId: string) {
    return this.request(`/api/treatment-plans/patient/${patientId}`);
  }

  async updateTreatmentPlan(id: string, data: any) {
    return this.request(`/api/treatment-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Medications
  async createMedication(data: any) {
    return this.request('/api/medications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMedications(patientId: string) {
    return this.request(`/api/medications/patient/${patientId}`);
  }

  async updateMedication(id: string, data: any) {
    return this.request(`/api/medications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMedication(id: string) {
    return this.request(`/api/medications/${id}`, {
      method: 'DELETE',
    });
  }

  // Vital Signs
  async recordVitalSigns(data: any) {
    return this.request('/api/vital-signs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getVitalSigns(patientId: string) {
    return this.request(`/api/vital-signs/patient/${patientId}`);
  }

  // Nutrition Logs
  async createNutritionLog(data: any) {
    return this.request('/api/nutrition-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNutritionLogs(patientId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/nutrition-logs/patient/${patientId}${query}`);
  }

  // Exercise Logs
  async createExerciseLog(data: any) {
    return this.request('/api/exercise-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getExerciseLogs(patientId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/api/exercise-logs/patient/${patientId}${query}`);
  }

  // Emergency Alerts
  async createEmergencyAlert(data: any) {
    return this.request('/api/emergency-alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEmergencyAlerts() {
    return this.request('/api/emergency-alerts');
  }

  async updateAlertStatus(id: string, status: string) {
    return this.request(`/api/emergency-alerts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Analytics
  async getDoctorAnalytics() {
    return this.request('/api/analytics/doctor');
  }
}

export const api = new ApiClient();
