// src/pages/BookSlides.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ChevronLeft, ChevronRight, BookOpen, Loader } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import toast from 'react-hot-toast';

export default function BookSlides() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookAndSlides();
  }, [bookId]);

  const loadBookAndSlides = async () => {
    try {
      // Load book info
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .select('*')
        .eq('id', bookId)
        .single();

      if (bookError) throw bookError;
      setBook(bookData);

      // Load slides
      const { data: slidesData, error: slidesError } = await supabase
        .from('book_slides')
        .select('*')
        .eq('book_id', bookId)
        .order('chapter_number', { ascending: true })
        .order('slide_number', { ascending: true });

      if (slidesError) throw slidesError;
      setSlides(slidesData || []);

      if (!slidesData || slidesData.length === 0) {
        toast.error('No slides found for this book');
      }
    } catch (error) {
      console.error('Error loading slides:', error);
      toast.error('Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
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

  if (!slides.length) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Slides Available</h2>
          <p className="text-slate-400 mb-6">
            Slides haven't been generated for this book yet.
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

  const slide = slides[currentSlide];

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{book?.title}</h1>
            <p className="text-slate-400">
              Chapter {slide?.chapter_number} - Slide {currentSlide + 1} of {slides.length}
            </p>
          </div>
          <button
            onClick={() => navigate('/library')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20"
          >
            Back to Library
          </button>
        </div>

        {/* Slide Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 mb-6 min-h-[500px]">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            {slide?.title}
          </h2>
          <div className="text-xl text-slate-300 leading-relaxed whitespace-pre-wrap">
            {slide?.content}
          </div>
          {slide?.image_url && (
            <div className="mt-8">
              <img 
                src={slide.image_url} 
                alt={slide.title}
                className="rounded-lg max-w-full mx-auto"
              />
            </div>
          )}
        </div>

        {/* Speaker Notes (if any) */}
        {slide?.notes && (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">📝 Notes</h3>
            <p className="text-slate-400">{slide.notes}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
              currentSlide === 0
                ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-purple-500 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
              currentSlide === slides.length - 1
                ? 'bg-white/5 text-slate-600 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </PageWrapper>
  );
}