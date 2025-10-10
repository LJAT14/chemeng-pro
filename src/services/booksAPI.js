// src/services/booksAPI.js

// Curated list of free English learning PDFs
export const CURATED_BOOKS = [
  {
    id: 'basic-english-1',
    title: 'Basic English Course - Lesson 1',
    description: 'Complete bilingual course (EN-PT) with grammar, reading, and listening',
    difficulty: 'Beginner',
    fileUrl: '/book/basic-english-1', // This links to our bilingual viewer
    source: 'Bacana English',
    pages: 5,
    category: 'Grammar',
    isBilingual: true, // Flag for our custom bilingual books
  },
  {
    id: 'essential-grammar',
    title: 'Essential English Grammar',
    description: 'Complete grammar guide for beginners to advanced',
    difficulty: 'All Levels',
    fileUrl: 'https://ia803405.us.archive.org/4/items/essential-grammar-in-use-4th-edition/Essential%20Grammar%20in%20Use%204th%20Edition.pdf',
    source: 'Archive.org',
    pages: 319,
    category: 'Grammar'
  },
  {
    id: 'oxford-guide',
    title: 'Oxford Guide to English Grammar',
    description: 'Comprehensive grammar reference',
    difficulty: 'Intermediate',
    fileUrl: 'https://ia600304.us.archive.org/35/items/OxfordGuideToEnglishGrammar/Oxford%20Guide%20to%20English%20Grammar.pdf',
    source: 'Archive.org',
    pages: 462,
    category: 'Grammar'
  },
  {
    id: 'english-vocabulary',
    title: 'English Vocabulary in Use',
    description: 'Build your vocabulary systematically',
    difficulty: 'Intermediate',
    fileUrl: 'https://ia800305.us.archive.org/9/items/EnglishVocabularyInUseUpperIntermediate/English%20Vocabulary%20in%20Use%20-%20Upper-intermediate.pdf',
    source: 'Archive.org',
    pages: 316,
    category: 'Vocabulary'
  },
  {
    id: 'business-english',
    title: 'Business English Handbook',
    description: 'Professional English for the workplace',
    difficulty: 'Advanced',
    fileUrl: 'https://ia800806.us.archive.org/20/items/BusinessEnglishHandbook/Business%20English%20Handbook.pdf',
    source: 'Archive.org',
    pages: 178,
    category: 'Business'
  },
  {
    id: 'pronunciation-guide',
    title: 'English Pronunciation in Use',
    description: 'Master English pronunciation',
    difficulty: 'All Levels',
    fileUrl: 'https://ia800309.us.archive.org/24/items/EnglishPronunciationInUse/English%20Pronunciation%20in%20Use.pdf',
    source: 'Archive.org',
    pages: 203,
    category: 'Pronunciation'
  },
];

// Open Library API - THE BEST CHOICE!
const OPENLIBRARY_API = 'https://openlibrary.org/search.json';

export const searchOpenLibrary = async (query = 'english learning', limit = 20) => {
  try {
    const response = await fetch(
      `${OPENLIBRARY_API}?q=${encodeURIComponent(query)}&subject=english language&limit=${limit}`
    );
    const data = await response.json();
    
    return data.docs
      .filter(book => book.ia && book.ia.length > 0) // Only books with Archive.org access
      .map(book => ({
        id: `openlibrary-${book.key.replace('/works/', '')}`,
        title: book.title,
        author: book.author_name?.[0] || 'Unknown',
        description: book.first_sentence?.[0] || book.subject?.slice(0, 3).join(', ') || 'English learning resource',
        fileUrl: `https://archive.org/download/${book.ia[0]}/${book.ia[0]}.pdf`,
        source: 'Open Library',
        category: 'ESL',
        difficulty: 'Various',
        pages: book.number_of_pages_median || 'N/A',
        publishYear: book.first_publish_year,
        coverUrl: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : null,
      }));
  } catch (error) {
    console.error('Error fetching Open Library books:', error);
    return [];
  }
};

// Search by specific categories
export const searchByCategory = async (category) => {
  const categoryQueries = {
    grammar: 'english grammar',
    vocabulary: 'english vocabulary',
    business: 'business english',
    conversation: 'english conversation',
    pronunciation: 'english pronunciation',
    writing: 'english writing',
    reading: 'english reading comprehension',
  };

  const query = categoryQueries[category.toLowerCase()] || category;
  return await searchOpenLibrary(query);
};

// Search ESL books specifically
export const searchESLBooks = async () => {
  try {
    const response = await fetch(
      `${OPENLIBRARY_API}?q=ESL&subject=english as a second language&limit=30`
    );
    const data = await response.json();
    
    return data.docs
      .filter(book => book.ia && book.ia.length > 0)
      .map(book => ({
        id: `esl-${book.key.replace('/works/', '')}`,
        title: book.title,
        author: book.author_name?.[0] || 'Unknown',
        description: 'ESL learning resource',
        fileUrl: `https://archive.org/download/${book.ia[0]}/${book.ia[0]}.pdf`,
        source: 'Open Library - ESL',
        category: 'ESL',
        difficulty: 'Various',
        pages: book.number_of_pages_median || 'N/A',
        coverUrl: book.cover_i 
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
          : null,
      }));
  } catch (error) {
    console.error('Error fetching ESL books:', error);
    return [];
  }
};

// Combined search function
export const searchAllBooks = async (query = 'english learning') => {
  try {
    const openLibraryResults = await searchOpenLibrary(query, 15);
    
    return [
      ...CURATED_BOOKS,
      ...openLibraryResults
    ];
  } catch (error) {
    console.error('Error searching books:', error);
    return CURATED_BOOKS; // Fallback to curated list
  }
};

// Get book by ID
export const getBookById = (bookId) => {
  return CURATED_BOOKS.find(book => book.id === bookId);
};

// Filter books by category
export const getBooksByCategory = (category) => {
  return CURATED_BOOKS.filter(book => book.category === category);
};

// Filter books by difficulty
export const getBooksByDifficulty = (difficulty) => {
  return CURATED_BOOKS.filter(book => 
    book.difficulty === difficulty || book.difficulty === 'All Levels'
  );
};