import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { calculatePHQ9 } from '../../utils/scoring';
import { Heart } from 'lucide-react';

interface PHQ9AssessmentProps {
  onComplete: () => void;
}

const questions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
] as const;

const questionKeys = questions.map((_, index) => `q${index + 1}` as const);

type QuestionKey = (typeof questionKeys)[number];

const options = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
] as const;

const functionalImpactOptions = [
  'Not difficult at all',
  'Somewhat difficult',
  'Very difficult',
  'Extremely difficult',
] as const;

type PHQ9FormValues = Record<QuestionKey, string> & {
  functional_impact: string;
};

const validationSchema = Yup.object(
  questionKeys.reduce((schema, key) => {
    schema[key] = Yup.string().required('Please select an option');
    return schema;
  }, {} as Record<QuestionKey, Yup.StringSchema<string>>)
).shape({
  functional_impact: Yup.string().required('Please select how difficult these problems have made it for you'),
});

const initialValues = questionKeys.reduce((values, key) => {
  values[key] = '';
  return values;
}, { functional_impact: '' } as PHQ9FormValues);

export function PHQ9Assessment({ onComplete }: PHQ9AssessmentProps) {
  const { user } = useAuth();
  const [formError, setFormError] = useState('');

  const formik = useFormik<PHQ9FormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setFormError('');

      try {
        const responses = questionKeys.map(key => Number(values[key]));
        const result = calculatePHQ9(responses);

        await api.savePHQ9({
          q1: responses[0],
          q2: responses[1],
          q3: responses[2],
          q4: responses[3],
          q5: responses[4],
          q6: responses[5],
          q7: responses[6],
          q8: responses[7],
          q9: responses[8],
          totalScore: result.totalScore,
          severityLevel: result.severityLevel,
          colorCode: result.colorCode,
          functionalImpact: values.functional_impact,
        });

        onComplete();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const renderError = (field: QuestionKey | 'functional_impact') =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="mt-2 text-sm text-red-600">{formik.errors[field]}</p>
    ) : null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Heart className="w-8 h-8 text-primary mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-secondary">PHQ-9 Depression Assessment</h2>
            <p className="text-sm text-gray-600 mt-1">
              Over the last 2 weeks, how often have you been bothered by any of the following problems?
            </p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6" noValidate>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{formError}</div>
          )}

          {questions.map((question, index) => {
            const fieldName = questionKeys[index];

            return (
              <div key={fieldName} className="border-b pb-4">
                <p className="font-medium text-secondary mb-3">
                  {index + 1}. {question}
                </p>
                <div className="space-y-2">
                  {options.map(option => (
                    <label
                      key={option.value}
                      className="flex items-center p-3 rounded-lg hover:bg-primary-soft cursor-pointer transition"
                    >
                      <input
                        type="radio"
                        name={fieldName}
                        value={option.value.toString()}
                        checked={formik.values[fieldName] === option.value.toString()}
                        onChange={() => formik.setFieldValue(fieldName, option.value.toString())}
                        onBlur={() => formik.setFieldTouched(fieldName, true)}
                        className="w-4 h-4 text-secondary"
                      />
                      <span className="ml-3 text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {renderError(fieldName)}
              </div>
            );
          })}

          <div className="border-t pt-4">
            <p className="font-medium text-primary-dark mb-3">
              If you checked off any problems, how difficult have these problems made it for you to do your work, take care
              of things at home, or get along with other people?
            </p>
            <div className="space-y-2">
              {functionalImpactOptions.map(option => (
                <label
                  key={option}
                  className="flex items-center p-3 rounded-lg hover:bg-primary-soft cursor-pointer transition"
                >
                  <input
                    type="radio"
                    name="functional_impact"
                    value={option}
                    checked={formik.values.functional_impact === option}
                    onChange={() => formik.setFieldValue('functional_impact', option)}
                    onBlur={() => formik.setFieldTouched('functional_impact', true)}
                    className="w-4 h-4 text-secondary"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            {renderError('functional_impact')}
          </div>

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
