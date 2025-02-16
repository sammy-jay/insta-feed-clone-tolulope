import React, { useState, useRef, useEffect } from 'react';
import { Element, scroller } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment, FaShare } from 'react-icons/fa';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import feedData from '../data/feed.json'; // Ensure this path is correct
import '../styles/Feed.css';

export const Feed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const items = feedData.items; // Allow both images and videos

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    scroller.scrollTo(`item-${index}`, {
      duration: 500,
      delay: 0,
      smooth: 'easeInOutQuart',
    });
  };

  const handleScroll = (e: WheelEvent) => {
    e.preventDefault(); // Prevent default scrolling behavior
    const deltaY = e.deltaY;

    if (deltaY > 0 && currentIndex < items.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else if (deltaY < 0 && currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      items[currentIndex].comments.push({ user: 'You', text: newComment });
      setNewComment('');
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleScroll);
      };
    }
  }, [currentIndex]);

  return (
    <div className="feed-wrapper">
      <div className="feed-container" ref={containerRef}>
        <AnimatePresence initial={false} mode="wait">
          {items.map((item, index) => (
            <Element name={`item-${index}`} key={index}>
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="feed-item"
              >
                <img 
                  src={item.url}
                  alt={item.caption}
                  className="feed-media"
                />
                <div className="feed-overlay">
                  <div className="feed-user-info">
                    <img src={item.avatar} alt={item.username} className="feed-avatar" />
                    <span className="feed-username">{item.username}</span>
                  </div>
                  <div className="feed-caption">{item.caption}</div>
                </div>
                <div className="feed-actions">
                  <motion.button
                    className="action-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    {isLiked ? <AiFillHeart className="liked" /> : <AiOutlineHeart />}
                    <span>{item.likes}</span>
                  </motion.button>

                  <motion.button
                    className="action-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaRegComment />
                    <span>{item.comments.length}</span>
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
                    <FaShare />
                  </motion.button>
                </div>
                <div className="comments-section">
                  {item.comments.map((comment, idx) => (
                    <div key={idx} className="comment">
                      <strong>{comment.user}:</strong> {comment.text}
                    </div>
                  ))}
                  <form onSubmit={handleCommentSubmit}>
                    <input 
                      type="text" 
                      value={newComment} 
                      onChange={(e) => setNewComment(e.target.value)} 
                      placeholder="Add a comment..." 
                      className="comment-input"
                    />
                    <button type="submit" className="comment-submit">Post</button>
                  </form>
                </div>
              </motion.div>
            </Element>
          ))}
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