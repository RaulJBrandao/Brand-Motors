import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/MeusVeiculosPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MeusVeiculosPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const clienteId = user?.id;

  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      try {
        const resp = await axios.get(`/history/cliente/${clienteId}`);
        const aprovados = resp.data.filter(h => h.data.status === "aprovado");
        setCompras(aprovados);
      } catch (err) {
        console.error("Erro ao carregar veículos:", err);
      }
    };
    carregar();
  }, [clienteId]);

  return (
    <>
    
     <Header backgroundColor="#010217" />
    
    <div className="meusveiculos-container">
      <h1>Meus Veículos</h1>

      {compras.length === 0 && <p>Você ainda não comprou nenhum veículo.</p>}

      <div className="meusveiculos-grid">
        {compras.map((v, i) => {
          const c = v.data;
          return (
            <div key={i} className="meusveiculos-card">
              <img
                src={`/uploads/cars/${c.imagemPrincipal}`}
                alt={c.modelo}
                className="meusveiculos-img"
              />

              <h2>{c.modelo}</h2>
              <p>
                <strong>Preço pago:</strong>{" "}
                R$ {Number(c.preco).toLocaleString("pt-BR")}
              </p>
              <p>
                <strong>Data da compra:</strong>{" "}
                {new Date(c.dataFinalizacao).toLocaleDateString("pt-BR")}
              </p>
            </div>
          );
        })}
      </div>
    </div>

<Footer backgroundColor="black" />
    </>
  );
};

export default MeusVeiculosPage;
