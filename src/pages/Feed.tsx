/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment, FaShare } from 'react-icons/fa';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { IoClose, IoArrowBack } from 'react-icons/io5';
import originalFeedData from '../data/feed.json';
import '../styles/Feed.css';
import { useFeedStore } from '../store/feedStore';

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
  const { setLike, addComment, getLikeCount, getComments } = useFeedStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [items, setItems] = useState(() => duplicateFeedData(3));
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fetchMoreData = () => {
    if (items.length >= 50 || isLoading) {
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newItems = duplicateFeedData(1).map(item => ({
        ...item,
        id: `${item.id}-${items.length}`
      }));
      setItems(prevItems => [...prevItems, ...newItems]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const itemHeight = clientHeight;
        const currentItem = Math.round(scrollTop / itemHeight);
        
        // Only update if we've moved to a different item
        if (currentItem !== currentIndex) {
          setCurrentIndex(currentItem);
          
          // Check if we need to load more content
          if (scrollHeight - scrollTop < clientHeight * 3 && !isLoading) {
            fetchMoreData();
          }
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex, isLoading]);

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!containerRef.current) return;

    const diff = touchStart - touchEnd;
    const threshold = window.innerHeight * 0.2; // 20% of screen height

    if (Math.abs(diff) > threshold) {
      setIsTransitioning(true);
      const direction = diff > 0 ? 1 : -1;
      const nextIndex = currentIndex + direction;
      
      if (nextIndex >= 0 && nextIndex < items.length) {
        const targetScroll = nextIndex * window.innerHeight;
        smoothScrollTo(containerRef.current, targetScroll, 300);
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [touchStart, touchEnd, currentIndex, items.length]);

  const smoothScrollTo = (element: HTMLElement, to: number, duration: number) => {
    const start = element.scrollTop;
    const change = to - start;
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      
      element.scrollTop = start + change * easeOutExpo;

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        setIsTransitioning(false);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  const handleLike = (id: string) => {
    const isCurrentlyLiked = useFeedStore.getState().likes[id] || false;
    setLike(id, !isCurrentlyLiked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const currentItem = items[currentIndex];
      const comment = { 
        user: 'You', 
        text: newComment,
        avatar: 'https://your-default-avatar.png' 
      };
      addComment(currentItem.id.toString(), comment);
      setNewComment('');
    }
  };

  const toggleCaption = (id: string) => {
    const newExpanded = new Set(expandedCaptions);
    if (expandedCaptions.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCaptions(newExpanded);
  };

  return (
    <div className="feed-wrapper" id="scrollableDiv">
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
        <div 
          className="feed-container" 
          ref={containerRef}
          style={{ 
            height: '100vh',
            overflowY: 'auto',
            scrollSnapType: 'y mandatory'
          }}
        >
          {items.map((item, _) => (
            <div
              key={item.id}
              className={`feed-item ${isTransitioning ? 'transitioning' : ''}`}
            >
              <div className="feed-media-container">
                <img 
                  src={item.url}
                  alt={item.caption}
                  className="feed-media"
                  loading="lazy"
                />
              </div>
              <div className="feed-overlay">
                <div className="feed-user-info">
                  <div className="feed-user-meta">
                    <img src={item.avatar} alt={item.username} className="feed-avatar" />
                    <span className="feed-username">{item.username}</span>
                  </div>
                </div>
                <div className="feed-caption-wrapper">
                  <div className="feed-caption-container">
                    <div className={`feed-caption ${!expandedCaptions.has(item.id) ? 'truncated' : ''}`}>
                      {item.caption}
                    </div>
                    {item.caption.length > 100 && (
                      <button 
                        className="caption-more"
                        onClick={() => toggleCaption(item.id)}
                      >
                        {expandedCaptions.has(item.id) ? 'less' : 'more'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="feed-actions">
                <motion.button
                  className="action-button"
                  onClick={() => handleLike(item.id.toString())}
                >
                  {useFeedStore.getState().likes[item.id.toString()] ? 
                    <AiFillHeart className="liked" size={28} /> : 
                    <AiOutlineHeart size={28} />
                  }
                  <span>{getLikeCount(item.id.toString(), item.likes)}</span>
                </motion.button>

                <motion.button
                  className="action-button"
                  onClick={() => setShowComments(true)}
                >
                  <FaRegComment />
                  <span>
                    {getComments(item.id.toString(), item.comments).length}
                  </span>
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
                      {getComments(item.id.toString(), item.comments)
                        .map((comment, idx) => (
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
            </div>
          ))}
          {isLoading && (
            <div className="feed-loading">
              Loading more...
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
}; 