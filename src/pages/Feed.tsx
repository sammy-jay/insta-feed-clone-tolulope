import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment, FaShare } from 'react-icons/fa';
import { BsBookmark, BsBookmarkFill, BsMusicNote } from 'react-icons/bs';
import { IoMusicalNotes, IoVolumeMedium, IoVolumeOff } from 'react-icons/io5';
import { RiShareForwardLine, RiWhatsappLine } from 'react-icons/ri';
import { FaTelegramPlane, FaRegCommentDots } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import '../styles/Feed.css';
import feedData from '../data/feed.json';

export const Feed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const items = feedData.items.filter(item => item.type === 'image'); // Ensure only images are processed
  const currentItem = items[currentIndex];

  let lastScrollTime = 0;

  const handleScroll = (e: WheelEvent | TouchEvent | { deltaY: number }) => {
    const now = Date.now();
    if (now - lastScrollTime < 100) return; // Debounce: ignore if last scroll was less than 100ms ago
    lastScrollTime = now;

    // Prevent default scrolling behavior
    if ('preventDefault' in e) {
      e.preventDefault();
    }

    // Determine deltaY based on the event type
    const deltaY = 'deltaY' in e ? (e as WheelEvent).deltaY : 
                   'changedTouches' in e ? (e as TouchEvent).changedTouches[0].clientY : 
                   (e as { deltaY: number }).deltaY;

    // Set a threshold for scrolling
    const threshold = 50; // Adjust this value as needed

    // Check if at the beginning or end of the list
    if (currentIndex === 0 && deltaY < 0) {
      return; // Ignore scroll up if at the start
    }
    if (currentIndex === items.length - 1 && deltaY > 0) {
      return; // Ignore scroll down if at the end
    }

    // Ensure currentIndex stays within bounds
    if (deltaY > threshold && currentIndex < items.length - 1) {
        setDirection(1); // Set direction for down scroll
        setCurrentIndex(prev => Math.min(prev + 1, items.length - 1)); // Prevent going out of bounds
    } else if (deltaY < -threshold && currentIndex > 0) {
        setDirection(-1); // Set direction for up scroll
        setCurrentIndex(prev => Math.max(prev - 1, 0)); // Prevent going out of bounds
    }
  };

  useEffect(() => {
    const container = containerRef.current;

    const wheelHandler = (e: WheelEvent) => handleScroll(e);
    const touchStartHandler = (e: TouchEvent) => {
      setStartY(e.touches[0].clientY);
      const touchMoveHandler = (moveEvent: TouchEvent) => {
        handleSwipeMove(moveEvent);
      };
      document.addEventListener('touchmove', touchMoveHandler);

      // Cleanup function to remove touchmove listener
      return () => {
        document.removeEventListener('touchmove', touchMoveHandler);
      };
    };

    if (container) {
      container.addEventListener('wheel', wheelHandler, { passive: false });
      container.addEventListener('touchstart', touchStartHandler);
      return () => {
        container.removeEventListener('wheel', wheelHandler);
        container.removeEventListener('touchstart', touchStartHandler);
      };
    }
  }, [currentIndex, items.length]);

  const toggleSound = () => {
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleSwipeMove = (e: TouchEvent) => {
    const deltaY = e.touches[0].clientY - startY; // Calculate the difference in Y direction
    if (Math.abs(deltaY) > 30) { // Adjust threshold as needed
      handleScroll({ deltaY }); // Pass the deltaY to handleScroll
    }
  };

  return (
    <div className="feed-wrapper" style={{ padding: '20px' }}>
      <div className="feed-container" ref={containerRef}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ y: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction > 0 ? '-100%' : '100%', opacity: 0 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className="feed-item"
          >
            <img 
              src={currentItem.url}
              alt={currentItem.caption}
              className="feed-media"
            />
            <div className="feed-overlay">
              <div className="feed-user-info">
                <span className="feed-username">{currentItem.username}</span>
              </div>
              <div className="feed-caption">{currentItem.caption}</div>
            </div>
            <div className="feed-actions">
              <motion.button
                className="action-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
              >
                {isLiked ? <AiFillHeart className="liked" /> : <AiOutlineHeart />}
                <span>{currentItem.likes}</span>
              </motion.button>

              <motion.button
                className="action-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaRegComment />
                <span>{currentItem.comments}</span>
              </motion.button>

              <motion.button
                className="action-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <RiShareForwardLine />
                <div className="share-options">
                  <RiWhatsappLine />
                  <FaTelegramPlane />
                </div>
              </motion.button>

              <motion.button
                className="action-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSaved(!isSaved)}
              >
                {isSaved ? <BsBookmarkFill /> : <BsBookmark />}
              </motion.button>

              <motion.button
                className="action-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <BsThreeDots />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="feed-progress">
          {items.map((_, index) => (
            <div 
              key={index} 
              className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}; 