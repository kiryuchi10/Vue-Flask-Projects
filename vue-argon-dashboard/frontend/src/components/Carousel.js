import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Carousel.css'; // Import the custom CSS file for carousel styling

// Correct paths to the images
import image1 from '../assets/carousel/image1.png';
import image2 from '../assets/carousel/image2.png';
import image3 from '../assets/carousel/image3.png';
import image4 from '../assets/carousel/image4.png';

// Array of image objects with correct src usage
const images = [
  { src: image1, alt: "Slide 1" },
  { src: image2, alt: "Slide 2" },
  { src: image3, alt: "Slide 3" },
  { src: image4, alt: "Slide 4" }
];

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true, // Centers the current slide
    centerPadding: "0px", // Removes padding around the center slide
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img src={image.src} alt={image.alt} className="carousel-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
