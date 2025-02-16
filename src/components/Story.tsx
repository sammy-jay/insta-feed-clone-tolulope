import { motion } from 'framer-motion';

interface StoryProps {
  user: {
    id: string;
    username: string;
    avatar: string;
    hasStory?: boolean;
    isLive?: boolean;
  };
}

export const Story = ({ user }: StoryProps) => {
  return (
    <motion.div 
      className="story-item"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className={`story-avatar-container ${user.hasStory ? 'has-story' : ''}`}
        whileHover={{ scale: 1.05 }}
      >
        <motion.img 
          src={user.avatar} 
          alt={user.username} 
          className="story-avatar"
          layoutId={`story-${user.id}`}
        />
        {user.id === "1" && (
          <motion.span 
            className="add-story-badge"
            whileHover={{ scale: 1.1 }}
          >
            +
          </motion.span>
        )}
      </motion.div>
      <motion.span 
        className="story-username"
        animate={{ color: user.hasStory ? '#fff' : 'rgba(255, 255, 255, 0.9)' }}
      >
        {user.username}
      </motion.span>
    </motion.div>
  );
}; 