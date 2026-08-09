import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/HistoricoCompras.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HistoricoComprasPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const clienteId = user?.id;

  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      try {
        const resp = await axios.get(`/history/cliente/${clienteId}`);
        setHistorico(resp.data);
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      }
    };

    carregar();
  }, [clienteId]);

  return (

    <>

    <Header backgroundColor="#010217" />
    
    <div className="historico-container">
      <h1>Histórico de Compras</h1>

      {historico.length === 0 && <p>Nenhuma compra encontrada.</p>}

      <div className="historico-lista">
        {historico.map((h, i) => {
          const item = h.data;

          return (
            <div key={i} className="historico-card">

              <img
                src={`/uploads/cars/${item.imagemPrincipal}`}
                alt="Carro comprado"
                className="historico-img"
              />

              <div className="historico-info">
                <h2>{item.modelo}</h2>

                <p><strong>Preço:</strong> R$ {Number(item.preco).toLocaleString("pt-BR")}</p>
                <p><strong>Pagamento:</strong> {item.formaPagamento}</p>

                {item.parcelas && (
                  <p><strong>Parcelas:</strong> {item.parcelas}x de R$ {item.valorParcela}</p>
                )}

                <p>
                  <strong>Data:</strong>{" "}
                  {new Date(item.dataFinalizacao).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <Footer backgroundColor="black" />
    </>
  );
};

export default HistoricoComprasPage;
