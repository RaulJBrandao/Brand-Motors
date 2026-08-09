import React, { useEffect, useState } from 'react';
import '../styles/BannerSlider.css';
import banner1 from '../assets/brandmech/bmech_serv/bannerframe1.png';
import banner2 from '../assets/brandmech/bmech_serv/bannerframe2.png';
import banner3 from '../assets/brandmech/bmech_serv/bannerframe3.png';
import banner4 from '../assets/brandmech/bmech_serv/bannerframe4.png';

const images = [
  banner1,
  banner2,
  banner3,
  banner4,
];

const BannerSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000); // troca a cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="banner-slider">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          className={`banner-image ${index === current ? 'active' : ''}`}
          alt={`Banner ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default BannerSlider;
