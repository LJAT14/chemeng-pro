// src/components/ErrorBoundary.jsx
import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              Don't worry - this happens sometimes. Your progress is saved.
            </p>

            {this.state.error && (
              <details className="text-left mb-6">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                  Error details
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-black/20 p-3 rounded overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;