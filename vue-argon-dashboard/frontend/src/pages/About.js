// AboutPage.jsx
import React from 'react';
import Slider from 'react-slick';
import './AboutPage.css'; // Import your CSS for custom styling

const AboutPage = () => {
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Show navigation arrows
  };

  return (
    <div className="about-page">
      <h1>About Us</h1>
      <Slider {...settings} className="slider">
        <div className="slide">
          <h2>Page 1</h2>
          <p>Content for the first page goes here.</p>
        </div>
        <div className="slide">
          <h2>Page 2</h2>
          <p>Content for the second page goes here.</p>
        </div>
        <div className="slide">
          <h2>Page 3</h2>
          <p>Content for the third page goes here.</p>
        </div>
        <div className="slide">
          <h2>Page 4</h2>
          <p>Content for the fourth page goes here.</p>
        </div>
      </Slider>
    </div>
  );
};

export default AboutPage;
