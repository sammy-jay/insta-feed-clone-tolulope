/* eslint-disable */
import { useState } from 'react';
import { Header } from '../components/Header'
import { Post } from '../components/Post'
import { BottomNav } from '../components/BottomNav'
import postsData from '../data/posts.json'
import storiesData from '../data/stories.json'
import { Feed } from '../pages/Feed';

export const Home = () => {
  const [showFeed, setShowFeed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleCloseFeed = () => {
    setShowFeed(false);
  };

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="app">
      {!showFeed && <Header stories={storiesData.stories} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />}
      <main className={`main-content ${showFeed ? 'feed-mode' : ''}`}>
        {showFeed ? (
          <Feed onClose={handleCloseFeed} />
        ) : (
          <div className="content-container">
            {postsData.posts.map(post => (
              <Post 
                key={post.id} 
                username={post.username}
                avatar={post.avatar}
                location={post.location}
                timeAgo={post.timeAgo}
                caption={post.caption}
                likes={post.likes}
                comments={post.comments}
                images={post.images}
              />
            ))}
          </div>
        )}
      </main>
      <BottomNav 
        showFeed={showFeed} 
        onFeedToggle={() => setShowFeed(!showFeed)}
      />
    </div>
  )
} 