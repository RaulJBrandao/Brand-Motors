import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AnuncioPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoCalendarOutline, IoWaterOutline, IoArrowBack } from "react-icons/io5";
import { PiSpeedometer } from "react-icons/pi";
import AuthBar from "../components/AuthBar";
import "../styles/Perfil.css";

export default function Perfil() {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ESTADO PARA PRÉ-VISUALIZAÇÃO DA FOTO
  const [previewFoto, setPreviewFoto] = useState("/images/user.jpg");

  const inputRef = useRef(null);

  const handleClickFoto = () => {
    inputRef.current.click(); // abre o seletor de imagem quando clicar na foto
  };

  const handleChangeFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewFoto(url); // atualiza a imagem na hora
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  if (!user) {
    return (
      <>
        <Header backgroundColor="#010217" />
        <AuthBar />
        <div className="perfil-wrapper">
          <h2>Carregando perfil...</h2>
        </div>
        <Footer backgroundColor="black" />
      </>
    );
  }

  return (
    <>
      <Header backgroundColor="#010217" />
      <AuthBar />

      <div className="perfil-wrapper">

        <div className="perfil-left">

          {/* FOTO QUE ALTERA AO CLICAR */}
          <img
            src={previewFoto}
            alt="Foto do usuário"
            className="perfil-foto"
            onClick={handleClickFoto}
            style={{ cursor: "pointer" }}
          />

          {/* INPUT ESCONDIDO */}
          <input
            type="file"
            accept="image/*"
            ref={inputRef}
            style={{ display: "none" }}
            onChange={handleChangeFoto}
          />

          <h2 className="perfil-nome">{user.nome}</h2>

          <p className="perfil-data">
            {user.dataNascimento ?? "Data não informada"}
          </p>

          <p className="perfil-email">{user.email}</p>
          <p className="perfil-telefone">{user.telefone ?? "Sem telefone"}</p>

          <button className="perfil-btn" onClick={() => navigate("/editar-perfil")}>
  Editar perfil
</button>
          <button className="perfil-btn sair">Sair</button>
        </div>

        <div className="perfil-right">
          <div className="perfil-card">
            <p className="card-titulo"onClick={() => navigate("/historico")} style={{ cursor: "pointer" }}>Histórico de compras</p>
            <i className="card-icone">📄</i>
          </div>
          <div className="perfil-card">
            <p className="card-titulo" onClick={() => navigate("/meuscarros")} style={{ cursor: "pointer" }}>Meus veículos</p>
            <i className="card-icone">🚗</i>
          </div>
          <div className="perfil-card" onClick={() => navigate("/agendar")} style={{ cursor: "pointer" }}>
            <p className="card-titulo">Agendamento</p>
            <i className="card-icone">📅</i>
          </div>
          </div>
        </div>

      <Footer backgroundColor="black" />
    </>
  );
}