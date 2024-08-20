// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ProfilePage from './pages/ProfilePage';
import CalendarPage from './pages/Calendar'; // Update import
import AppBarComponent from './components/AppBarComponent';
import SideDrawer from './components/SideDrawer';
import TodoPage from './pages/TodoPage';
import BottomNav from './components/BottomNavigationBar';
import SearchBar from './components/SearchBar';
import Carousel from './components/Carousel';
import SplashScreen from './components/SplashScreen';
import RecentPages from './components/RecentPages';
import Grid from './components/Grid';
import { UserProvider } from './contexts/UserContext';
import './global.css'; 

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
      <UserProvider>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <>
            <AppBarComponent onSettingsClick={handleSettingsClick} />
            <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <div style={{ paddingTop: '64px', paddingBottom: '56px' }} className="container">
              <Routes>
                <Route path="/" element={<MainPageWithExtras />} />
                <Route path="/profilepage" element={<ProfilePage />} />
                <Route path="/mainpage" element={<MainPage />} />
                <Route path="/mainpagewithextras" element={<MainPageWithExtras />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/calendar" element={<CalendarPage />} /> {/* Calendar page route */}
                <Route path="/calendar/todo/:date" element={<TodoPage />} /> {/* To-do page route */}
              </Routes>
            </div>
            <BottomNav />
          </>
        )}
      </UserProvider>
    </Router>
  );
};

const MainPageWithExtras = () => (
  <>
    <SearchBar />
    <Grid />
    <Carousel />
    <RecentPages />
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
