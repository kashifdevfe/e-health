import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import { UserRole } from '../../types/database';

interface RegisterFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required('Full name is required'),
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  role: Yup.mixed<UserRole>().oneOf(['patient', 'doctor', 'caregiver'], 'Please select a role'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export function RegisterForm({ onToggleForm }: { onToggleForm: () => void }) {
  const { signUp } = useAuth();
  const [authError, setAuthError] = useState('');

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'patient',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError('');
      const { error } = await signUp(values.email, values.password, values.fullName, values.role);

      if (error) {
        setAuthError(error.message);
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <UserPlus className="w-8 h-8 text-primary mr-2" />
          <h2 className="text-2xl font-bold text-primary-dark">Register</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {authError}
            </div>
          )}

          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-primary-dark mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border ${
                formik.touched.fullName && formik.errors.fullName ? 'border-red-400' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
              placeholder="John Doe"
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-dark mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border ${
                formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
              placeholder="your.email@example.com"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-primary-dark mb-1">
              Register As
            </label>
            <select
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border ${
                formik.touched.role && formik.errors.role ? 'border-red-400' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="caregiver">Caregiver</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.role}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary-dark mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border ${
                formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
              placeholder="••••••••"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-dark mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2 border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-400' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`}
              placeholder="••••••••"
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {formik.isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-secondary hover:text-primary text-sm font-medium"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
