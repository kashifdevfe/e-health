import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  email: Yup.string().email('Please enter a valid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export function LoginForm({ onToggleForm }: { onToggleForm: () => void }) {
  const { signIn } = useAuth();
  const [authError, setAuthError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setAuthError('');
      const { error } = await signIn(values.email, values.password);

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
          <LogIn className="w-8 h-8 text-primary mr-2" />
          <h2 className="text-2xl font-bold text-primary-dark">Login</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {authError}
            </div>
          )}

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

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onToggleForm}
              className="text-secondary hover:text-primary text-sm font-medium"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
