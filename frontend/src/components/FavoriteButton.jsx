import React, { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import "../styles/FavoriteButton.css";

export default function FavoriteButton({ carroId, clienteId, isFavoritedDefault = false }) {
  const [favorited, setFavorited] = useState(isFavoritedDefault);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Se o status de favorito vier do backend, sincroniza o estado local
    setFavorited(isFavoritedDefault);
  }, [isFavoritedDefault]);

  const toggleFavorite = async () => {
    if (!clienteId) {
      alert("Você precisa estar logado para favoritar um veículo!");
      return;
    }

    setLoading(true);

    try {
      if (!favorited) {
        // ADICIONAR FAVORITO
        const resp = await fetch(`/clientes/${clienteId}/favoritos/${carroId}`, {
          method: "POST",
        });

        if (resp.ok) {
          setFavorited(true);
        }
      } else {
        // REMOVER FAVORITO
        const resp = await fetch(`/clientes/${clienteId}/favoritos/${carroId}`, {
          method: "DELETE",
        });

        if (resp.ok) {
          setFavorited(false);
        }
      }
    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
      alert("Erro ao favoritar o veículo.");
    }

    setLoading(false);
  };

  return (
    <button
      className="fav-btn"
      disabled={loading}
      onClick={toggleFavorite}
      title={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      {favorited ? (
        <FaHeart className="fav-icon active" />
      ) : (
        <FiHeart className="fav-icon" />
      )}
    </button>
  );
}
