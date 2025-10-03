export const calculatePronunciationScore = (spokenWord, targetWord) => {
  const spoken = spokenWord.toLowerCase().trim();
  const target = targetWord.toLowerCase().trim();

  if (spoken === target) return 100;

  const distance = levenshteinDistance(spoken, target);
  const maxLength = Math.max(spoken.length, target.length);
  const similarity = (1 - distance / maxLength) * 100;

  return Math.max(0, Math.round(similarity));
};

const levenshteinDistance = (str1, str2) => {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

export const provideFeedback = (score) => {
  if (score >= 90) return { message: 'Perfect pronunciation!', color: 'green' };
  if (score >= 75) return { message: 'Great job!', color: 'blue' };
  if (score >= 60) return { message: 'Good attempt. Keep practicing!', color: 'yellow' };
  return { message: 'Needs improvement. Try again!', color: 'red' };
};