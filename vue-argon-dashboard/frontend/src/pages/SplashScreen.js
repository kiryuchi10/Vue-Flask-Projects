import React from 'react';
import './SplashScreen.css';  // Optional: for styling
import Screen from '../assets/screen/image.png';  // Adjust path if necessary

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <h1>Welcome to MyApp</h1>
      <img src={Screen} alt="Screen" />  {/* Use self-closing tag */}
    </div>
  );
};

export default SplashScreen;
