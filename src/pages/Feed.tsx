/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { Element, scroller } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment, FaShare } from 'react-icons/fa';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { IoClose, IoArrowBack } from 'react-icons/io5';
import originalFeedData from '../data/feed.json';
import '../styles/Feed.css';

interface FeedItem {
  id: string;
  url: string;
  caption: string;
  username: string;
  avatar: string;
  likes: number;
  comments: Array<{
    user: string;
    text: string;
    avatar?: string;
  }>;
}

const duplicateFeedData = (times: number): FeedItem[] => {
  let items: FeedItem[] = [];
  for (let i = 0; i < times; i++) {
    items = [
      ...items,
      ...originalFeedData.items.map(item => ({
        ...item,
        id: `${item.id}-${i}`,
      }))
    ];
  }
  return items;
};

interface FeedProps {
  onClose: () => void;
}

export const Feed = ({ onClose }: FeedProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [items, setItems] = useState<FeedItem[]>(duplicateFeedData(3));
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchMoreData = () => {
    if (items.length >= 50) {
      setHasMore(false);
      return;
    }

    setTimeout(() => {
      const newItems = duplicateFeedData(1);
      setItems(prevItems => [...prevItems, ...newItems]);
    }, 1000);
  };

  const handleScroll = (e: WheelEvent) => {
    e.preventDefault();
    const deltaY = e.deltaY;

    if (deltaY > 0 && currentIndex < items.length - 1) {
      scrollToIndex(currentIndex + 1);
    } else if (deltaY < 0 && currentIndex > 0) {
      scrollToIndex(currentIndex - 1);
    }
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(index);
    scroller.scrollTo(`item-${index}`, {
      duration: 500,
      delay: 0,
      smooth: 'easeInOutQuart',
    });

    // Load more content when approaching the end
    if (index > items.length - 5) {
      fetchMoreData();
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
      <div className="feed-header-overlay">
        <motion.button
          className="back-button"
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <IoArrowBack size={24} color="#fff" />
        </motion.button>
      </div>
      <InfiniteScroll
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 style={{ color: 'white', textAlign: 'center', padding: '20px' }}>Loading...</h4>}
        scrollThreshold="200px"
        style={{ overflow: 'unset' }}
      >
        <div className="feed-container" ref={containerRef}>
          <AnimatePresence initial={false} mode="wait">
            {items.map((item, index) => (
              <Element name={`item-${index}`} key={item.id}>
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
                      <div className="feed-user-details">
                        <span className="feed-username">{item.username}</span>
                        <span className="feed-caption">{item.caption}</span>
                      </div>
                    </div>
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
                      onClick={() => setShowComments(!showComments)}
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
                  <AnimatePresence>
                    {showComments && (
                      <motion.div
                        className="comments-overlay"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="comments-header">
                          <h3 className="comments-title">Comments</h3>
                          <motion.button
                            className="close-button"
                            onClick={() => setShowComments(false)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <IoClose size={24} />
                          </motion.button>
                        </div>
                        <div className="comments-section">
                          {item.comments.map((comment, idx) => (
                            <div key={idx} className="comment">
                              <strong>{comment.user}:</strong> {comment.text}
                            </div>
                          ))}
                        </div>
                        <div className="comment-input-container">
                          <form onSubmit={handleCommentSubmit} className="comment-form">
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
                    )}
                  </AnimatePresence>
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
      </InfiniteScroll>
    </div>
  );
}; 