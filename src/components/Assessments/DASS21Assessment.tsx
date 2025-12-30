import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { calculateDASS21 } from '../../utils/scoring';
import { Activity } from 'lucide-react';

interface DASS21AssessmentProps {
  onComplete: () => void;
}

const depressionQuestions = [
  'I couldn\'t seem to experience any positive feeling at all',
  'I found it difficult to work up the initiative to do things',
  'I felt that I had nothing to look forward to',
  'I felt down-hearted and blue',
  'I was unable to become enthusiastic about anything',
  'I felt I wasn\'t worth much as a person',
  'I felt that life was meaningless'
];

const anxietyQuestions = [
  'I was aware of dryness of my mouth',
  'I experienced breathing difficulty',
  'I experienced trembling (e.g., in the hands)',
  'I was worried about situations in which I might panic',
  'I felt I was close to panic',
  'I was aware of the action of my heart in the absence of physical exertion',
  'I felt scared without any good reason'
];

const stressQuestions = [
  'I found it hard to wind down',
  'I tended to over-react to situations',
  'I felt that I was using a lot of nervous energy',
  'I found myself getting agitated',
  'I found it difficult to relax',
  'I was intolerant of anything that kept me from getting on with what I was doing',
  'I felt that I was rather touchy'
];

const options = [
  { value: 0, label: 'Did not apply to me at all' },
  { value: 1, label: 'Applied to me to some degree, or some of the time' },
  { value: 2, label: 'Applied to me to a considerable degree or a good part of time' },
  { value: 3, label: 'Applied to me very much or most of the time' },
] as const;

const sections = [
  { key: 'depression', title: 'Depression', questions: depressionQuestions, borderClass: 'border-primary' },
  { key: 'anxiety', title: 'Anxiety', questions: anxietyQuestions, borderClass: 'border-secondary' },
  { key: 'stress', title: 'Stress', questions: stressQuestions, borderClass: 'border-accent' },
] as const;

type SectionKey = (typeof sections)[number]['key'];
type FieldKey = `${SectionKey}_q${1 | 2 | 3 | 4 | 5 | 6 | 7}`;

type DASS21FormValues = Record<FieldKey, string>;

const validationSchema = Yup.object(
  sections.reduce((shape, section) => {
    section.questions.forEach((_, index) => {
      const key = `${section.key}_q${index + 1}` as FieldKey;
      shape[key] = Yup.string().required('Please select an option');
    });
    return shape;
  }, {} as Record<FieldKey, Yup.StringSchema<string>>)
);

const initialValues = sections.reduce((values, section) => {
  section.questions.forEach((_, index) => {
    const key = `${section.key}_q${index + 1}` as FieldKey;
    values[key] = '';
  });
  return values;
}, {} as DASS21FormValues);

export function DASS21Assessment({ onComplete }: DASS21AssessmentProps) {
  const { user } = useAuth();
  const [formError, setFormError] = useState('');

  const formik = useFormik<DASS21FormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setFormError('');

      try {
        const depressionResponses = depressionQuestions.map((_, index) =>
          Number(values[`depression_q${index + 1}` as FieldKey])
        );
        const anxietyResponses = anxietyQuestions.map((_, index) =>
          Number(values[`anxiety_q${index + 1}` as FieldKey])
        );
        const stressResponses = stressQuestions.map((_, index) =>
          Number(values[`stress_q${index + 1}` as FieldKey])
        );

        const result = calculateDASS21(depressionResponses, anxietyResponses, stressResponses);

        const payload: any = {};
        sections.forEach(section => {
          section.questions.forEach((_, index) => {
            const key = `${section.key}_q${index + 1}` as FieldKey;
            const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            payload[camelKey] = Number(values[key]);
          });
        });

        await api.saveDASS21({
          ...payload,
          depressionScore: result.depressionScore,
          anxietyScore: result.anxietyScore,
          stressScore: result.stressScore,
          depressionSeverity: result.depressionSeverity,
          anxietySeverity: result.anxietySeverity,
          stressSeverity: result.stressSeverity,
          depressionColor: result.depressionColor,
          anxietyColor: result.anxietyColor,
          stressColor: result.stressColor,
        });

        onComplete();
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const renderError = (field: FieldKey) =>
    formik.touched[field] && formik.errors[field] ? (
      <p className="mt-2 text-sm text-red-600">{formik.errors[field]}</p>
    ) : null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Activity className="w-8 h-8 text-primary mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-secondary">DASS-21 Assessment</h2>
            <p className="text-sm text-gray-600 mt-1">
              Please read each statement and indicate how much it applied to you over the past week
            </p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-8" noValidate>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{formError}</div>
          )}

          {sections.map(section => (
            <div key={section.key} className={`border-l-4 ${section.borderClass} pl-4`}>
              <h3 className="text-xl font-semibold text-secondary mb-4">{section.title}</h3>
              {section.questions.map((question, index) => {
                const fieldName = `${section.key}_q${index + 1}` as FieldKey;
                return (
                  <div key={fieldName} className="border-b pb-4 mb-4">
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
            </div>
          ))}

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
