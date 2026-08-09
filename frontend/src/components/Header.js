import defaultlogo from "../assets/logo.png";
import { Link } from "react-router-dom";
import React from "react";

const Header = ({ logo = defaultlogo, backgroundColor = "transparent" }) => {


  
  return (
    <header>
      <header className="header" style={{ backgroundColor }}>
        <nav className="navbar">
          <a href="/" className="logo-link">
            <img src={logo} alt="Brand Motors Logo" className="logo" />
          </a>
          <ul>
            <li>
              <Link to="/veiculo">Veículos</Link>
            </li>
            <li>
              <Link to="/vender">Vender</Link>
            </li>
            <li>
              <Link to="/servicos">Serviços</Link>
            </li>
          </ul>
        </nav>
      </header>
    </header>
  );
};

export default Header;
