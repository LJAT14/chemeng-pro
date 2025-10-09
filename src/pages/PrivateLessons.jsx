// src/pages/PrivateLessons.jsx
import React, { useState } from 'react';
import { User, Phone, MessageCircle, Calendar, Clock, CheckCircle, Star, Video, Mail } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const PrivateLessons = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: '',
    goals: '',
    preferredTime: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the data to your backend/email
    console.log('Booking request:', formData);
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        level: '',
        goals: '',
        preferredTime: '',
        message: '',
      });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const levels = [
    'Beginner (A1)',
    'Elementary (A2)',
    'Intermediate (B1)',
    'Upper-Intermediate (B2)',
    'Advanced (C1)',
    'Proficient (C2)',
  ];

  const timeSlots = [
    'Morning (6am - 12pm)',
    'Afternoon (12pm - 6pm)',
    'Evening (6pm - 10pm)',
    'Flexible',
  ];

  const features = [
    {
      icon: Video,
      title: 'One-on-One Sessions',
      description: 'Personalized attention focused on your specific needs and goals',
    },
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Choose times that work best for your schedule',
    },
    {
      icon: Star,
      title: 'Expert Teacher',
      description: 'Learn from Larismar, an experienced English educator',
    },
    {
      icon: CheckCircle,
      title: 'Customized Curriculum',
      description: 'Lessons tailored to your level, interests, and objectives',
    },
  ];

  const openWhatsApp = () => {
    const message = encodeURIComponent('Hi! I\'m interested in booking private English lessons with you.');
    window.open(`https://wa.me/27842677034?text=${message}`, '_blank');
  };

  return (
    <PageWrapper title="Private Lessons" subtitle="One-on-one English tutoring with Larismar">
      <div className="max-w-6xl mx-auto">
        
        {/* Teacher Introduction */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
              L
            </div>
            
            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Larismar Bacaneiro</h2>
              <p className="text-xl text-purple-400 mb-4">Founder & English Teacher</p>
              <p className="text-gray-300 leading-relaxed mb-6">
                With years of experience teaching English to students worldwide, I offer personalized 
                one-on-one lessons designed to help you achieve your language goals faster. Whether you're 
                preparing for exams, improving business English, or enhancing conversational skills, 
                I'll create a custom learning plan just for you.
              </p>
              
              {/* Quick Contact Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  onClick={openWhatsApp}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp: +27 84 267 7034
                </button>
                <a
                  href="mailto:larismar@bacanaenglish.com"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                >
                  <Mail className="w-5 h-5" />
                  Email Me
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-8 border border-blue-500/30 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Lesson Packages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Single Lesson</h3>
              <p className="text-4xl font-bold text-purple-400 mb-4">$30</p>
              <p className="text-gray-400 text-sm mb-4">60 minutes</p>
              <ul className="text-sm text-gray-300 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  One-on-one attention
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Customized content
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Video call session
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-500 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-white text-xs font-bold">
                POPULAR
              </div>
              <h3 className="text-lg font-bold text-white mb-2">5 Lesson Pack</h3>
              <p className="text-4xl font-bold text-purple-400 mb-4">$130</p>
              <p className="text-gray-400 text-sm mb-4">$26/lesson • Save $20</p>
              <ul className="text-sm text-gray-300 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Everything in Single Lesson
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Priority scheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Homework & materials
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
              <h3 className="text-lg font-bold text-white mb-2">10 Lesson Pack</h3>
              <p className="text-4xl font-bold text-purple-400 mb-4">$240</p>
              <p className="text-gray-400 text-sm mb-4">$24/lesson • Save $60</p>
              <ul className="text-sm text-gray-300 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Everything in 5 Lesson Pack
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Flexible rescheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Certificate upon completion
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Email support 24/7
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Book Your First Lesson</h2>
          
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Request Sent! 🎉</h3>
              <p className="text-gray-300 mb-4">
                Thank you for your interest! I'll contact you within 24 hours via WhatsApp or email 
                to schedule your first lesson.
              </p>
              <button
                onClick={openWhatsApp}
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Message me on WhatsApp now
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Current Level *</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select your level</option>
                    {levels.map(level => (
                      <option key={level} value={level} className="bg-slate-800">{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Preferred Time</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select preferred time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot} className="bg-slate-800">{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Learning Goals *</label>
                  <input
                    type="text"
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Business English, IELTS prep"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2 font-medium">Additional Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell me more about your goals, availability, or any questions you have..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all text-lg"
              >
                <Calendar className="w-6 h-6" />
                Request Your First Lesson
              </button>

              <p className="text-center text-sm text-gray-400">
                Or contact me directly via WhatsApp: <a href="https://wa.me/27842677034" className="text-purple-400 hover:text-purple-300">+27 84 267 7034</a>
              </p>
            </form>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default PrivateLessons;