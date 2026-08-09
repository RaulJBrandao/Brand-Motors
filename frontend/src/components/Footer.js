import React from 'react';
import '../styles/Footer.css';
import { AiFillTikTok } from "react-icons/ai";
import { FaInstagramSquare } from "react-icons/fa";
import { IoLogoFacebook } from "react-icons/io";
import { FaWhatsappSquare } from "react-icons/fa";


import brandLogo from '../assets/logo.png'; // ajuste o caminho conforme seu projeto

const Footer = ({ backgroundColor = '#030317' }) => {
  return (
    <footer className="footer" style={{ backgroundColor }}>
      {/* Quem somos + Logo + Social */}
      <div className="footer-section">
        <h3 className="footer-title">Quem somos</h3>
        <div className="footer-logo">
          <img src={brandLogo} alt="Brand Motors Logo" />
          <div className="footer-socials">
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
              <AiFillTikTok />
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagramSquare />

            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <IoLogoFacebook />
            </a>
            <a href="https://wa.me/0000000000" target="_blank" rel="noopener noreferrer">
              <FaWhatsappSquare />
            </a>
          </div>
        </div>
      </div>

      {/* Horário de atendimento */}
      <div className="footer-section footer-text-group">
        <h3 className="footer-title">Horário de atendimento</h3>
        <p>Segunda a Sexta: Das 08h às 18h</p>
        <p>Sábado: Das 08h às 14h30</p>
        <p>Domingos: FECHADO</p>
      </div>

      {/* Ajuda */}
      <div className="footer-section footer-text-group">
        <h3 className="footer-title">Ajuda</h3>
        <a href="#">Sobre nós</a>
        <a href="#">Fale conosco</a>
        <a href="#">Trabalhe conosco</a>
        <a href="#">Política de Privacidade</a>
      </div>

      {/* Páginas */}
      <div className="footer-section footer-text-group">
        <h3 className="footer-title">Páginas</h3>
        <a href="#">Estoque</a>
        <a href="#">Seminovos</a>
        <a href="#">Todas as ofertas</a>
        <a href="#">Consórcio</a>
        <a href="#">Financiamento</a>
      </div>
    </footer>
  );
};

export default Footer;
