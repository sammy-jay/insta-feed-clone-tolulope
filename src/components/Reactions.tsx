import { motion, AnimatePresence } from 'framer-motion';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BsEmojiLaughingFill, BsEmojiSurpriseFill } from 'react-icons/bs';
import { FaRegCommentDots } from 'react-icons/fa';
import '../styles/Reactions.css';
import { useState } from 'react';
6
interface ReactionsProps {
  onReact: (type: string) => void;
  isLiked: boolean;
  onComment: () => void;
}

const reactions = [
  { icon: AiFillHeart, type: 'love', color: '#ff3040' },
  { icon: BsEmojiLaughingFill, type: 'haha', color: '#f7ff00' },
  { icon: BsEmojiSurpriseFill, type: 'wow', color: '#00ff88' },
];

export const Reactions = ({ onReact, isLiked, onComment }: ReactionsProps) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className="reactions-container">
      <div className="reactions-wrapper">
        <motion.button 
          className="reaction-btn"
          onHoverStart={() => setShowReactions(true)}
          onHoverEnd={() => setShowReactions(false)}
        >
          <AnimatePresence>
            {showReactions && (
              <motion.div 
                className="reactions-popup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                {reactions.map((reaction) => (
                  <motion.button
                    key={reaction.type}
                    className="reaction-item"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onReact(reaction.type)}
                    style={{ color: reaction.color }}
                  >
                    <reaction.icon />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isLiked ? (
              <AiFillHeart className="icon liked" />
            ) : (
              <AiOutlineHeart className="icon" />
            )}
          </motion.div>
        </motion.button>
      </div>
      <motion.button 
        className="comment-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onComment}
      >
        <FaRegCommentDots className="icon" />
      </motion.button>
    </div>
  );
}; 