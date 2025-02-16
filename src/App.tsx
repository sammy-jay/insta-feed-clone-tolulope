import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Feed } from './pages/Feed';
import { Header } from './components/Header'
import { Post } from './components/Post'
import { BottomNav } from './components/BottomNav'
import './styles/App.css'
import postsData from './data/posts.json'
import storiesData from './data/stories.json'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
