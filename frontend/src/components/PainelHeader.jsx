// src/components/PainelHeader.jsx
import React from "react";
import "../styles/PainelHeader.css";

import { FaHome, FaUserCog } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function PainelHeader() {
  const navigate = useNavigate();

   const handleLogout = () => {
    localStorage.removeItem("funcionario");
    localStorage.removeItem("token");
    navigate("/"); // volta para homepage principal
  };


  return (
    <div className="painel-header-bar">
      <div className="painel-header-left">
        <FaHome
          size={44}
          className="painel-header-icon"
          onClick={() => navigate("/painel")}
        />
      </div>

      <div className="painel-header-right">
        <FiLogOut
          size={44}
          className="painel-header-icon"
          onClick={handleLogout}
          title="Sair"
        />
      </div>
    </div>
  );
}
