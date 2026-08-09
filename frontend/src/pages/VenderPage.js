import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { BiConversation } from "react-icons/bi";
import { IoCarOutline } from "react-icons/io5";
import { GrCertificate } from "react-icons/gr";
import AuthBar from "../components/AuthBar";
import axios from "axios";
import ModalSucesso from "../components/ModalSucesso";

import "../styles/VenderPage.css"; // estilização separada

function VenderPage() {
  const user = JSON.parse(localStorage.getItem("user"));
const tipo = localStorage.getItem("tipo");
const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    veiculo: "",
    nome: "",
    celular: "",
    whatsapp: false,
    email: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validações de login antes de enviar
  if (!user) {
    alert("Você precisa estar logado para enviar a solicitação.");
    return;
  }

  if (tipo !== "cliente") {
    alert("Apenas clientes podem enviar solicitações de venda.");
    return;
  }
  
  try {
    const response = await fetch("/vender/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        clienteId: user.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar formulário");
    }

    setShowModal(true); // abrir modal de sucesso
    setFormData({
      veiculo: "",
      nome: "",
      celular: "",
      whatsapp: false,
      email: "",
    });

  } catch (err) {
    console.error(err);
    alert("Erro ao enviar solicitação.");
  }
};


 
  return (
    <>
      <Header backgroundColor="#010217" />
      <AuthBar />
      
      {showModal && <ModalSucesso onClose={() => setShowModal(false)} />}

      <main className="vender-page">

        {/* Container lado a lado */}
        <div className="vender-container">
          {/* Formulário - lado esquerdo */}
          <section className="form-section">
            <h2>Quer vender seu veículo?</h2>
            <h3>Solicite a avaliação agora!</h3>

            <form className="vender-form" onSubmit={handleSubmit}>
              <label>
                <h4>DADOS DO VEÍCULO</h4>
                <input
                  type="text"
                  name="veiculo"
                  placeholder="Ex: Gol 2018"
                  value={formData.veiculo}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <h4>DADOS DO CONTATO</h4>
                <strong>Seu nome</strong>
                <input
                  type="text"
                  name="nome"
                  placeholder="Digite seu nome..."
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <strong>Seu celular</strong>
                <div className="celular-wrapper">
                  <input
                    type="text"
                    name="celular"
                    placeholder="Digite seu celular..."
                    value={formData.celular}
                    onChange={handleChange}
                    required
                  />
                  <label className="whatsapp-label">
                    <input
                      type="checkbox"
                      name="whatsapp"
                      checked={formData.whatsapp}
                      onChange={handleChange}
                    
                    />
                    Whatsapp
                  </label>
                </div>
              </label>

              <label>
                <strong>Seu e-mail</strong>
                <input
                  type="email"
                  name="email"
                  placeholder="Digite seu e-mail..."
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <button type="submit" className="btn-enviar">
                Enviar
              </button>
            </form>
          </section>

          {/* Próximos Passos - lado direito */}
          <section className="steps-section">
            <h3>Quais são os próximos passos?</h3>
            <ul>
              <li><BiConversation style={{ fontSize: '40px', paddingRight: '15px'}}/>

Entramos em contato</li>
              <li><IoCarOutline style={{ fontSize: '40px', paddingRight: '15px'}}/>
Avaliamos seu veículo</li>
              <li><GrCertificate style={{ fontSize: '40px', paddingRight: '15px'}}/>
Fechamos negócio</li>
            </ul>
          </section>
        </div>

        {/* Sessão dos tipos de venda */}
        <section className="options-section">
          <h2>Quer vender seu veículo?</h2>
          <div className="options-grid">
            <div className="option-card">
              <h1>01</h1>
              <h2>VENDA NA HORA!</h2>
              <p>Compramos seu veículo e pagamos à vista. Simples assim.</p>
            </div>
            <div className="option-card">
            <h1>02</h1>
              <h2>TROCA NA TROCA</h2>
              <p>
                Troque seu carro por outro de maior ou menor valor. Ajustamos a diferença.
              </p>
            </div>
            <div className="option-card">
              <h1>03</h1>
              <h2>CONSIGNAÇÃO</h2>
              <p>
                Anunciamos seu carro, passamos propostas e você recebe à vista quando vender.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer backgroundColor="black" />
    </>
  )
}

export default VenderPage;
