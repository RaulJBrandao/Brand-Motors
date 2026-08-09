import React, { useState, useEffect } from "react";
import "../styles/Vitrine.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoCarOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AuthBar from "../components/AuthBar";
// ⭐ IMPORTAÇÃO DO FAVORITE BUTTON
import FavoriteButton from "../components/FavoriteButton";


// ⭐ PEGAR CLIENTE LOGADO (se existir)
  const user = JSON.parse(localStorage.getItem("user"));
  const tipo = localStorage.getItem("tipo");
  const clienteId = tipo === "cliente" ? user?.id : null;

const Vitrine = () => {
  const [carros, setCarros] = useState([]);
   // ⭐ NECESSÁRIO → salva os IDs dos carros favoritados
  const [favoritos, setFavoritos] = useState([]);

  const navigate = useNavigate();
  const [filtros, setFiltros] = useState({
    marca: "",
    modelo: "",
    anoMin: "",
    anoMax: "",
    precoMin: "",
    precoMax: "",
    kmMin: "",
    kmMax: "",
  });

 

  // Placeholder elegante
  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='180'>
         <rect width='100%' height='100%' fill='#eeeeee'/>
         <text x='50%' y='50%' text-anchor='middle' fill='#999'
           dominant-baseline='middle' font-size='16'>
           Sem imagem
         </text>
       </svg>`
    );

  const buildImagePath = (file) => {
    if (!file) return PLACEHOLDER;
    return `/uploads/cars/${file}`;
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER;
  };

  // ⭐ Carregar os favoritos do cliente logado
  useEffect(() => {
    if (!clienteId) return;

    const fetchFavoritos = async () => {
      try {
        const resp = await axios.get(`/clientes/${clienteId}/favoritos`);
        const ids = resp.data.favoritos.map((carro) => carro.id);
        setFavoritos(ids);
      } catch (e) {
        console.error("Erro ao carregar favoritos:", e);
      }
    };

    fetchFavoritos();
  }, [clienteId]);

  // ⤵ CARREGAR CARROS + JSON DAS IMAGENS
  useEffect(() => {
  const loadCarros = async () => {
    try {
      const resp = await axios.get("/carros");
      const lista = resp.data;

      // 🔥 Carrega o JSON individual de cada carro
      const listaComImagens = await Promise.all(
        lista.map(async (carro) => {
          try {
            const json = await axios.get(`/uploads/cars/${carro.id}.json`);
            return { ...carro, imagens: json.data };
          } catch {
            return { ...carro, imagens: null }; // sem json → placeholder
          }
        })
      );

      // ⭐⭐⭐ APENAS CARROS DISPONÍVEIS
      setCarros(listaComImagens.filter(c => c.status === "disponível"));
    } catch (err) {
      console.error("Erro ao carregar carros:", err);
    }
  };

  loadCarros();
}, []);


  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const filtrarCarros = async () => {
  try {
    const params = new URLSearchParams(filtros);
    const resp = await axios.get(`/carros/filtrar?${params.toString()}`);

    const lista = resp.data;

    const listaComImagens = await Promise.all(
      lista.map(async (carro) => {
        try {
          const json = await axios.get(`/uploads/cars/${carro.id}.json`);
          return { ...carro, imagens: json.data };
        } catch {
          return { ...carro, imagens: null };
        }
      })
    );

    // ⭐⭐⭐ APENAS CARROS DISPONÍVEIS
    setCarros(listaComImagens.filter(c => c.status === "disponível"));
  } catch (err) {
    console.error("Erro ao filtrar carros:", err);
    alert("Nenhum carro encontrado com os filtros informados.");
  }
};


  return (
    <>
      <Header backgroundColor="#010217" />
      <AuthBar />

      <section className="vitrine-container">
        <h1 className="titulo">Nossos veículos</h1>

        <div className="vitrine-conteudo">

          {/* === FILTROS === */}
          <aside className="filtros">
            <h2 className="titulo-filtro">Filtros</h2>

            <label>Marcas</label>
            <input
              type="text"
              name="marca"
              value={filtros.marca}
              onChange={handleFiltroChange}
              placeholder="Ex: Honda"
            />

            <label>Modelo</label>
            <input
              type="text"
              name="modelo"
              value={filtros.modelo}
              onChange={handleFiltroChange}
              placeholder="Ex: Civic"
            />

            <label>Ano</label>
            <div className="duplo-input">
              <input
                type="number"
                name="anoMin"
                value={filtros.anoMin}
                onChange={handleFiltroChange}
                placeholder="2012"
              />
              <input
                type="number"
                name="anoMax"
                value={filtros.anoMax}
                onChange={handleFiltroChange}
                placeholder="2024"
              />
            </div>

            <label>Valor</label>
            <div className="duplo-input">
              <input
                type="number"
                name="precoMin"
                value={filtros.precoMin}
                onChange={handleFiltroChange}
                placeholder="0"
              />
              <input
                type="number"
                name="precoMax"
                value={filtros.precoMax}
                onChange={handleFiltroChange}
                placeholder="150000"
              />
            </div>

            <label>Quilometragem</label>
            <div className="duplo-input">
              <input
                type="number"
                name="kmMin"
                value={filtros.kmMin}
                onChange={handleFiltroChange}
                placeholder="0"
              />
              <input
                type="number"
                name="kmMax"
                value={filtros.kmMax}
                onChange={handleFiltroChange}
                placeholder="230000"
              />
            </div>

            <button className="btn-filtrar" onClick={filtrarCarros}>
              Filtrar
            </button>
          </aside>

          {/* === LISTA DE CARROS === */}
          <div className="grid-carros">
            {carros.length > 0 ? (
              carros.map((carro) => {
                const imagemPrincipal = carro.imagens?.principal;
                
  // ⭐ AGORA EXISTE → verifica se esse carro está nos favoritos
  const isFavorited = favoritos.includes(carro.id);

                return (
                  <div key={carro.id} className="card">

                    {/* ⭐ BOTÃO DE FAVORITO NO CARD */}
                    {clienteId && (
                      <FavoriteButton
                        carroId={carro.id}
                        clienteId={clienteId}
                        isFavoritedDefault={isFavorited}
                      />
                    )}

                    <img
                      src={buildImagePath(imagemPrincipal)}
                      onError={handleImgError}
                      alt={carro.modelo}
                      className="imagem-carro"
                    />

                    <div className="card-info">
                      <h3>
                        <span className="marca">{carro.marca}</span>{" "}
                        <strong className="modelo">{carro.modelo}</strong>
                      </h3>

                      <p className="descricao">{carro.descricaoCar}</p>

                      <div className="detalhes">
                        <span>
                          <FaRegCalendarAlt style={{ marginRight: "10px" }} />
                          {carro.ano}
                        </span>

                        <span>
                          <IoCarOutline style={{ marginRight: "10px" }} />
                          {carro.quilometragemCar} km
                        </span>
                      </div>

                      <div className="preco">
                        <strong>
                          R${" "}
                          {parseFloat(carro.preco).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </strong>

                        <button
                          className="btn-ver"
                          onClick={() => navigate(`/anuncio/${carro.id}`)}
                        >
                          Ver mais
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Nenhum carro encontrado.</p>
            )}
          </div>
        </div>
      </section>

      <Footer backgroundColor="black" />
    </>
  );
};

export default Vitrine;
