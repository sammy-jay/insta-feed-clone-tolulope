import { useState } from 'react';
import { FiMoreHorizontal, FiShare2 } from 'react-icons/fi';
import { BsBookmark, BsCheckCircleFill, BsBookmarkFill } from 'react-icons/bs';
import '../styles/Post.css';
import { motion } from 'framer-motion';
import { Reactions } from './Reactions';

interface Comment {
  username: string;
  text: string;
  likes: number;
  timeAgo: string;
}

interface PostProps {
  username: string;
  avatar: string;
  timeAgo: string;
  likes: number;
  comments: {
    count: number;
    items: Comment[];
  };
  caption: string;
  location?: string;
  isVerified?: boolean;
  images: string[];
}

export const Post = ({
  username,
  avatar,
  timeAgo,
  likes,
  comments,
  caption,
  location,
  isVerified,
  images,
}: PostProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [_, setReaction] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [startX, setStartX] = useState(0);

  const handleReact = (type: string) => {
    setIsLiked(true);
    setReaction(type);
  };

  const handleComment = () => {
    // Add comment functionality
    console.log('Comment clicked');
  };

  const handleSwipeStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleSwipeMove = (e: React.TouchEvent) => {
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 50) { // Adjust threshold as needed
      if (deltaX > 0 && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1); // Swipe right
      } else if (deltaX < 0 && currentImageIndex < images.length - 1) {
        setCurrentImageIndex(prev => prev + 1); // Swipe left
      }
      setStartX(e.touches[0].clientX); // Reset start position
    }
  };

  return (
    <motion.div 
      className="post"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onTouchStart={handleSwipeStart}
      onTouchMove={handleSwipeMove}
    >
      <div className="post-header">
        <div className="post-user">
          <img src={avatar} alt={username} className="post-avatar" />
          <div className="post-user-info">
            <div className="post-user-row">
              <div className="username-container">
                <span className="post-username">{username}</span>
                {isVerified && <BsCheckCircleFill className="post-verified" />}
              </div>
            </div>
            <div className="post-location-time">
              <span className="post-location">{location}</span>
              <span className="post-time">{timeAgo}</span>
            </div>
          </div>
        </div>
        <div className="post-time">
          <FiMoreHorizontal className="more-icon" />
        </div>
      </div>

      <div className="post-image-container">
        <div 
          className="post-images-scroll"
          style={{ 
            transform: `translateX(-${currentImageIndex * 100}%)`,
            width: `${images.length * 100}%`
          }}
        >
          {images.map((img, index) => (
            <div key={index} className="post-image">
              <img src={img} alt={`Post content ${index + 1}`} />
            </div>
          ))}
        </div>
        
        {images.length > 1 && (
          <div className="post-image-dots">
            {images.map((_, index) => (
              <button
                key={index}
                className={`image-dot ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="post-content">
        <div className="post-actions">
          <div className="action-buttons-left">
            <Reactions 
              onReact={handleReact}
              isLiked={isLiked}
              onComment={handleComment}
            />
            <motion.button 
              className="action-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FiShare2 className="action-icon share-icon" />
            </motion.button>
          </div>
          <div className="action-buttons-right">
            <motion.button 
              className="action-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSaved(!isSaved)}
            >
              {isSaved ? (
                <BsBookmarkFill className="action-icon bookmark-icon" />
              ) : (
                <BsBookmark className="action-icon bookmark-icon" />
              )}
            </motion.button>
          </div>
        </div>

        <div className="post-stats">
          <div className="likes-count">
            {likes.toLocaleString()} likes
          </div>
          
          <div className="post-caption">
            <span className="caption-username">{username}</span>
            <span className="caption-text">
              {isExpanded ? caption : caption.slice(0, 125)}
              {caption.length > 125 && !isExpanded && (
                <button 
                  className="more-button" 
                  onClick={() => setIsExpanded(true)}
                >
                  ... more
                </button>
              )}
            </span>
          </div>

          {comments.count > 0 && (
            <button 
              className="view-comments-btn"
              onClick={handleComment}
            >
              View all {comments.count} comments
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}; 