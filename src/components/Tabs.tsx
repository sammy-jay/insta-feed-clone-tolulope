import { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/Tabs.css';

export const Tabs = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="tabs-container">
      <div className="tabs">
        <motion.button 
          className={`tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="tab-text">Home</span>
        </motion.button>
        <motion.button 
          className={`tab ${activeTab === 'foryou' ? 'active' : ''}`}
          onClick={() => setActiveTab('foryou')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="tab-text">For you</span>
        </motion.button>
      </div>
      <motion.div 
        className="tab-indicator-container"
        initial={false}
      >
        <motion.div 
          className="tab-indicator"
          animate={{
            left: activeTab === 'home' ? 'calc(50% - 62px)' : 'calc(50% + 18px)',
            width: activeTab === 'home' ? '44px' : '52px'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.div>
    </div>
  );
}; 