// src/pages/BookQuiz.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Trophy, Loader, BookOpen } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import toast from 'react-hot-toast';

export default function BookQuiz() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookAndQuizzes();
  }, [bookId]);

  const loadBookAndQuizzes = async () => {
    try {
      // Load book info
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      if (bookError) throw bookError;
      setBook(bookData);

      // Load quizzes
      const { data: quizzesData, error: quizzesError } = await supabase
        .from('book_quizzes')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_number', { ascending: true });

      if (quizzesError) throw quizzesError;
      setQuizzes(quizzesData || []);

      if (!quizzesData || quizzesData.length === 0) {
        toast.error('No quizzes found for this book');
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);

    const quiz = quizzes[currentQuestion];
    const isCorrect = answer === quiz.correct_answer;

    if (isCorrect) {
      setScore(score + 1);
      toast.success('Correct! ✅');
    } else {
      toast.error(`Incorrect. The answer was: ${quiz.correct_answer}`);
    }

    // Save attempt to database
    saveQuizAttempt(quiz.id, answer, isCorrect);
  };

  const saveQuizAttempt = async (quizId, userAnswer, isCorrect) => {
    try {
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          book_id: bookId,
          quiz_id: quizId,
          user_answer: userAnswer,
          is_correct: isCorrect,
          attempted_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setCompleted(false);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      </PageWrapper>
    );
  }

  if (!quizzes.length) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Quizzes Available</h2>
          <p className="text-slate-400 mb-6">
            Quizzes haven't been generated for this book yet.
          </p>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
          >
            Back to Library
          </button>
        </div>
      </PageWrapper>
    );
  }

  if (completed) {
    const percentage = Math.round((score / quizzes.length) * 100);
    
    return (
      <PageWrapper>
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
            
            <div className="text-6xl font-bold text-purple-400 mb-2">
              {percentage}%
            </div>
            
            <p className="text-xl text-slate-300 mb-8">
              You got {score} out of {quizzes.length} questions correct
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate('/library')}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 font-semibold"
              >
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const quiz = quizzes[currentQuestion];
  const options = quiz.options ? JSON.parse(quiz.options) : [];

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">{book?.title}</h1>
            <button
              onClick={() => navigate('/library')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20"
            >
              Exit Quiz
            </button>
          </div>
          
          <div className="flex items-center justify-between text-slate-400">
            <span>Chapter {quiz.chapter_number}</span>
            <span>Question {currentQuestion + 1} of {quizzes.length}</span>
            <span>Score: {score}/{quizzes.length}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2 mt-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quizzes.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-8">
            {quiz.question}
          </h2>

          {/* Answer Options */}
          <div className="space-y-4">
            {options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === quiz.correct_answer;
              const showCorrect = isAnswered && isCorrect;
              const showWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${
                    showCorrect
                      ? 'bg-green-500/20 border-green-500 text-green-300'
                      : showWrong
                      ? 'bg-red-500/20 border-red-500 text-red-300'
                      : isSelected
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                  } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showCorrect && <CheckCircle className="w-6 h-6" />}
                    {showWrong && <XCircle className="w-6 h-6" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation (shown after answering) */}
        {isAnswered && quiz.explanation && (
          <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30 mb-6">
            <h3 className="text-lg font-semibold text-blue-300 mb-2">💡 Explanation</h3>
            <p className="text-slate-300">{quiz.explanation}</p>
          </div>
        )}

        {/* Next Button */}
        {isAnswered && (
          <button
            onClick={nextQuestion}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg"
          >
            {currentQuestion < quizzes.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </PageWrapper>
  );
}