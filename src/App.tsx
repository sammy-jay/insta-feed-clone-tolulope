/* eslint-disable */
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Feed } from './pages/Feed';
import './styles/App.css'

function NavigationWrapper() {
  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate('/');
    // If you're using Zustand or similar for tab state:
    // setActiveTab('home');
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feed" element={<Feed onClose={handleClose} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <NavigationWrapper />
    </BrowserRouter>
  );
}

export default App;
