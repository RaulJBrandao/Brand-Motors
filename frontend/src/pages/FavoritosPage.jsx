import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthBar from "../components/AuthBar";
import "../styles/FavoritosPage.css";


export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const clienteId = user?.id;

  useEffect(() => {
    async function carregar() {
      const resp = await fetch(`/clientes/${clienteId}/favoritos`);
      const data = await resp.json();

      const listaComImagens = await Promise.all(
        data.favoritos.map(async (carro) => {
          try {
            const imgJson = await fetch(`/uploads/cars/${carro.id}.json`);
            const imagens = await imgJson.json();
            return { ...carro, imagens };
          } catch {
            return { ...carro, imagens: null };
          }
        })
      );

      setFavoritos(listaComImagens || []);
    }

    if (clienteId) carregar();
  }, [clienteId]);

  const removerFavorito = async (carroId) => {
    await fetch(`/clientes/${clienteId}/favoritos/${carroId}`, {
      method: "DELETE",
    });

    // 🔥 remove imediatamente da interface
    setFavoritos((prev) => prev.filter((item) => item.id !== carroId));
  };

  return (
    <>
      <Header backgroundColor="#010217" />
      <AuthBar />

      <div className="fav-container">
        <h1>Meus Favoritos</h1>

        <div className="fav-grid">
          {favoritos.length === 0 && <p>Nenhum favorito ainda.</p>}

          {favoritos.map((carro) => (
            <div className="fav-card" key={carro.id}>
              
              <Link to={`/anuncio/${carro.id}`} className="fav-img-box">
                <img
                  src={
                    carro.imagens?.principal
                      ? `/uploads/cars/${carro.imagens.principal}`
                      : "/placeholder.png"
                  }
                  alt={carro.modelo}
                />
              </Link>

              <div className="fav-info">
                <h3>{carro.marca} {carro.modelo}</h3>

                <p className="fav-price">
                  R$ {parseFloat(carro.preco).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </p>

                <div className="fav-details">
                  <span><strong>Ano:</strong> {carro.ano}</span>
                  <span><strong>KM:</strong> {carro.quilometragemCar} km</span>
                  <span><strong>Cor:</strong> {carro.cor}</span>
                </div>

                <p className="fav-description">{carro.descricaoCar}</p>
              </div>

              <button
                className="fav-remove-btn"
                onClick={() => removerFavorito(carro.id)}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer backgroundColor="black" />
    </>
  );
}
