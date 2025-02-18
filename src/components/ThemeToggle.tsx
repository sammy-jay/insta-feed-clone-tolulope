import React from 'react';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';

const ThemeToggle: React.FC<{ toggleTheme: () => void; isDarkMode: boolean }> = ({ toggleTheme, isDarkMode }) => {
  return (
    <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
      {isDarkMode ? <BsFillSunFill size={24} color="#f7ff00" /> : <BsFillMoonFill size={24} color="#fff" />}
    </button>
  );
};

export default ThemeToggle; 