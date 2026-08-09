import React from 'react';
import '../styles/Brands.css';


import ford from '../assets/ford.png';
import chevrolet from '../assets/chevrolet.png';
import fiat from '../assets/fiat.png';
import citroen from '../assets/citroen.png';
import volkswagen from '../assets/volkswagen.png';
import audi from '../assets/audi.png';
import hyundai from '../assets/hyundai.png';

function Brands() {
  return (
    
    <div className="brands-container">
      <div className="brands-section">
        <img src={ford} alt="Ford" className="brand-logo" />
        <img src={chevrolet} alt="Chevrolet" className="brand-logo" />
        <img src={fiat} alt="Fiat" className="brand-logo" />
        <img src={citroen} alt="Citroën" className="brand-logo" />
        <img src={volkswagen} alt="Volkswagen" className="brand-logo" />
        <img src={audi} alt="Audi" className="brand-logo" />
        <img src={hyundai} alt="Hyundai" className="brand-logo" />
      </div>
    </div>
  );
}

export default Brands;
