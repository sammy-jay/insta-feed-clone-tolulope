/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineHome } from 'react-icons/ai';
import { IoAddCircleOutline } from 'react-icons/io5';
import { BiHeart } from 'react-icons/bi';
import { RiRadioButtonLine } from 'react-icons/ri';
import { MdOutlineExplore } from 'react-icons/md';
import '../styles/BottomNav.css';
import { motion } from 'framer-motion';

interface BottomNavProps {
  showFeed: boolean;
  onFeedToggle: () => void;
}

export const BottomNav = ({ showFeed, onFeedToggle }: BottomNavProps) => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  return (
    <motion.nav 
      className={`bottom-nav ${showFeed ? 'feed-mode' : ''}`}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="nav-items-container">
        <button 
          className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('home'); navigate('/'); }}
        >
          <div className="nav-pill">
          <AiOutlineHome className="nav-icon" />
            <span className="nav-text">Home</span>
          </div>
        </button>
        <button 
          className={`nav-item feed-icon ${activeTab === 'feed' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('feed'); onFeedToggle(); navigate('/feed'); }}
        >
          <div className="nav-pill">
          <MdOutlineExplore className="nav-icon" />
            <span className="nav-text">Feed</span>
          </div>
        </button>
        <button className="nav-item add-button">
          <IoAddCircleOutline className="nav-icon add-icon" />
        </button>
        <button 
          className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => { setActiveTab('notifications'); }}
        >
          <div className="nav-pill">
            <BiHeart className="nav-icon" />
            <span className="nav-text">Notifications</span>
          </div>
        </button>
        <button 
          className={`nav-item ${activeTab === 'live' ? 'active' : ''}`}
          onClick={() => { setActiveTab('live'); }}
        >
          <div className="nav-pill">
            <RiRadioButtonLine className="nav-icon" />
            <span className="nav-text">Live</span>
          </div>
        </button>
      </div>
    </motion.nav>
  );
}; 