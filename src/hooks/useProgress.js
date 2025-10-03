import useLocalStorage from './useLocalStorage';

const useProgress = () => {
  const [progress, setProgress] = useLocalStorage('userProgress', {
    grammar: { completed: 0, total: 50 },
    vocabulary: { completed: 0, total: 300 },
    pronunciation: { score: 0 },
    interviews: { completed: 0 },
    totalPoints: 0
  });

  const updateProgress = (category, updates) => {
    setProgress(prev => ({
      ...prev,
      [category]: { ...prev[category], ...updates }
    }));
  };

  const addPoints = (points) => {
    setProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + points
    }));
  };

  return { progress, updateProgress, addPoints };
};

export default useProgress;