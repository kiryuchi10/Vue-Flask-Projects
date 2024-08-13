import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AppBarComponent from './components/AppBarComponent'; // Update import to match filename
import SideDrawer from './components/SideDrawer';
import BottomNav from './components/BottomNavigationBar';
import SearchBar from './components/SearchBar';
import Carousel from './components/Carousel';
import SplashScreen from './components/SplashScreen';
import './App.css'; // Import the CSS file

const App = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleSettingsClick = () => {
    setDrawerOpen(true);
  };

  return (
    <Router>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          <AppBarComponent onMenuClick={handleSettingsClick} />
          <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <div style={{ paddingTop: '64px', paddingBottom: '56px' }} className="form-container">
            <Routes>
              <Route path="/" element={<MainPageWithExtras />} />
              <Route path="/mainpage" element={<MainPage />} />
              <Route path="/mainpagewithextras" element={<MainPageWithExtras />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Routes>
          </div>
          <BottomNav />
        </>
      )}
    </Router>
  );
};

const MainPageWithExtras = () => (
  <>
    <SearchBar />
    <Carousel />
  </>
);

const LoginPage = () => (
  <div className="form">
    <Login />
  </div>
);

const SignupPage = () => (
  <div className="form">
    <Signup />
  </div>
);

const ForgotPasswordPage = () => (
  <div className="form">
    <ForgotPassword />
  </div>
);

export default App;
