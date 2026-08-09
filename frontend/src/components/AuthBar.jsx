import React, { useState, useEffect } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import "../styles/AuthBar.css";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";

export default function AuthBar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [user, setUser] = useState(null);
  const [tipo, setTipo] = useState(null); // cliente | funcionario
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedTipo = localStorage.getItem("tipo");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedTipo) setTipo(storedTipo);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setTipo(null);
    window.location.reload();
  };

  const handleLoginSuccess = (userData, token, tipoUser) => {
    setUser(userData);
    setTipo(tipoUser);
    setShowLoginModal(false);

    if (tipoUser === "funcionario") {
      navigate("/painel");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div className="auth-bar">
        {!user ? (
          <div className="auth-buttons">
            <button
              className="auth-btn"
              onClick={() => {
                setIsLoginView(true);
                setShowLoginModal(true);
              }}
            >
              <FaRegUserCircle size={18} style={{ marginRight: 6 }} />
              Entrar
            </button>

            <button
              className="auth-btn alt"
              onClick={() => {
                setIsLoginView(false);
                setShowLoginModal(true);
              }}
            >
              Cadastrar-se
            </button>
          </div>
        ) : (
          <div className="user-bar">
            {/* BOTÃO PERFIL */}
            <button 
  className={`user-name ${tipo === "funcionario" ? "disabled-btn" : ""}`}
  onClick={() => {
    if (tipo === "cliente") {
      navigate(`/perfil/${user.id}`);
    }
  }}
>
  <FaRegUser /> {user.nome}
</button>


            {/* CLIENTE: mostrar favoritos e carrinho */}
            {tipo === "cliente" && (
              <>
                <button
                  onClick={() => navigate("/favoritos")}
                  className="user-action"
                >
                  <FiHeart />
                </button>
                <button
                  onClick={() => navigate(`/carrinho/${user.id}`)}
                  className="user-action"
                >
                  <FiShoppingCart />
                </button>
              </>
            )}

            {/* FUNCIONÁRIO: mostrar gerenciamento */}
            {tipo === "funcionario" && (
              <button
                className="user-action"
                onClick={() => navigate("/painel")}
              >
                ⚙ Gerenciamento
              </button>
            )}

            <button onClick={handleLogout} className="user-logout">
              Sair
            </button>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        isLoginView={isLoginView}
        setIsLoginView={setIsLoginView}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}
