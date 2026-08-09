import React, { useState, useEffect } from "react";
import "../styles/HomePage.css";
import "../styles/Header.css";
import logo from '../assets/logo.png';
import brandMechLogo from "../assets/brandmech.png";
import localizacaoImg from "../assets/localizacao.png";
import { IoCarSportOutline } from "react-icons/io5";
import { FiTool } from "react-icons/fi";
import { IoWaterOutline } from "react-icons/io5";
import { GiSteeringWheel } from "react-icons/gi";

import { FiShield } from "react-icons/fi";
import { MdPublishedWithChanges } from "react-icons/md";
import { RiContactsBook3Line } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";

import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Brands from "./Brands";
import FavoriteButton from "../components/FavoriteButton";
import axios from "axios";


function HomePage() {
   const [destaques, setDestaques] = useState([]);
   const [favoritosIds, setFavoritosIds] = useState([]);
   const user = JSON.parse(localStorage.getItem("user"));
const tipo = localStorage.getItem("tipo");
const clienteId = tipo === "cliente" ? user?.id : null;



  // Placeholder elegante
  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='180'>
         <rect width='100%' height='100%' fill='#f2f2f2'/>
         <text x='50%' y='50%' text-anchor='middle' fill='#999'
           dominant-baseline='middle' font-size='16'>
           Sem imagem
         </text>
       </svg>`
    );

  // monta caminho da imagem
  const buildImagePath = (fileName) => {
    if (!fileName) return PLACEHOLDER;
    return `/uploads/cars/${fileName}`;
  };

  const handleImgError = (e) => {
    e.currentTarget.src = PLACEHOLDER;
  };

  /*
====================================================
CARREGA DESTAQUES DO NOVO ENDPOINT (FILTRANDO STATUS)
====================================================
*/
useEffect(() => {
  async function carregar() {
    try {
      const resp = await fetch("/carros/destaques");
      const dados = await resp.json();

      if (Array.isArray(dados)) {
        const filtrados = dados
          .filter(c => c.status === "disponível") // ⭐ FILTRANDO
          .map((c) => ({
            ...c,
            imagemFinal: c.imagens?.principal || null,
          }));

        setDestaques(filtrados);
      }
    } catch (err) {
      console.error("Erro ao buscar destaques:", err);
    }
  }

  carregar();
}, []);


  useEffect(() => {
  if (!clienteId) return;

  const fetchFavoritos = async () => {
    try {
      const resp = await axios.get(`/clientes/${clienteId}/favoritos`);
      const ids = resp.data.favoritos.map((c) => c.id);
      setFavoritosIds(ids);
    } catch (e) {
      console.error("Erro ao carregar favoritos:", e);
    }
  };

  fetchFavoritos();
}, [clienteId]);


  return (
    <>
      <div className="homepage">
        <Header />

      </div>
      <div className="fade-transition"></div>
      <Brands />

        {/* === DESTAQUES === */}
      <main className="main-content">
        <h2 className="section-title">Destaques</h2>

        <div className="destaques-grid">
  {destaques.length > 0 ? (
    destaques.map((carro) => {
      const isFavorited = favoritosIds.includes(carro.id);

      return (
        <div className="destaque-card" key={carro.id}>
          
          {/* ⭐ Botão de Favorito (igual à vitrine) */}
          {clienteId && (
            <div className="fav-btn-home">
              <FavoriteButton
                carroId={carro.id}
                clienteId={clienteId}
                isFavoritedDefault={isFavorited}
              />
            </div>
          )}

          {/* Conteúdo clicável */}
          <Link to={`/anuncio/${carro.id}`} className="destaque-link">
            <img
              src={buildImagePath(carro.imagemFinal)}
              onError={handleImgError}
              alt={carro.modelo}
            />

            <h4>{carro.marca} {carro.modelo}</h4>
            <p>R$ {parseFloat(carro.preco).toLocaleString("pt-BR")}</p>
          </Link>

        </div>
      );
    })
  ) : (
    <p style={{ color: "#777", fontSize: "18px" }}>
      Nenhum veículo em destaque no momento.
    </p>
  )}
</div>


        <div className="estoque-button-wrapper">
          <a href="estoque" className="estoque-button">
            Confira nosso estoque
          </a>
        </div>
      </main>


      {/* SESSÃO BRAND MECH */}
      <section className="brandmech-section">
        <div className="brandmech-left">
          <img src={brandMechLogo} alt="Brand Mech" className="brandmech-logo" />
          <h2 className="brandmech-heading">Seu carro bem cuidado</h2>
        </div>

        <div className="brandmech-right">
          <div className="brandmech-grid">
             <a href="#" className="brandmech-button">Revisão<FiTool style={{ fontSize: '45px' }}/>
</a>
    <Link to="/servicos" className="brandmech-button">Serviços<IoWaterOutline style={{ fontSize: '45px' }}/>
</Link>
    <a href="#" className="brandmech-button">Test Drive<GiSteeringWheel style={{ fontSize: '75px' }}/>
</a>
    <a href="#" className="brandmech-button">Pacotes de serviço<IoCarSportOutline style={{ fontSize: '45px' }} />
</a>
    <a href="#" className="brandmech-button">Seguros<FiShield style={{ fontSize: '45px' }}/></a>
    <a href="#" className="brandmech-button">Recall<MdPublishedWithChanges style={{ fontSize: '45px' }}/>
</a>
    <a href="#" className="brandmech-button">Assistência<RiContactsBook3Line style={{ fontSize: '45px' }}/>
</a>
    <a href="#" className="brandmech-button">Fale conosco<FiPhoneCall style={{ fontSize: '45px' }}/>
</a>
    <a href="#" className="brandmech-button">Encontre uma concessionária <IoLocationOutline style={{ fontSize: '75px' }}/>
</a>
          </div>
        </div>
      </section>

      {/* LOCALIZAÇÃO */}
      <section className="localizacao-section">
        <img src={localizacaoImg} alt="Localização" className="localizacao-img" />
      </section>

      <Footer />
    </>
  );
}

export default HomePage;
