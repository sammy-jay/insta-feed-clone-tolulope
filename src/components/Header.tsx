import { IoNotificationsOutline } from 'react-icons/io5'
import { FiMessageCircle } from 'react-icons/fi'
import '../styles/Header.css'
import { motion } from 'framer-motion'
import { Story } from './Story'
import React from 'react'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  stories: {
    id: string;
    username: string;
    avatar: string;
    isOwn?: boolean;
    hasStory?: boolean;
  }[];
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ stories, toggleTheme, isDarkMode }) => {
  return (
    <header className="header">
      <div className="header-top">
        <div className="header-content">
          <div className="logo">
            <div className="logo-container">
              <span className="logo-text">P</span>
            </div>
            <span className="logo-name">Pipel</span>
          </div>
          <div className="action-icons">
            <div className="icon-container">
              <IoNotificationsOutline className="icon" />
              <span className="notification-badge">2</span>
            </div>
            <div className="icon-container">
              <FiMessageCircle className="icon" />
              <span className="notification-badge">1</span>
            </div>
            <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
      
      <div className="stories-section">
        <motion.div 
          className="stories-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {stories.map((story) => (
            <Story key={story.id} user={story} />
          ))}
        </motion.div>
      </div>
    </header>
  )
}
