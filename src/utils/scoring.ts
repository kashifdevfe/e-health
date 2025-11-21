export interface GAD7Result {
  totalScore: number;
  severityLevel: string;
  colorCode: string;
}

export function calculateGAD7(responses: number[]): GAD7Result {
  const totalScore = responses.reduce((sum, val) => sum + val, 0);

  let severityLevel: string;
  let colorCode: string;

  if (totalScore >= 0 && totalScore <= 4) {
    severityLevel = 'None Anxiety';
    colorCode = 'green';
  } else if (totalScore >= 5 && totalScore <= 9) {
    severityLevel = 'Mild Anxiety';
    colorCode = 'yellow';
  } else if (totalScore >= 10 && totalScore <= 14) {
    severityLevel = 'Moderate Anxiety';
    colorCode = 'orange';
  } else {
    severityLevel = 'Severe Anxiety';
    colorCode = 'red';
  }

  return { totalScore, severityLevel, colorCode };
}

export interface PHQ9Result {
  totalScore: number;
  severityLevel: string;
  colorCode: string;
  action: string;
}

export function calculatePHQ9(responses: number[]): PHQ9Result {
  const totalScore = responses.reduce((sum, val) => sum + val, 0);

  let severityLevel: string;
  let colorCode: string;
  let action: string;

  if (totalScore >= 0 && totalScore <= 4) {
    severityLevel = 'None-minimal';
    colorCode = 'green';
    action = 'Patient may not need treatment';
  } else if (totalScore >= 5 && totalScore <= 9) {
    severityLevel = 'Mild';
    colorCode = 'yellow';
    action = 'Use clinical judgment about treatment';
  } else if (totalScore >= 10 && totalScore <= 14) {
    severityLevel = 'Moderate';
    colorCode = 'orange';
    action = 'Use clinical judgment about treatment';
  } else if (totalScore >= 15 && totalScore <= 19) {
    severityLevel = 'Moderately severe';
    colorCode = 'maroon';
    action = 'Treat using antidepressants, psychotherapy, or a combination';
  } else {
    severityLevel = 'Severe';
    colorCode = 'red';
    action = 'Treat using antidepressants with or without psychotherapy';
  }

  return { totalScore, severityLevel, colorCode, action };
}

export interface DASS21Result {
  depressionScore: number;
  anxietyScore: number;
  stressScore: number;
  depressionSeverity: string;
  anxietySeverity: string;
  stressSeverity: string;
  depressionColor: string;
  anxietyColor: string;
  stressColor: string;
}

export function calculateDASS21(
  depressionResponses: number[],
  anxietyResponses: number[],
  stressResponses: number[]
): DASS21Result {
  const depressionScore = depressionResponses.reduce((sum, val) => sum + val, 0) * 2;
  const anxietyScore = anxietyResponses.reduce((sum, val) => sum + val, 0) * 2;
  const stressScore = stressResponses.reduce((sum, val) => sum + val, 0) * 2;

  const getSeverityAndColor = (score: number, type: 'depression' | 'anxiety' | 'stress') => {
    let severity: string;
    let color: string;

    if (type === 'depression') {
      if (score >= 0 && score <= 9) {
        severity = 'Normal';
        color = 'green';
      } else if (score >= 10 && score <= 13) {
        severity = 'Mild';
        color = 'yellow';
      } else if (score >= 14 && score <= 20) {
        severity = 'Moderate';
        color = 'orange';
      } else if (score >= 21 && score <= 27) {
        severity = 'Severe';
        color = 'maroon';
      } else {
        severity = 'Extremely Severe';
        color = 'red';
      }
    } else if (type === 'anxiety') {
      if (score >= 0 && score <= 7) {
        severity = 'Normal';
        color = 'green';
      } else if (score >= 8 && score <= 9) {
        severity = 'Mild';
        color = 'yellow';
      } else if (score >= 10 && score <= 14) {
        severity = 'Moderate';
        color = 'orange';
      } else if (score >= 15 && score <= 19) {
        severity = 'Severe';
        color = 'maroon';
      } else {
        severity = 'Extremely Severe';
        color = 'red';
      }
    } else {
      if (score >= 0 && score <= 14) {
        severity = 'Normal';
        color = 'green';
      } else if (score >= 15 && score <= 18) {
        severity = 'Mild';
        color = 'yellow';
      } else if (score >= 19 && score <= 25) {
        severity = 'Moderate';
        color = 'orange';
      } else if (score >= 26 && score <= 33) {
        severity = 'Severe';
        color = 'maroon';
      } else {
        severity = 'Extremely Severe';
        color = 'red';
      }
    }

    return { severity, color };
  };

  const depression = getSeverityAndColor(depressionScore, 'depression');
  const anxiety = getSeverityAndColor(anxietyScore, 'anxiety');
  const stress = getSeverityAndColor(stressScore, 'stress');

  return {
    depressionScore,
    anxietyScore,
    stressScore,
    depressionSeverity: depression.severity,
    anxietySeverity: anxiety.severity,
    stressSeverity: stress.severity,
    depressionColor: depression.color,
    anxietyColor: anxiety.color,
    stressColor: stress.color,
  };
}

export interface CVDResult {
  colors: string[];
  overallRisk: string;
  overallColor: string;
}

export function calculateCVDRisk(responses: string[]): CVDResult {
  const colors: string[] = [];

  for (let i = 0; i < responses.length; i++) {
    colors.push(getCVDQuestionColor(i + 1, responses[i]));
  }

  let overallColor: string;

  // Q1, Q2, Q3, Q4: All Green = Green, 1 Yellow = Yellow, 2+ Yellow = Red
  const q1234Colors = colors.slice(0, 4);
  const greenCount = q1234Colors.filter(c => c === 'green').length;
  const yellowCount = q1234Colors.filter(c => c === 'yellow').length;
  const redCount = q1234Colors.filter(c => c === 'red').length;

  if (greenCount === 4) {
    overallColor = 'green';
  } else if (yellowCount === 1 && redCount === 0) {
    overallColor = 'yellow';
  } else {
    overallColor = 'red';
  }

  // Q5: No = Green, Yes = Red (overrides previous)
  if (colors[4] === 'red') {
    overallColor = 'red';
  }

  // Q9, Q10: All Green = Green, 1 or both Yellow/Orange/Red = Red
  const q910Colors = [colors[8], colors[9]];
  const hasYellowOrRed = q910Colors.some(c => c === 'yellow' || c === 'orange' || c === 'red');
  if (hasYellowOrRed) {
    overallColor = 'red';
  }

  const overallRisk = overallColor === 'green' ? 'Low Risk' : overallColor === 'yellow' ? 'Moderate Risk' : 'High Risk';

  return { colors, overallRisk, overallColor };
}

function getCVDQuestionColor(questionNumber: number, response: string): string {
  const lowerResponse = response.toLowerCase();
  
  switch (questionNumber) {
    case 1: // Smoking
      if (lowerResponse.includes('never')) return 'green';
      if (lowerResponse.includes('former')) return 'yellow';
      if (lowerResponse.includes('current')) return 'red';
      return 'green';
    case 2: // High blood pressure
      if (lowerResponse === 'no') return 'green';
      if (lowerResponse.includes('controlled')) return 'yellow';
      if (lowerResponse.includes('uncontrolled')) return 'red';
      return 'green';
    case 3: // High cholesterol
      if (lowerResponse === 'no') return 'green';
      if (lowerResponse.includes('controlled')) return 'yellow';
      if (lowerResponse.includes('uncontrolled')) return 'red';
      if (lowerResponse.includes('unknown')) return 'yellow'; // Unknown treated as yellow
      return 'green';
    case 4: // Diabetes
      if (lowerResponse === 'no') return 'green';
      if (lowerResponse.includes('pre-diabetes') || lowerResponse.includes('pre diabetes')) return 'yellow';
      if (lowerResponse.includes('type 2') || lowerResponse.includes('type 1')) return 'red';
      return 'green';
    case 5: // Family history of heart disease
      if (lowerResponse === 'no') return 'green';
      // Any yes answer (one parent, both parents, siblings) = red
      if (lowerResponse.includes('yes')) return 'red';
      return 'green';
    case 6: // Relationship of Parents (not scored, but we'll default to green)
      return 'green';
    case 7: // Exercise days per week
      if (lowerResponse.includes('5+') || lowerResponse.includes('3-4')) return 'green';
      if (lowerResponse.includes('1-2')) return 'yellow';
      if (lowerResponse.includes('0')) return 'red';
      return 'green';
    case 8: // Diet rating
      if (lowerResponse.includes('excellent') || lowerResponse.includes('good')) return 'green';
      if (lowerResponse === 'fair') return 'yellow';
      if (lowerResponse.includes('poor')) return 'red';
      return 'green';
    case 9: // Chest pain or discomfort
      if (lowerResponse === 'never') return 'green';
      if (lowerResponse === 'rarely') return 'yellow';
      if (lowerResponse === 'sometimes') return 'orange';
      if (lowerResponse === 'frequently') return 'red';
      return 'green';
    case 10: // Shortness of breath
      if (lowerResponse === 'never') return 'green';
      if (lowerResponse === 'rarely') return 'yellow';
      if (lowerResponse === 'sometimes') return 'orange';
      if (lowerResponse === 'frequently') return 'red';
      return 'green';
    default:
      return 'green';
  }
}
