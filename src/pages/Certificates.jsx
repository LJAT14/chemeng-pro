// src/pages/Certificates.jsx
import React, { useState, useEffect } from 'react';
import { Award, Download, Share2, Calendar, CheckCircle, Lock } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const Certificates = () => {
  const { user, profile } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCert, setSelectedCert] = useState(null);

  const certificateTypes = [
    {
      id: 'beginner_complete',
      title: 'Beginner Level Complete',
      description: 'Successfully completed all A1 lessons',
      requirement: 'Complete 10 A1 lessons',
      points: 500,
      icon: '🎓',
      requiredLessons: 10,
      level: 'A1',
    },
    {
      id: 'intermediate_complete',
      title: 'Intermediate Level Complete',
      description: 'Successfully completed all B1 lessons',
      requirement: 'Complete 15 B1 lessons',
      points: 1000,
      icon: '📚',
      requiredLessons: 15,
      level: 'B1',
    },
    {
      id: 'advanced_complete',
      title: 'Advanced Level Complete',
      description: 'Successfully completed all C1 lessons',
      requirement: 'Complete 20 C1 lessons',
      points: 1500,
      icon: '🏆',
      requiredLessons: 20,
      level: 'C1',
    },
    {
      id: 'vocabulary_master',
      title: 'Vocabulary Master',
      description: 'Mastered 200 vocabulary words',
      requirement: 'Learn 200 words',
      points: 750,
      icon: '📖',
      requiredWords: 200,
    },
    {
      id: 'pronunciation_pro',
      title: 'Pronunciation Pro',
      description: 'Achieved 90%+ on 50 pronunciations',
      requirement: '50 perfect pronunciations',
      points: 600,
      icon: '🎤',
      requiredPronunciations: 50,
    },
    {
      id: 'writing_expert',
      title: 'Writing Expert',
      description: 'Submitted 20 essays with 80%+ average',
      requirement: '20 essays with 80%+ score',
      points: 800,
      icon: '✍️',
      requiredEssays: 20,
    },
    {
      id: 'consistent_learner',
      title: 'Consistent Learner',
      description: 'Maintained a 30-day learning streak',
      requirement: '30-day streak',
      points: 500,
      icon: '🔥',
      requiredStreak: 30,
    },
    {
      id: 'polyglot_path',
      title: 'Polyglot Path',
      description: 'Completed all levels (A1 to C2)',
      requirement: 'Complete all 60 lessons',
      points: 3000,
      icon: '🌟',
      requiredLessons: 60,
    },
  ];

  useEffect(() => {
    if (user) {
      fetchCertificates();
    }
  }, [user]);

  const fetchCertificates = async () => {
    try {
      // Fetch user stats
      const { data: gamificationData } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setStats(gamificationData);

      // Check which certificates are earned
      const earned = certificateTypes.map(cert => {
        const isEarned = checkCertificateEarned(cert, gamificationData);
        return {
          ...cert,
          earned: isEarned,
          earnedDate: isEarned ? new Date().toISOString() : null,
        };
      });

      setCertificates(earned);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const checkCertificateEarned = (cert, stats) => {
    if (!stats) return false;

    switch (cert.id) {
      case 'beginner_complete':
      case 'intermediate_complete':
      case 'advanced_complete':
      case 'polyglot_path':
        return stats.lessons_completed >= (cert.requiredLessons || 0);
      
      case 'vocabulary_master':
        return stats.vocabulary_learned >= (cert.requiredWords || 0);
      
      case 'pronunciation_pro':
        return stats.perfect_pronunciations >= (cert.requiredPronunciations || 0);
      
      case 'writing_expert':
        return stats.essays_submitted >= (cert.requiredEssays || 0);
      
      case 'consistent_learner':
        return stats.longest_streak >= (cert.requiredStreak || 0);
      
      default:
        return false;
    }
  };

  const getProgress = (cert) => {
    if (!stats) return 0;

    let current = 0;
    let required = 1;

    switch (cert.id) {
      case 'beginner_complete':
      case 'intermediate_complete':
      case 'advanced_complete':
      case 'polyglot_path':
        current = stats.lessons_completed;
        required = cert.requiredLessons;
        break;
      
      case 'vocabulary_master':
        current = stats.vocabulary_learned;
        required = cert.requiredWords;
        break;
      
      case 'pronunciation_pro':
        current = stats.perfect_pronunciations;
        required = cert.requiredPronunciations;
        break;
      
      case 'writing_expert':
        current = stats.essays_submitted;
        required = cert.requiredEssays;
        break;
      
      case 'consistent_learner':
        current = stats.longest_streak;
        required = cert.requiredStreak;
        break;
    }

    return Math.min((current / required) * 100, 100);
  };

  const generateCertificate = (cert) => {
    setSelectedCert(cert);
  };

  const downloadCertificate = () => {
    // In a real app, this would generate a PDF
    alert('Certificate download feature coming soon! For now, you can screenshot this certificate.');
  };

  const shareCertificate = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedCert.title} - Bacana English`,
        text: `I earned the ${selectedCert.title} certificate on Bacana English!`,
        url: window.location.href,
      });
    } else {
      alert('Certificate sharing feature: Copy this URL to share your achievement!');
    }
  };

  const earnedCount = certificates.filter(c => c.earned).length;

  return (
    <PageWrapper title="Certificates" subtitle="Celebrate your achievements">
      <div className="max-w-7xl mx-auto">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 text-center">
            <Award className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-1">{earnedCount}</p>
            <p className="text-gray-300">Certificates Earned</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30 text-center">
            <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-1">{certificates.length - earnedCount}</p>
            <p className="text-gray-300">In Progress</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30 text-center">
            <Calendar className="w-12 h-12 text-orange-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-1">{certificates.length}</p>
            <p className="text-gray-300">Total Available</p>
          </div>
        </div>

        {/* Certificate Modal */}
        {selectedCert && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-12 max-w-4xl w-full relative border-4 border-yellow-400 shadow-2xl">
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
              >
                ✕
              </button>

              {/* Certificate Content */}
              <div className="text-center mb-8">
                <div className="text-8xl mb-6">{selectedCert.icon}</div>
                <h2 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                  Certificate of Achievement
                </h2>
                <p className="text-xl text-gray-300 mb-8">This is to certify that</p>
                
                <p className="text-4xl font-bold text-yellow-400 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
                  {profile?.full_name || 'Student Name'}
                </p>

                <p className="text-xl text-gray-300 mb-4">has successfully completed</p>
                
                <p className="text-3xl font-bold text-white mb-6">
                  {selectedCert.title}
                </p>

                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                  {selectedCert.description}
                </p>

                <div className="flex items-center justify-center gap-12 mb-8">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Date Earned</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedCert.earnedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Certificate ID</p>
                    <p className="text-white font-mono text-sm">
                      BE-{user.id.slice(0, 8).toUpperCase()}-{selectedCert.id.slice(0, 4).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-6">
                  <p className="text-gray-300 text-sm mb-2">Authorized by</p>
                  <p className="text-2xl font-bold text-white" style={{ fontFamily: 'cursive' }}>
                    Larismar Bacaneiro
                  </p>
                  <p className="text-gray-400 text-sm">Founder, Bacana English</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={downloadCertificate}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={shareCertificate}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Certificates</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => {
              const progress = getProgress(cert);
              
              return (
                <div
                  key={cert.id}
                  className={`relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border transition-all ${
                    cert.earned
                      ? 'border-yellow-500/50 hover:border-yellow-500 cursor-pointer hover:scale-105'
                      : 'border-white/20'
                  }`}
                  onClick={() => cert.earned && generateCertificate(cert)}
                >
                  {/* Lock/Badge Indicator */}
                  <div className="absolute top-4 right-4">
                    {cert.earned ? (
                      <div className="w-12 h-12 bg-yellow-500/30 rounded-full flex items-center justify-center border-2 border-yellow-500">
                        <CheckCircle className="w-6 h-6 text-yellow-400" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-500/30 rounded-full flex items-center justify-center border-2 border-gray-500">
                        <Lock className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Icon */}
                  <div className={`text-6xl mb-4 ${cert.earned ? '' : 'opacity-30'}`}>
                    {cert.icon}
                  </div>

                  {/* Content */}
                  <h3 className={`text-xl font-bold mb-2 ${cert.earned ? 'text-white' : 'text-gray-400'}`}>
                    {cert.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{cert.description}</p>

                  {/* Progress Bar */}
                  {!cert.earned && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{Math.floor(progress)}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{cert.requirement}</p>
                    </div>
                  )}

                  {/* Points Badge */}
                  <div className={`flex items-center justify-between ${cert.earned ? 'mt-4' : ''}`}>
                    <div className="flex items-center gap-2">
                      <Award className={`w-5 h-5 ${cert.earned ? 'text-yellow-400' : 'text-gray-500'}`} />
                      <span className={`font-semibold ${cert.earned ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {cert.points} pts
                      </span>
                    </div>
                    {cert.earned && (
                      <span className="text-green-400 text-sm font-semibold">View Certificate →</span>
                    )}
                  </div>

                  {cert.earned && cert.earnedDate && (
                    <p className="text-xs text-gray-500 mt-3">
                      Earned {new Date(cert.earnedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational Section */}
        {earnedCount === 0 && (
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30 mt-8 text-center">
            <Award className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Start Your Journey!</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Complete lessons, practice regularly, and earn certificates to showcase your English proficiency. 
              Each certificate represents your dedication and achievement!
            </p>
          </div>
        )}

        {earnedCount > 0 && earnedCount < certificates.length && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-2xl p-8 border border-green-500/30 mt-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-3">Great Progress! 🎉</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              You've earned {earnedCount} certificate{earnedCount > 1 ? 's' : ''}! 
              Keep learning to unlock {certificates.length - earnedCount} more.
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Certificates;