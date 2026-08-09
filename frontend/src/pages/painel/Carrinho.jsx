import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Carrinho.css";

export default function CarrinhoPage() {
  const { id } = useParams(); // id do cliente
  const [carro, setCarro] = useState(null); // apenas 1 carro
  const [loading, setLoading] = useState(true);
  const [formaPagamento, setFormaPagamento] = useState("");

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

  // ==========================
  //    BUSCAR O CARRINHO
  // ==========================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.id !== parseInt(id)) {
      alert("Acesso negado. Faça login para visualizar seu carrinho.");
      window.location.href = "/";
      return;
    }

    const fetchCarrinho = async () => {
  try {
    // 1. busca o carrinho do cliente
    const respCarrinho = await axios.get(`/clientes/${id}/carrinho`);
    const carrinho = respCarrinho.data;

    if (!carrinho) {
      setCarro(null);
      setLoading(false);
      return;
    }

    // 2. busca o carro referente ao carrinho
    const respCarro = await axios.get(`/carros/${carrinho.fk_Carros_idCar}`);
    const carroCompleto = respCarro.data;

    // 3. busca as imagens JSON
    try {
      const jsonResp = await axios.get(`/uploads/cars/${carroCompleto.id}.json`);
      carroCompleto.imagens = jsonResp.data;
    } catch {
      carroCompleto.imagens = null;
    }

    setCarro(carroCompleto);
  } catch (err) {
    console.error("Erro ao carregar carrinho:", err);
  } finally {
    setLoading(false);
  }
};


    fetchCarrinho();
  }, [id]);

  if (loading) return <p className="loading">Carregando carrinho...</p>;

  const imagemPrincipal = carro?.imagens?.principal
    ? buildImagePath(carro.imagens.principal)
    : PLACEHOLDER;

  return (
    <>
      <Header backgroundColor="#010217" />

      <div className="carrinho-container">
        <h1>Meu Carrinho</h1>

        {!carro ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <div className="carrinho-item">
            <img
              src={imagemPrincipal}
              alt="Veículo"
              className="carrinho-img"
              onError={(e) => (e.target.src = PLACEHOLDER)}
            />

            <div className="carrinho-info">
              <h3>{carro.marca} {carro.modelo}</h3>

              <p className="preco">
                R$ {parseFloat(carro.preco).toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </p>

              <p><strong>Ano:</strong> {carro.ano}</p>
              <p><strong>Cor:</strong> {carro.cor}</p>
            </div>
          </div>
        )}

        {carro && (
          <div className="carrinho-finalizacao">
            <h3>Escolha a forma de pagamento</h3>

            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
            >
              <option value="">Selecione</option>
              <option value="cartao">Cartão de Crédito</option>
              <option value="boleto">Boleto Bancário</option>
              <option value="pix">PIX</option>
              <option value="financiamento">Financiamento</option>
            </select>

            <button className="btn-confirmar">Confirmar Compra</button>
          </div>
        )}
      </div>

      <Footer backgroundColor="black" />
    </>
  );
}
