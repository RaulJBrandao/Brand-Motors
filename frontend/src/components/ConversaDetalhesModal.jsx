// src/components/ConversaDetalhesModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ConversaDetalhesModal.css";

export default function ConversaDetalhesModal({ conversa, onClose, onFinalizada }) {
  const [cliente, setCliente] = useState(null);
  const [carrinho, setCarrinho] = useState(null);
  const [carro, setCarro] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formaPagamento, setFormaPagamento] = useState("cartao");
  const [parcelas, setParcelas] = useState(null);
  const [valorParcela, setValorParcela] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        // conversa pode já incluir Cliente; se não incluir, buscar
        if (conversa.Cliente) setCliente(conversa.Cliente);
        else {
          const r = await axios.get(`/clientes/${conversa.clienteId}`);
          setCliente(r.data);
        }

        // buscar carrinho do cliente
        const resp = await axios.get(`/clientes/${conversa.clienteId}/carrinho`);
        const c = resp.data;
        setCarrinho(c);

        if (c && c.fk_Carros_idCar) {
          const rcar = await axios.get(`/carros/${c.fk_Carros_idCar}`);
          setCarro(rcar.data);
        } else {
          setCarro(null);
        }
      } catch (err) {
        console.error("Erro ao carregar dados da conversa:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [conversa]);

  const calcularParcelas = (preco, qtd, juros) => {
    if (!qtd || qtd <= 0) return null;
    const parcela = (preco / qtd) * (1 + juros);
    return parcela.toFixed(2);
  };

  const handleFinalizar = async () => {
    try {
      await axios.post("/compras/finalizar-compra", {
        conversaId: conversa.idConversa || conversa.id || conversa.conversaId,
        formaPagamento,
      });

      alert("Compra finalizada com sucesso.");
      if (onFinalizada) onFinalizada();
    } catch (err) {
      console.error("Erro ao finalizar compra:", err);
      alert("Erro ao finalizar compra.");
    }
  };

  if (!conversa) return null;

  return (
    <>
      <div className="cdm-overlay" onClick={onClose}></div>

      <div className="cdm-modal">
        <button className="cdm-close" onClick={onClose}>✕</button>
        <h2>Conversa #{conversa.idConversa || conversa.id || conversa.conversaId}</h2>

        {loading ? (
          <p>Carregando...</p>
        ) : (
          <>
            <section>
              <h3>Cliente</h3>
              <p><strong>Nome:</strong> {cliente?.nome}</p>
              <p><strong>Email:</strong> {cliente?.email}</p>
              <p><strong>Telefone:</strong> {cliente?.telefone}</p>
            </section>

            <section>
              <h3>Carro / Carrinho</h3>
              {carro ? (
                <>
                  <p><strong>Veículo:</strong> {carro.marca} {carro.modelo}</p>
                  <p><strong>Preço:</strong> R$ {parseFloat(carro.preco).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>

                  <div style={{ marginTop: 8 }}>
                    <label>Forma de pagamento</label>
                    <select value={formaPagamento} onChange={(e) => { setFormaPagamento(e.target.value); setParcelas(null); setValorParcela(null); }}>
                      <option value="cartao">Cartão</option>
                      <option value="financiamento">Financiamento</option>
                      <option value="pix">PIX</option>
                      <option value="boleto">Boleto</option>
                    </select>
                  </div>

                  {(formaPagamento === "cartao" || formaPagamento === "financiamento") && (
                    <div style={{ marginTop: 8 }}>
                      <label>Parcelas</label>
                      <select onChange={(e) => {
                        const qtd = Number(e.target.value);
                        setParcelas(qtd);
                        const juros = formaPagamento === "cartao" ? 0.029 : 0.015;
                        const val = calcularParcelas(carro.preco, qtd, juros);
                        setValorParcela(val);
                      }} value={parcelas || ""}>
                        <option value="">Selecione</option>
                        {Array.from({ length: formaPagamento === "cartao" ? 12 : 72 }, (_, i) => i + 1).map(p => (
                          <option key={p} value={p}>{p}x</option>
                        ))}
                      </select>
                      {valorParcela && <p>{parcelas}x de R$ {valorParcela}</p>}
                    </div>
                  )}
                </>
              ) : <p>Sem carro/carrinho vinculado.</p>}
            </section>

            <div style={{ marginTop: 16 }}>
              <button onClick={handleFinalizar} disabled={!carro}>
                Finalizar Compra (aprovar e marcar veículo como vendido)
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
