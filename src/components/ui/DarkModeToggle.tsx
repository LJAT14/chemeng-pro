import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed top-4 right-4 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}