// src/pages/BookLibrary.jsx
import React, { useState, useEffect } from 'react';
import { 
  Upload, BookOpen, MessageSquare, FileText, 
  Play, Trash2, Eye, Download, Loader, CheckCircle 
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { PDFProcessor } from '../services/pdfProcessor';
import toast from 'react-hot-toast';

const BookLibrary = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBooks(data);
    } catch (error) {
      console.error('Error loading books:', error);
      toast.error('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 50MB');
      return;
    }

    setUploading(true);
    const toastId = toast.loading('Processing your book... This may take a few minutes.');

    try {
      const processor = new PDFProcessor(file, user.id);
      const bookId = await processor.process();
      
      toast.success('Book processed successfully!', { id: toastId });
      await loadBooks();
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process book', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const deleteBook = async (bookId) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);
      
      if (error) throw error;
      
      setBooks(books.filter(b => b.id !== bookId));
      toast.success('Book deleted');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete book');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'processing': return 'var(--warning)';
      case 'failed': return 'var(--error)';
      default: return 'var(--gray-500)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle size={20} />;
      case 'processing': return <Loader className="spinner" size={20} />;
      case 'failed': return <X size={20} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '60vh' 
        }}>
          <Loader className="spinner" size={48} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="container" style={{ padding: 'var(--space-2xl) 0' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-2xl)'
        }}>
          <div>
            <h1 style={{
              fontSize: 'var(--text-4xl)',
              fontWeight: 'var(--font-bold)',
              marginBottom: 'var(--space-xs)',
              background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              📚 My Book Library
            </h1>
            <p style={{ 
              fontSize: 'var(--text-lg)', 
              color: 'var(--text-secondary)' 
            }}>
              Upload PDFs and let AI create slides, quizzes, and chatbots
            </p>
          </div>

          {/* Upload Button */}
          <label
            htmlFor="pdf-upload"
            style={{
              padding: 'var(--space-lg) var(--space-2xl)',
              background: uploading ? 'var(--gray-400)' : 'var(--primary-500)',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-semibold)',
              boxShadow: 'var(--shadow-md)',
              transition: 'all var(--transition-base)'
            }}
          >
            <Upload size={24} />
            {uploading ? 'Processing...' : 'Upload Book'}
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </div>

        {/* Books Grid */}
        {books.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-3xl)',
            background: 'white',
            borderRadius: 'var(--radius-xl)',
            border: '2px dashed var(--border-medium)'
          }}>
            <BookOpen size={64} style={{ color: 'var(--gray-400)', margin: '0 auto var(--space-lg)' }} />
            <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-md)' }}>
              No books yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
              Upload your first PDF to get started!
            </p>
            <label
              htmlFor="pdf-upload-empty"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                padding: 'var(--space-lg) var(--space-2xl)',
                background: 'var(--primary-500)',
                color: 'white',
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-semibold)'
              }}
            >
              <Upload size={24} />
              Upload Your First Book
            </label>
            <input
              id="pdf-upload-empty"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'var(--space-xl)'
          }}>
            {books.map((book) => (
              <div
                key={book.id}
                style={{
                  background: 'white',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'all var(--transition-base)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
              >
                {/* Book Cover */}
                <div style={{
                  height: '200px',
                  background: `linear-gradient(135deg, ${getStatusColor(book.status)}20, ${getStatusColor(book.status)}40)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <BookOpen size={64} style={{ color: getStatusColor(book.status), opacity: 0.6 }} />
                  
                  {/* Status Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 'var(--space-md)',
                    right: 'var(--space-md)',
                    padding: '0.5rem 1rem',
                    background: 'white',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                    color: getStatusColor(book.status)
                  }}>
                    {getStatusIcon(book.status)}
                    {book.status}
                  </div>
                </div>

                {/* Book Info */}
                <div style={{ padding: 'var(--space-lg)' }}>
                  <h3 style={{
                    fontSize: 'var(--text-lg)',
                    fontWeight: 'var(--font-semibold)',
                    marginBottom: 'var(--space-xs)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {book.title}
                  </h3>
                  
                  {book.author && (
                    <p style={{ 
                      fontSize: 'var(--text-sm)', 
                      color: 'var(--text-secondary)',
                      marginBottom: 'var(--space-sm)'
                    }}>
                      by {book.author}
                    </p>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--space-md)', 
                    marginBottom: 'var(--space-lg)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-tertiary)'
                  }}>
                    {book.total_pages && (
                      <span>{book.total_pages} pages</span>
                    )}
                    <span>•</span>
                    <span>{new Date(book.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Action Buttons */}
                  {book.status === 'completed' && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 'var(--space-sm)'
                    }}>
                      <button
                        onClick={() => window.location.href = `/books/${book.id}/chat`}
                        style={{
                          padding: 'var(--space-md)',
                          background: 'var(--primary-50)',
                          color: 'var(--primary-600)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--space-xs)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-medium)'
                        }}
                      >
                        <MessageSquare size={16} />
                        Chat
                      </button>

                      <button
                        onClick={() => window.location.href = `/books/${book.id}/slides`}
                        style={{
                          padding: 'var(--space-md)',
                          background: 'var(--accent-50)',
                          color: 'var(--accent-600)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--space-xs)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-medium)'
                        }}
                      >
                        <Play size={16} />
                        Slides
                      </button>

                      <button
                        onClick={() => window.location.href = `/books/${book.id}/quiz`}
                        style={{
                          padding: 'var(--space-md)',
                          background: 'var(--success-light)',
                          color: 'var(--success-dark)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--space-xs)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-medium)'
                        }}
                      >
                        <FileText size={16} />
                        Quiz
                      </button>

                      <button
                        onClick={() => deleteBook(book.id)}
                        style={{
                          padding: 'var(--space-md)',
                          background: 'var(--error-light)',
                          color: 'var(--error-dark)',
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 'var(--space-xs)',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 'var(--font-medium)'
                        }}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  )}

                  {book.status === 'processing' && (
                    <div style={{
                      padding: 'var(--space-md)',
                      background: 'var(--warning-light)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      color: 'var(--warning-dark)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <Loader className="spinner" size={16} style={{ display: 'inline', marginRight: 'var(--space-xs)' }} />
                      Processing... Check back in a few minutes
                    </div>
                  )}

                  {book.status === 'failed' && (
                    <div style={{
                      padding: 'var(--space-md)',
                      background: 'var(--error-light)',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'center',
                      color: 'var(--error-dark)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      Processing failed. Please try uploading again.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default BookLibrary;