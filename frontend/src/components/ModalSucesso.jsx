import React, { useEffect, useState } from "react";
import "../styles/ModalSucesso.css";

export default function ModalSucesso({ onClose }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 300); // tempo igual ao da animação
  };

  return (
    <div className={`modal-overlay ${closing ? "fade-out" : "fade-in"}`}>
      <div className={`modal-box ${closing ? "zoom-out" : "zoom-in"}`}>
        <h2>Obrigado pelo seu contato!</h2>
        <p>Recebemos sua solicitação e retornaremos em breve.</p>
        <button className="modal-btn" onClick={handleClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
