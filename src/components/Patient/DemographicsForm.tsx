import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { User } from 'lucide-react';

interface DemographicsFormProps {
  onComplete: () => void;
}

interface DemographicsFormValues {
  father_husband_name: string;
  cnic: string;
  age: string;
  gender: string;
  blood_group: string;
  village_town_city: string;
  province: string;
  height: string;
  weight: string;
  blood_pressure: string;
  bp_measurement_method: string;
  diabetes_level: string;
  diabetes_measurement_method: string;
  cvd_treatment: boolean;
  hospital_name: string;
  doctor_name: string;
  socioeconomic_status: string;
  education: string;
  employment_status: string;
  employment_type: string;
  monthly_salary: string;
  household_expenditure: string;
  health_expenditure: string;
  food_expenditure: string;
  travelling_expenditure: string;
  parents_cousins: boolean;
  cousin_relation: string;
}

const initialValues: DemographicsFormValues = {
  father_husband_name: '',
  cnic: '',
  age: '',
  gender: '',
  blood_group: '',
  village_town_city: '',
  province: '',
  height: '',
  weight: '',
  blood_pressure: '',
  bp_measurement_method: '',
  diabetes_level: '',
  diabetes_measurement_method: '',
  cvd_treatment: false,
  hospital_name: '',
  doctor_name: '',
  socioeconomic_status: '',
  education: '',
  employment_status: '',
  employment_type: '',
  monthly_salary: '',
  household_expenditure: '',
  health_expenditure: '',
  food_expenditure: '',
  travelling_expenditure: '',
  parents_cousins: false,
  cousin_relation: '',
};

const optionalNumber = () =>
  Yup.number()
    .typeError('Please enter a valid number')
    .min(0, 'Value cannot be negative')
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value));

const validationSchema = Yup.object({
  father_husband_name: Yup.string().trim().required('This field is required'),
  cnic: Yup.string()
    .trim()
    .matches(/^\d{5}-\d{7}-\d$/, 'Format should be XXXXX-XXXXXXX-X')
    .required('CNIC is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .integer('Age must be an integer')
    .min(0, 'Age must be positive')
    .max(120, 'Please enter a realistic age')
    .required('Age is required'),
  gender: Yup.string().oneOf(['male', 'female', 'other'], 'Please select a gender').required('Gender is required'),
  village_town_city: Yup.string().trim().required('This field is required'),
  province: Yup.string().trim().required('This field is required'),
  height: optionalNumber(),
  weight: optionalNumber(),
  household_expenditure: optionalNumber(),
  health_expenditure: optionalNumber(),
  food_expenditure: optionalNumber(),
  travelling_expenditure: optionalNumber(),
  employment_status: Yup.string()
    .oneOf(['yes', 'no', 'housewife'], 'Please select an employment status')
    .required('Employment status is required'),
  employment_type: Yup.string().when('employment_status', {
    is: 'yes',
    then: schema => schema.required('Employment type is required when employed'),
    otherwise: schema => schema,
  }),
  monthly_salary: optionalNumber().when('employment_status', {
    is: 'yes',
    then: schema => schema.required('Monthly salary is required when employed'),
    otherwise: schema => schema,
  }),
  hospital_name: Yup.string().when('cvd_treatment', {
    is: true,
    then: schema => schema.required('Hospital name is required when receiving treatment'),
    otherwise: schema => schema,
  }),
  doctor_name: Yup.string().when('cvd_treatment', {
    is: true,
    then: schema => schema.required('Doctor name is required when receiving treatment'),
    otherwise: schema => schema,
  }),
  cousin_relation: Yup.string().when('parents_cousins', {
    is: true,
    then: schema => schema.required('Relation is required when parents are cousins'),
    otherwise: schema => schema,
  }),
});

export function DemographicsForm({ onComplete }: DemographicsFormProps) {
  const { user } = useAuth();
  const [formError, setFormError] = useState('');

  const formik = useFormik<DemographicsFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setFormError('');

      try {
        const payload: any = {
          ...values,
          age: values.age ? parseInt(values.age, 10) : null,
          height: values.height ? parseFloat(values.height) : null,
          weight: values.weight ? parseFloat(values.weight) : null,
          monthlySalary: values.monthly_salary ? parseFloat(values.monthly_salary) : null,
          householdExpenditure: values.household_expenditure ? parseFloat(values.household_expenditure) : null,
          healthExpenditure: values.health_expenditure ? parseFloat(values.health_expenditure) : null,
          foodExpenditure: values.food_expenditure ? parseFloat(values.food_expenditure) : null,
          travellingExpenditure: values.travelling_expenditure ? parseFloat(values.travelling_expenditure) : null,
        };

        // Convert snake_case to camelCase for API
        const apiPayload: any = {};
        Object.keys(payload).forEach(key => {
          const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          apiPayload[camelKey] = payload[key];
        });

        await api.saveDemographics(apiPayload);
        onComplete();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const getFieldClasses = (field: keyof DemographicsFormValues) =>
    `w-full px-4 py-2 border ${
      formik.touched[field] && formik.errors[field] ? 'border-red-400' : 'border-gray-300'
    } rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent`;

  const renderError = (field: keyof DemographicsFormValues) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="mt-1 text-sm text-red-600">{formik.errors[field]}</p>
    ) : null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <User className="w-8 h-8 text-primary mr-3" />
          <h2 className="text-2xl font-bold text-primary-dark">Patient Demographics</h2>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Father/Husband Name</label>
              <input
                type="text"
                {...formik.getFieldProps('father_husband_name')}
                className={getFieldClasses('father_husband_name')}
              />
              {renderError('father_husband_name')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNIC Number</label>
              <input
                type="text"
                {...formik.getFieldProps('cnic')}
                className={getFieldClasses('cnic')}
                placeholder="XXXXX-XXXXXXX-X"
              />
              {renderError('cnic')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" {...formik.getFieldProps('age')} className={getFieldClasses('age')} />
              {renderError('age')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select {...formik.getFieldProps('gender')} className={getFieldClasses('gender')}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {renderError('gender')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select {...formik.getFieldProps('blood_group')} className={getFieldClasses('blood_group')}>
                <option value="">Select</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village/Town/City</label>
              <input type="text" {...formik.getFieldProps('village_town_city')} className={getFieldClasses('village_town_city')} />
              {renderError('village_town_city')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
              <input type="text" {...formik.getFieldProps('province')} className={getFieldClasses('province')} />
              {renderError('province')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input type="number" step="0.1" {...formik.getFieldProps('height')} className={getFieldClasses('height')} />
              {renderError('height')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input type="number" step="0.1" {...formik.getFieldProps('weight')} className={getFieldClasses('weight')} />
              {renderError('weight')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
              <input
                type="text"
                {...formik.getFieldProps('blood_pressure')}
                className={getFieldClasses('blood_pressure')}
                placeholder="120/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BP Measurement Method</label>
              <input type="text" {...formik.getFieldProps('bp_measurement_method')} className={getFieldClasses('bp_measurement_method')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diabetes Level</label>
              <input type="text" {...formik.getFieldProps('diabetes_level')} className={getFieldClasses('diabetes_level')} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diabetes Measurement Method</label>
              <input
                type="text"
                {...formik.getFieldProps('diabetes_measurement_method')}
                className={getFieldClasses('diabetes_measurement_method')}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-primary-dark mb-4">CVD Treatment</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="cvd_treatment"
                checked={formik.values.cvd_treatment}
                onChange={event => formik.setFieldValue('cvd_treatment', event.currentTarget.checked)}
                className="w-4 h-4 text-secondary rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Currently receiving CVD treatment</label>
            </div>

            {formik.values.cvd_treatment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                  <input type="text" {...formik.getFieldProps('hospital_name')} className={getFieldClasses('hospital_name')} />
                  {renderError('hospital_name')}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                  <input type="text" {...formik.getFieldProps('doctor_name')} className={getFieldClasses('doctor_name')} />
                  {renderError('doctor_name')}
                </div>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-primary-dark mb-4">Socioeconomic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Socioeconomic Status</label>
                <select
                  {...formik.getFieldProps('socioeconomic_status')}
                  className={getFieldClasses('socioeconomic_status')}
                >
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="middle">Middle</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                <input type="text" {...formik.getFieldProps('education')} className={getFieldClasses('education')} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
                <select {...formik.getFieldProps('employment_status')} className={getFieldClasses('employment_status')}>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="housewife">Housewife</option>
                </select>
              </div>

              {formik.values.employment_status === 'yes' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                    <select {...formik.getFieldProps('employment_type')} className={getFieldClasses('employment_type')}>
                      <option value="">Select</option>
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </select>
                    {renderError('employment_type')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Salary</label>
                    <input type="number" {...formik.getFieldProps('monthly_salary')} className={getFieldClasses('monthly_salary')} />
                    {renderError('monthly_salary')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Household Expenditure</label>
                    <input
                      type="number"
                      {...formik.getFieldProps('household_expenditure')}
                      className={getFieldClasses('household_expenditure')}
                    />
                    {renderError('household_expenditure')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Health Expenditure</label>
                    <input
                      type="number"
                      {...formik.getFieldProps('health_expenditure')}
                      className={getFieldClasses('health_expenditure')}
                    />
                    {renderError('health_expenditure')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Food Expenditure</label>
                    <input
                      type="number"
                      {...formik.getFieldProps('food_expenditure')}
                      className={getFieldClasses('food_expenditure')}
                    />
                    {renderError('food_expenditure')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Travelling Expenditure</label>
                    <input
                      type="number"
                      {...formik.getFieldProps('travelling_expenditure')}
                      className={getFieldClasses('travelling_expenditure')}
                    />
                    {renderError('travelling_expenditure')}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-primary-dark mb-4">Family History</h3>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                name="parents_cousins"
                checked={formik.values.parents_cousins}
                onChange={event => formik.setFieldValue('parents_cousins', event.currentTarget.checked)}
                className="w-4 h-4 text-secondary rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Are parents cousins?</label>
            </div>

            {formik.values.parents_cousins && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cousin Relation</label>
                <select {...formik.getFieldProps('cousin_relation')} className={getFieldClasses('cousin_relation')}>
                  <option value="">Select</option>
                  <option value="maternal">Maternal</option>
                  <option value="paternal">Paternal</option>
                </select>
                {renderError('cousin_relation')}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {formik.isSubmitting ? 'Saving...' : 'Save and Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
