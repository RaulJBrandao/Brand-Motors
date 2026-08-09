import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthBar from "../components/AuthBar";
import "../styles/Carrinho.css";

import ModalConfirmarCompra from "../components/ModalConfirmarCompra";
import ModalSucesso from "../components/ModalSucesso";

export default function Carrinho() {
  const { id } = useParams();

  const [carro, setCarro] = useState(null);
  const [carrinho, setCarrinho] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formaPagamento, setFormaPagamento] = useState("");
  const [parcelas, setParcelas] = useState(null);
  const [valorParcela, setValorParcela] = useState(null);

  const [modalCompraOpen, setModalCompraOpen] = useState(false);
  const [modalSucessoOpen, setModalSucessoOpen] = useState(false);

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

  const calcularParcelas = (preco, qtdParcelas, juros) => {
    const p = Number(preco) || 0;
    const parcela = (p / qtdParcelas) * (1 + juros);
    return parcela.toFixed(2);
  };

  // ================================
  // BUSCAR CARRINHO + VEÍCULO
  // ================================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.id !== parseInt(id)) {
      window.location.href = "/";
      return;
    }

    const fetchCarrinho = async () => {
      try {
        const respCarrinho = await axios.get(`/clientes/${id}/carrinho`);

        setCarrinho(respCarrinho.data);

        if (!respCarrinho.data) {
          setCarro(null);
          setLoading(false);
          return;
        }

        const respCarro = await axios.get(
          `/carros/${respCarrinho.data.fk_Carros_idCar}`
        );

        const carroCompleto = respCarro.data;

        // evitar null em imagens
        carroCompleto.imagens = null;

        try {
          const jsonResp = await axios.get(`/uploads/cars/${carroCompleto.id}.json`);
          carroCompleto.imagens = jsonResp.data || null;
        } catch (e) {
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

  if (loading) return <p className="loading">Carregando...</p>;

  const imagemPrincipal =
    carro?.imagens?.principal
      ? buildImagePath(carro.imagens.principal)
      : PLACEHOLDER;

  const parcelasCartao = Array.from({ length: 12 }, (_, i) => i + 1);
  const parcelasFinanciamento = Array.from({ length: 72 }, (_, i) => i + 1);

  return (
    <>
      <Header backgroundColor="#010217" />
      <AuthBar />

      <div className="carrinho-container">
        {/* ESQUERDA */}
        <div className="carrinho-resumo">
          <h2>Resumo da compra</h2>

          <div className="linha">
            <span>Preço total</span>
            <span>
              R$
              {carro?.preco
                ? Number(carro.preco).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })
                : "0,00"}
            </span>
          </div>

          <hr />

          <div className="pagamento-box">
            <label>Seu pagamento</label>
            <select
              value={formaPagamento}
              onChange={(e) => {
                setFormaPagamento(e.target.value);
                setParcelas(null);
                setValorParcela(null);
              }}
            >
              <option value="">Selecione</option>
              <option value="cartao">Cartão de Crédito</option>
              <option value="boleto">Boleto</option>
              <option value="pix">PIX</option>
              <option value="financiamento">Financiamento</option>
            </select>
          </div>

          {formaPagamento &&
            (formaPagamento === "cartao" || formaPagamento === "financiamento") && (
              <div className="parcelas-box">
                <label>Parcelamento</label>

                <select
                  value={parcelas || ""}
                  onChange={(e) => {
                    const qtd = parseInt(e.target.value);
                    setParcelas(qtd);

                    const juros = formaPagamento === "cartao" ? 0.029 : 0.015;
                    setValorParcela(calcularParcelas(carro.preco, qtd, juros));
                  }}
                >
                  <option value="">Selecione</option>

                  {(formaPagamento === "cartao"
                    ? parcelasCartao
                    : parcelasFinanciamento
                  ).map((p) => (
                    <option key={p} value={p}>
                      {p}x
                    </option>
                  ))}
                </select>

                {valorParcela && (
                  <p className="parcelas-info">
                    {parcelas}x de <strong>R$ {valorParcela}</strong>
                  </p>
                )}
              </div>
            )}

          <button
            className="btn-confirmar"
            disabled={!formaPagamento}
            onClick={() => setModalCompraOpen(true)}
          >
            Confirmar Compra
          </button>
        </div>

        {/* DIREITA */}
        <div>
          {carro && (
            <>
              <div className="carrinho-item">
                <img className="carrinho-img" src={imagemPrincipal} alt="Carro" />
                <div className="carrinho-info">
                  <h3>
                    {carro.marca} {carro.modelo}
                  </h3>
                  <p className="preco">
                    R$
                    {Number(carro.preco).toLocaleString("pt-BR")}
                  </p>
                  <p>
                    <strong>Ano:</strong> {carro.ano}
                  </p>
                  <p>
                    <strong>Cor:</strong> {carro.cor}
                  </p>
                </div>
              </div>

              <button
                className="btn-remover"
                onClick={async () => {
                  const resp = await axios.get(`/clientes/${id}/carrinho`);
                  await axios.delete(`/carrinhos/${resp.data.idCarr}`);
                  window.location.reload();
                }}
              >
                Remover do carrinho
              </button>
            </>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalCompraOpen && (
        <ModalConfirmarCompra
          isOpen={modalCompraOpen}
          carro={{
            id: carro.id,
            marca: carro.marca,
            modelo: carro.modelo,
            preco: carro.preco,
          }}
          formaPagamento={formaPagamento}
          parcelas={parcelas}
          valorParcela={valorParcela}
          idCarr={carrinho?.idCarr}
          onClose={() => setModalCompraOpen(false)}
          onSuccess={() => {
            setModalCompraOpen(false);
            setModalSucessoOpen(true);
          }}
        />
      )}

      {modalSucessoOpen && (
        <ModalSucesso onClose={() => setModalSucessoOpen(false)} />
      )}

      <Footer backgroundColor="black" />
    </>
  );
}
