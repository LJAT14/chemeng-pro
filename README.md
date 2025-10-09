# 🎓 Bacana English

An interactive English learning platform built with React, Vite, and Supabase. Practice pronunciation, vocabulary, writing, grammar, and more!

## 🌟 Live Demo

**Website:** [https://sciencetime.vercel.app](https://sciencetime.vercel.app)

## ✨ Features

- 🎤 **Pronunciation Lab** - Practice and perfect your English pronunciation with real-time feedback
- 📚 **Vocabulary Builder** - Learn new words organized by categories (Food, Travel, Business, etc.)
- ✍️ **Writing Practice** - Improve your writing skills with guided exercises and AI feedback
- 📖 **Reading Comprehension** - Enhance reading skills with interactive articles
- 🎯 **Grammar Hub** - Master English grammar with comprehensive lessons
- 💼 **Interview Practice** - Prepare for English interviews with common questions
- 📕 **Library** - Access PDF books and audio lessons organized by CEFR levels (A1-C2)
- 🏆 **Gamification** - Earn points, badges, and level up as you learn
- 🔥 **Daily Streaks** - Track your learning consistency and build habits
- 📊 **Progress Tracking** - Monitor your improvement with detailed statistics

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Authentication, Database, Storage)
- **Deployment:** Vercel
- **Icons:** Lucide React
- **Speech:** ElevenLabs TTS & Groq Whisper (with browser fallbacks)

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account
- (Optional) ElevenLabs API key for better voice quality
- (Optional) Groq API key for better speech recognition

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/LJAT14/chemeng-pro.git
cd chemeng-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional - for enhanced features
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
VITE_GROQ_API_KEY=your_groq_key
```

Get your Supabase credentials:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and anon/public key

### 4. Database Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Gamification table
CREATE TABLE IF NOT EXISTS user_gamification (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_points INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  vocabulary_learned INTEGER DEFAULT 0,
  perfect_pronunciations INTEGER DEFAULT 0,
  essays_submitted INTEGER DEFAULT 0,
  perfect_essays INTEGER DEFAULT 0,
  books_completed INTEGER DEFAULT 0,
  perfect_quizzes INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile"
ON user_profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own gamification"
ON user_gamification FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification"
ON user_gamification FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification"
ON user_gamification FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to see the app!

### 6. Build for Production

```bash
npm run build
npm run preview  # Test production build locally
```

## 📁 Project Structure

```
chemeng-pro/
├── public/
│   └── assets/
│       └── logo.svg              # App logo
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── PageWrapper.jsx       # Layout wrapper
│   │   ├── ProtectedRoute.jsx    # Auth guard
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── data/
│   │   └── vocabularyData.js     # Vocabulary words & categories
│   ├── lib/
│   │   └── supabaseClient.js     # Supabase configuration
│   ├── pages/
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Login.jsx             # Login/Signup page
│   │   ├── LandingPage.jsx       # Landing page
│   │   ├── Library.jsx           # Books & lessons
│   │   ├── PronunciationLab.jsx  # Pronunciation practice
│   │   ├── VocabularyBuilder.jsx # Vocabulary learning
│   │   ├── WritingPractice.jsx   # Writing exercises
│   │   ├── GrammarHub.jsx        # Grammar lessons
│   │   └── ...
│   ├── services/
│   │   ├── elevenLabsTTS.js      # Text-to-speech service
│   │   └── groqWhisper.js        # Speech recognition
│   ├── utils/
│   │   └── gamificationSystem.js # Points, badges, levels
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── .env.local                    # Environment variables (not committed)
├── vercel.json                   # Vercel configuration
├── package.json
└── README.md
```

## 🎮 Features in Detail

### Pronunciation Lab
- Practice word pronunciation with audio playback
- Record your voice and compare with native speakers
- Real-time feedback on pronunciation accuracy
- Progress tracking for improvement

### Vocabulary Builder
- 65+ words organized into 8 categories
- Three learning modes: Browse, Flashcards, Quiz
- Audio pronunciation for each word
- Save favorite words for quick review

### Library
- PDF books organized by CEFR levels (A1-C2)
- Interactive audio lessons with transcripts
- Vocabulary and comprehension quizzes
- Progress tracking for each lesson

### Gamification System
- Earn points for completing activities
- Unlock 15+ badges for achievements
- Level up from Beginner to Native-Like (10 levels)
- Maintain daily/weekly/monthly streaks
- Compete on global leaderboard

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LJAT14/chemeng-pro)

**Or manually:**

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy!

### Important: vercel.json

Make sure you have `vercel.json` in your root directory for proper routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 📝 Adding Content

### Add PDF Books

1. Upload PDFs to Supabase Storage:
   - Go to Supabase Dashboard → Storage
   - Create/use `books` bucket (make it public)
   - Upload your PDF files

2. Add book data to `src/pages/PDFViewer.jsx`:
```javascript
const booksData = {
  'your-book-id': {
    id: 'your-book-id',
    title: 'Your Book Title',
    level: 'B1',
    fileUrl: 'https://your-supabase-url/storage/v1/object/public/books/your-file.pdf',
  },
};
```

3. Add to library list in `src/pages/Library.jsx`

### Add Vocabulary Words

Edit `src/data/vocabularyData.js` to add new words:

```javascript
{
  id: 66,
  term: 'Example',
  definition: 'A thing used to illustrate',
  example: 'This is an example sentence',
  category: 'education',
  difficulty: 'intermediate'
}
```

## 🐛 Troubleshooting

### Build Fails

1. Check all files exist (see project structure)
2. Verify import paths are correct
3. Run `npm install` to ensure all dependencies installed
4. Check for syntax errors in your code

### Blank Page After Deploy

1. Check browser console (F12) for errors
2. Verify environment variables are set in Vercel
3. Check Supabase policies allow your queries
4. Ensure `vercel.json` exists in root

### Authentication Issues

1. Verify Supabase credentials in environment variables
2. Check database tables and policies are created
3. Test login locally first
4. Check browser console for specific error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**LJAT14**
- GitHub: [@LJAT14](https://github.com/LJAT14)
- Live Demo: [Bacana English](https://sciencetime.vercel.app)

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Fast build tool
- [React](https://react.dev/) - UI framework
- [Supabase](https://supabase.com/) - Backend platform
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons
- [Vercel](https://vercel.com/) - Deployment platform

---

**Start learning English today with Bacana English!** 🎓✨