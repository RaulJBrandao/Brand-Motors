import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ModalConfirmarCompra.css";

export default function ModalConfirmarCompra({
  isOpen,
  onClose,
  carro,
  formaPagamento,
  parcelas,
  valorParcela,
  onSuccess,
  idCarr,
  fromAnuncio = false // << indica se veio da anuncioPage
}) {
  const [cliente, setCliente] = useState(null);

  // estados locais (usados somente quando vem da página de anúncio)
  const [fpLocal, setFpLocal] = useState("");
  const [parcelasLocal, setParcelasLocal] = useState(null);
  const [valorParcelaLocal, setValorParcelaLocal] = useState(null);

  const [step, setStep] = useState(1);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) setCliente(stored);

    // se veio do carrinho, já preencher os valores existentes
    if (!fromAnuncio) {
      setFpLocal(formaPagamento);
      setParcelasLocal(parcelas);
      setValorParcelaLocal(valorParcela);
    }
  }, [fromAnuncio, formaPagamento, parcelas, valorParcela]);

  if (!isOpen || !cliente) return null;

  const calcularParcelas = (preco, qtd, juros) => {
    return ((preco / qtd) * (1 + juros)).toFixed(2);
  };

  const finalizarCompra = async () => {
    try {
      await axios.post("/compras/enviar-compra", {
        clienteId: cliente.id,
        nomeCliente: cliente.nome,
        emailCliente: cliente.email,
        telefoneCliente: cliente.telefone,

        carroId: carro.id,
        nomeCarro: `${carro.marca} ${carro.modelo}`,
        preco: carro.preco,

        // se vier da anúncio page usa os valores escolhidos ali
        formaPagamento: fromAnuncio ? fpLocal : formaPagamento,
        parcelas: fromAnuncio ? parcelasLocal : parcelas,
        valorParcela: fromAnuncio ? valorParcelaLocal : valorParcela,

        idCarr
      });

      onSuccess();
    } catch (err) {
      console.error("Erro ao enviar compra:", err);
      alert("Erro ao enviar solicitação de compra.");
    }
  };

  return (
    <>
      <div className="mc-overlay" onClick={onClose}></div>

      <div className="mc-modal">
        <button className="mc-close-btn" onClick={onClose}>✕</button>
        <h2 className="mc-title">Confirmar Compra</h2>

        {/* STEP 1 - DADOS DO CLIENTE */}
        {step === 1 && (
          <>
            <div className="mc-section">
              <h3>Seus Dados</h3>

              <div className="mc-field">
                <label>Nome:</label>
                <input type="text" value={cliente.nome} disabled />
              </div>

              <div className="mc-field">
                <label>Email:</label>
                <input type="text" value={cliente.email} disabled />
              </div>

              <div className="mc-field">
                <label>Telefone:</label>
                <input type="text" value={cliente.telefone || ""} disabled />
              </div>

              <div className="mc-field">
                <label>Endereço:</label>
                <input type="text" value={cliente.endereco || ""} disabled />
              </div>
            </div>

            <button className="mc-button" onClick={() => setStep(2)}>
              Continuar
            </button>
          </>
        )}

        {/* STEP 2 - DETALHES + PAGAMENTO */}
        {step === 2 && (
          <>
            <div className="mc-section">
              <h3>Detalhes da Compra</h3>

              <p><strong>Veículo:</strong> {carro.marca} {carro.modelo}</p>

              {/* =============================
                  SE VEIO DA ANUNCIOPAGE 
                  MOSTRA A ESCOLHA DE PAGAMENTO
              ============================== */}
              {fromAnuncio ? (
                <>
                  {/* Forma de Pagamento */}
                  <div className="mc-field">
                    <label>Forma de Pagamento:</label>
                    <select
                      value={fpLocal}
                      onChange={(e) => {
                        setFpLocal(e.target.value);
                        setParcelasLocal(null);
                        setValorParcelaLocal(null);
                      }}
                    >
                      <option value="">Selecione</option>
                      <option value="cartao">Cartão de Crédito</option>
                      <option value="boleto">Boleto</option>
                      <option value="pix">PIX</option>
                      <option value="financiamento">Financiamento</option>
                    </select>
                  </div>

                  {/* Parcelas */}
                  {(fpLocal === "cartao" || fpLocal === "financiamento") && (
                    <div className="mc-field">
                      <label>Parcelamento:</label>
                      <select
                        value={parcelasLocal || ""}
                        onChange={(e) => {
                          const qtd = Number(e.target.value);
                          setParcelasLocal(qtd);

                          const juros = fpLocal === "cartao" ? 0.029 : 0.015;
                          const valor = calcularParcelas(carro.preco, qtd, juros);
                          setValorParcelaLocal(valor);
                        }}
                      >
                        <option value="">Selecione</option>

                        {Array.from(
                          {
                            length: fpLocal === "cartao" ? 12 : 72
                          },
                          (_, i) => i + 1
                        ).map((p) => (
                          <option key={p} value={p}>{p}x</option>
                        ))}
                      </select>

                      {valorParcelaLocal && (
                        <p><strong>{parcelasLocal}x</strong> de <strong>R$ {valorParcelaLocal}</strong></p>
                      )}
                    </div>
                  )}

                  {fpLocal === "pix" && <p>Pagamento instantâneo via PIX.</p>}
                  {fpLocal === "boleto" && <p>Boleto será enviado ao seu email.</p>}
                </>
              ) : (
                // =============================
                // SE VEIO DO CARRINHO
                // =============================
                <>
                  <p><strong>Forma de Pagamento:</strong> {formaPagamento.toUpperCase()}</p>

                  {(formaPagamento === "cartao" || formaPagamento === "financiamento") && (
                    <p><strong>Parcelas:</strong> {parcelas}x de R$ {valorParcela}</p>
                  )}

                  {formaPagamento === "pix" && <p>Pagamento instantâneo via PIX.</p>}
                  {formaPagamento === "boleto" && <p>Boleto será enviado para seu e-mail.</p>}
                </>
              )}

            </div>

            <div className="mc-buttons-row">
              <button className="mc-button secondary" onClick={() => setStep(1)}>
                Voltar
              </button>

              <button className="mc-button" onClick={finalizarCompra}>
                Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
