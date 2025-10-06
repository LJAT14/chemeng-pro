// src/pages/PDFViewer.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ZoomIn, ZoomOut, BookOpen } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useToast } from '../components/Toast';

// Your books data - ADD MORE AS YOU UPLOAD
const booksData = {
  'intermediate-english': {
    id: 'intermediate-english',
    title: 'Intermediate English',
    level: 'B1',
    description: 'Complete intermediate level English course with comprehensive lessons',
    fileUrl: 'https://jbpebcjwkgnqmmphhngx.supabase.co/storage/v1/object/public/books/Intermediate%20English.pptx.pdf',
    pages: 100,
  },
  // ADD YOUR NEW BOOKS HERE:
  // Example:
  // 'basic-english': {
  //   id: 'basic-english',
  //   title: 'Basic English for Beginners',
  //   level: 'A1',
  //   description: 'Start your English journey from zero',
  //   fileUrl: 'https://jbpebcjwkgnqmmphhngx.supabase.co/storage/v1/object/public/books/YOUR_FILE.pdf',
  //   pages: 80,
  // },
};

const PDFViewer = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [zoom, setZoom] = useState(100);

  const book = booksData[bookId];

  if (!book) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-xl text-white mb-4">Book not found</p>
          <button
            onClick={() => navigate('/library')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Library
          </button>
        </div>
      </PageWrapper>
    );
  }

  const handleDownload = () => {
    window.open(book.fileUrl, '_blank');
    toast.success('Opening PDF in new tab');
  };

  const handleZoomIn = () => {
    if (zoom < 200) setZoom(zoom + 25);
  };

  const handleZoomOut = () => {
    if (zoom > 50) setZoom(zoom - 25);
  };

  return (
    <PageWrapper>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <button
            onClick={() => navigate('/library')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Library
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
            >
              <ZoomOut className="w-5 h-5 text-white" />
            </button>
            <span className="text-white font-semibold">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
            >
              <ZoomIn className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>

        {/* Book Info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg font-bold">
              {book.level}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{book.title}</h1>
          </div>
          <p className="text-gray-300 mt-2">{book.description}</p>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="bg-white rounded-lg overflow-hidden" style={{ height: '80vh' }}>
            <iframe
              src={`${book.fileUrl}#view=FitH`}
              className="w-full h-full"
              title={book.title}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-semibold">Tip:</span> Use the zoom controls to adjust the size. 
            Click Download to save the PDF to your device for offline reading.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default PDFViewer;