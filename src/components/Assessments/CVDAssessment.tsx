import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { calculateCVDRisk } from '../../utils/scoring';
import { HeartPulse } from 'lucide-react';

interface CVDAssessmentProps {
  onComplete: () => void;
}

const questions = [
  {
    question: 'Do you currently smoke, or have you smoked in the past?',
    options: ['Never Smoked', 'Former Smoker', 'Current Smoker'],
  },
  {
    question: 'Do you have high blood pressure (hypertension)?',
    options: ['No', 'Yes, controlled with medication', 'Yes, uncontrolled'],
  },
  {
    question: 'Do you have high cholesterol?',
    options: ['No', 'Yes, controlled with medication', 'Yes, uncontrolled', 'Unknown'],
  },
  {
    question: 'Do you have diabetes?',
    options: ['No', 'Pre-diabetes', 'Type 2 diabetes', 'Type 1 diabetes'],
  },
  {
    question: 'Do you have a family history of heart disease?',
    options: ['No', 'Yes, one parent', 'Yes, both parents', 'Yes, siblings'],
  },
  {
    question: 'Relationship of Parents?',
    options: ['Paternal Cousins', 'Maternal Cousins', 'Outside family'],
  },
  {
    question: 'How many days per week do you exercise for at least 30 minutes?',
    options: ['0 days', '1-2 days', '3-4 days', '5+ days'],
  },
  {
    question: 'How would you rate your diet?',
    options: ['Poor (high in processed foods)', 'Fair', 'Good', 'Excellent (balanced, whole foods)'],
  },
  {
    question: 'Do you experience chest pain or discomfort?',
    options: ['Never', 'Rarely', 'Sometimes', 'Frequently'],
  },
  {
    question: 'Do you experience shortness of breath during normal activities?',
    options: ['Never', 'Rarely', 'Sometimes', 'Frequently'],
  },
] as const;

type QuestionKey = `q${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10}`;

type CVDAssessmentFormValues = Record<QuestionKey, string>;

const validationSchema = Yup.object(
  questions.reduce((shape, _question, index) => {
    const key = `q${index + 1}` as QuestionKey;
    shape[key] = Yup.string().required('Please select an option');
    return shape;
  }, {} as Record<QuestionKey, Yup.StringSchema<string>>)
);

const initialValues = questions.reduce((values, _question, index) => {
  const key = `q${index + 1}` as QuestionKey;
  values[key] = '';
  return values;
}, {} as CVDAssessmentFormValues);

export function CVDAssessment({ onComplete }: CVDAssessmentProps) {
  const { user } = useAuth();
  const [formError, setFormError] = useState('');

  const formik = useFormik<CVDAssessmentFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setFormError('');

      try {
        const responses = questions.map((_, index) => values[`q${index + 1}` as QuestionKey]);
        const result = calculateCVDRisk(responses);

        await api.saveCVD({
          q1: responses[0],
          q2: responses[1],
          q3: responses[2],
          q4: responses[3],
          q5: responses[4],
          q6: responses[5],
          q7: responses[6],
          q8: responses[7],
          q9: responses[8],
          q10: responses[9],
          q1Color: result.colors[0],
          q2Color: result.colors[1],
          q3Color: result.colors[2],
          q4Color: result.colors[3],
          q5Color: result.colors[4],
          q6Color: result.colors[5],
          q7Color: result.colors[6],
          q8Color: result.colors[7],
          q9Color: result.colors[8],
          q10Color: result.colors[9],
          overallRisk: result.overallRisk,
          overallColor: result.overallColor,
        });

        onComplete();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const renderError = (field: QuestionKey) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="mt-2 text-sm text-red-600">{formik.errors[field]}</p>
    ) : null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <HeartPulse className="w-8 h-8 text-secondary mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-primary-dark">Cardiovascular Risk Assessment</h2>
            <p className="text-sm text-gray-600 mt-1">Answer the following questions to assess your cardiovascular health risk</p>
          </div>
        </div>

        <div className="bg-accent-light border border-accent rounded-lg p-4 mb-6">
          <p className="text-sm text-primary-dark">
            <strong>Important Disclaimer:</strong> This assessment is for screening purposes only and does not replace professional medical diagnosis. If you have severe symptoms or are in crisis, seek immediate medical attention or call emergency services.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{formError}</div>
          )}

          {questions.map((q, index) => {
            const fieldName = `q${index + 1}` as QuestionKey;
            return (
              <div key={fieldName} className="border-b pb-4">
                <p className="font-medium text-primary-dark mb-3">
                  {index + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map(option => (
                    <label
                      key={option}
                      className="flex items-center p-3 rounded-lg hover:bg-primary-soft cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name={fieldName}
                        value={option}
                        checked={formik.values[fieldName] === option}
                        onChange={() => formik.setFieldValue(fieldName, option)}
                        onBlur={() => formik.setFieldTouched(fieldName, true)}
                        className="w-4 h-4 text-secondary"
                      />
                      <span className="ml-3 text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {renderError(fieldName)}
              </div>
            );
          })}

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {formik.isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
