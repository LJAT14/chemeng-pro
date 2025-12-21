import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, BookOpen, Loader, Trash2, MessageSquare, FileText, Brain, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function BookLibrary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Check if user is guest
  const isGuest = localStorage.getItem('guestMode') === 'true';

  // Load user's books
  useEffect(() => {
    // Only load if user is logged in (not guest)
    if (user && !isGuest) {
      loadBooks();
    } else {
      setLoading(false);
    }
  }, [user, isGuest]);

  const loadBooks = async () => {
    try {
      setLoading(true);
      
      // Double check user exists
      if (!user || !user.id) {
        console.error('No user ID available');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error loading books:', error);
      showToast('Failed to load books', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    // Check if user is logged in
    if (!user || !user.id) {
      showToast('Please login to upload books', 'error');
      return;
    }

    if (isGuest) {
      showToast('Please create an account to upload books', 'info');
      navigate('/login');
      return;
    }

    if (file.type !== 'application/pdf') {
      showToast('Please upload a PDF file', 'error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      showToast('File too large. Maximum 50MB', 'error');
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('books')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('books')
        .getPublicUrl(fileName);

      // Save to database
      const { data: bookData, error: bookError } = await supabase
        .from('books')
        .insert([{
          user_id: user.id,
          title: file.name.replace('.pdf', ''),
          file_url: publicUrl,
          status: 'processing',
          total_pages: 0
        }])
        .select()
        .single();

      if (bookError) throw bookError;

      showToast('Book uploaded! Processing...', 'success');
      setShowUploadModal(false);
      loadBooks();

      // TODO: Trigger backend processing here
      // Call your API to process PDF, generate embeddings, slides, quizzes

    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!confirm('Delete this book? This will also delete all slides, quizzes, and chats.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) throw error;

      showToast('Book deleted', 'success');
      loadBooks();
    } catch (error) {
      console.error('Delete error:', error);
      showToast('Failed to delete book', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">✅ Ready</span>;
      case 'processing':
        return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">⏳ Processing</span>;
      case 'failed':
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">❌ Failed</span>;
      default:
        return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30">{status}</span>;
    }
  };

  // If user is guest, show login prompt
  if (isGuest) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
        <LogIn className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Create Account to Upload Books</h3>
        <p className="text-slate-300 mb-6">
          Upload PDFs and get AI-generated slides, quizzes, and chat!
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold inline-flex items-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Create Free Account
        </button>
      </div>
    );
  }

  // If no user at all, show login prompt
  if (!user) {
    return (
      <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
        <LogIn className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Please Login</h3>
        <p className="text-slate-400 mb-6">Login to upload and manage your books</p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold inline-flex items-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Login
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <Loader className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading your books...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Upload Button */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">My Uploaded Books</h2>
          <p className="text-slate-400">Upload PDFs to generate slides, quizzes, and AI chat</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload PDF
        </button>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
          <Upload className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No books yet</h3>
          <p className="text-slate-400 mb-6">Upload your first PDF to get started!</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold inline-flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Upload Your First Book
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                {getStatusBadge(book.status)}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                {book.title}
              </h3>

              <div className="text-sm text-slate-400 mb-4">
                {book.total_pages > 0 && <p>{book.total_pages} pages</p>}
                <p>{new Date(book.created_at).toLocaleDateString()}</p>
              </div>

              {/* Action Buttons */}
              {book.status === 'ready' ? (
                <div className="space-y-2">
                  <button
                    onClick={() => navigate(`/books/${book.id}/slides`)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    View Slides
                  </button>
                  <button
                    onClick={() => navigate(`/books/${book.id}/quiz`)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Brain className="w-4 h-4" />
                    Take Quiz
                  </button>
                  <button
                    onClick={() => navigate(`/books/${book.id}/chat`)}
                    className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat with AI
                  </button>
                </div>
              ) : book.status === 'processing' ? (
                <div className="text-center py-4">
                  <Loader className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">Processing PDF...</p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-400 text-sm">Processing failed</p>
                </div>
              )}

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(book.id)}
                className="w-full mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 border border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl p-8 max-w-md w-full border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Upload PDF Book</h2>
            <p className="text-slate-400 mb-6">
              Upload a PDF and we'll generate slides, quizzes, and enable AI chat!
            </p>

            <label className="block">
              <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-purple-500 transition-all cursor-pointer">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">Click to upload PDF</p>
                <p className="text-slate-400 text-sm">Max 50MB</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleUpload(e.target.files[0])}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </label>

            {uploading && (
              <div className="mt-4 text-center">
                <Loader className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                <p className="text-slate-400">Uploading...</p>
              </div>
            )}

            <button
              onClick={() => setShowUploadModal(false)}
              disabled={uploading}
              className="mt-6 w-full px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}