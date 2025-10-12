/// src/pages/LandingPage.jsx - Updated with Teacher Contact
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import {
  Mic,
  BookOpen,
  Headphones,
  PenTool,
  Trophy,
  Sparkles,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  Users,
  GraduationCap
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Mic,
      title: 'Interview Simulator',
      description: 'Practice technical interviews with AI-powered feedback',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Headphones,
      title: 'Pronunciation Lab',
      description: 'Perfect your English pronunciation with audio feedback',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: BookOpen,
      title: 'Bilingual Library',
      description: 'Learn with English-Portuguese side-by-side lessons',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: PenTool,
      title: 'Writing Practice',
      description: 'Improve your writing with instant AI corrections',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: Trophy,
      title: 'Track Progress',
      description: 'Monitor your improvement with detailed analytics',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: MessageCircle,
      title: 'Private Lessons',
      description: 'One-on-one tutoring with experienced teacher',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const benefits = [
    'Learn at your own pace',
    'AI-powered feedback',
    'Bilingual content (EN-PT)',
    'Track your progress',
    'Interview preparation',
    'Native pronunciation guides',
  ];

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Hello! I am interested in learning English. Can you tell me more about your classes?');
    window.open(`https://wa.me/27842677035?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <img src="/assets/logo.svg" alt="Bacana English" className="w-10 h-10" />
              <span className="text-2xl font-bold text-white">
                Bacana English
              </span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Master English for
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Interviews & Life</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Practice interviews, improve pronunciation, and enhance your technical English skills with AI-powered tools
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Sparkles className="w-6 h-6" />
              Start Learning Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handleWhatsAppContact}
              className="group bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Contact Teacher
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-slate-400">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span>Experienced Teacher</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              <span>Learn Anywhere</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <span>Bilingual Lessons</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Everything You Need to Learn English
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              AI-powered tools and bilingual content designed for Portuguese speakers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher Section - NEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Teacher Info */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-6">
                  <Award className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-semibold">Experienced Teacher</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Learn with Larismar
                </h2>
                
                <p className="text-xl text-slate-300 mb-6">
                  Experienced online English teacher specializing in helping Portuguese speakers master English for interviews, business, and daily life.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-200">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>3+ years teaching English online</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>Specialist in technical & business English</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>Bilingual lessons (English-Portuguese)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-200">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                    <span>Interview preparation expert</span>
                  </div>
                </div>

                {/* Contact Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleWhatsAppContact}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all text-lg"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Contact on WhatsApp
                  </button>
                  
                  <button
                    onClick={() => window.open('mailto:larismar@bacanaenglish.com')}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border-2 border-white/20 text-white rounded-xl font-semibold transition-all"
                  >
                    <Mail className="w-6 h-6" />
                    Email Me
                  </button>
                </div>
              </div>

              {/* Teacher Image/Avatar */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="w-80 h-80 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-9xl font-bold shadow-2xl">
                    L
                  </div>
                  {/* Floating badges */}
                  <div className="absolute -top-4 -right-4 bg-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certified
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-green-600 text-white px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Expert
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Bacana English?
            </h2>
            <p className="text-xl text-slate-300">
              The perfect platform for Portuguese speakers learning English
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
              >
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span className="text-lg text-white font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your English Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join hundreds of students improving their English every day
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg"
            >
              <Sparkles className="w-6 h-6" />
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleWhatsAppContact}
              className="group bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg"
            >
              <MessageCircle className="w-6 h-6" />
              Book a Private Lesson
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/assets/logo.svg" alt="Bacana English" className="w-8 h-8" />
            <span className="text-xl font-bold text-white">Bacana English</span>
          </div>
          <p className="text-slate-400 mb-4">
            Empowering Portuguese speakers to master English
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-400">
            <button onClick={handleWhatsAppContact} className="hover:text-white transition-colors">
              WhatsApp
            </button>
            <button onClick={() => window.open('mailto:larismar@bacanaenglish.com')} className="hover:text-white transition-colors">
              Email
            </button>
            <button onClick={() => navigate('/private-lessons')} className="hover:text-white transition-colors">
              Private Lessons
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            © 2025 Bacana English. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}