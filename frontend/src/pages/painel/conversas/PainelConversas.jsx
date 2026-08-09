// src/pages/painel/conversas/PainelConversas.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PainelConversas.css";
import PainelHeader from "../../../components/PainelHeader";
import ConversaDetalhesModal from "../../../components/ConversaDetalhesModal";
import { useNavigate } from "react-router-dom";

export default function PainelConversas() {
  const navigate = useNavigate();
  const funcionarioLogado = JSON.parse(localStorage.getItem("user")) || null;

  const [conversas, setConversas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [selecionada, setSelecionada] = useState(null);

  useEffect(() => {
    fetchConversas();
  }, []);

  const fetchConversas = async () => {
    try {
      setLoading(true);

      const resp = await axios.get("/conversas");
      let lista = resp.data || [];

      console.log("🎯 Conversas recebidas no front:", lista);

      // =============================
      // FILTRO POR TIPO DE FUNCIONÁRIO
      // =============================
      if (funcionarioLogado) {

        // Secretário vê somente conversas atendidas por outros secretários
        if (funcionarioLogado.cargo === "Secretário") {
          lista = lista.filter(
            (c) => c.Funcionario && c.Funcionario.cargo === "Secretário"
          );

        // Mecânico/outros vêem somente suas conversas
        } else {
          lista = lista.filter(
            (c) => c.funcionarioId === funcionarioLogado.idFuncionario
          );
        }
      }

      setConversas(lista);

    } catch (err) {
      console.error("Erro ao buscar conversas:", err);
      setConversas([]);
    } finally {
      setLoading(false);
    }
  };

  const abrirConversa = (conversa) => {
    setSelecionada(conversa);
  };

  const fecharModal = () => {
    setSelecionada(null);
    fetchConversas();
  };

  return (
    <>
      <PainelHeader />

      <div className="painel-page">

        <div className="painel-title-row">
          <h2>Conversas</h2>
          <button onClick={() => navigate(-1)}>Voltar</button>
        </div>

        {/* Campo de busca */}
        <div className="painel-controls">
          <input
            placeholder="Buscar por cliente..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="painel-table-wrap">
          {loading ? (
            <p>Carregando conversas...</p>
          ) : conversas.length === 0 ? (
            <p>Nenhuma conversa encontrada.</p>
          ) : (
            <table className="painel-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Funcionário</th>
                 
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {conversas
                  .filter((c) =>
                    !filtro ||
                    (c.Cliente &&
                      c.Cliente.nome &&
                      c.Cliente.nome
                        .toLowerCase()
                        .includes(filtro.toLowerCase()))
                  )
                  .map((c) => (
                    <tr key={c.idConversa}>

                      <td>{c.idConversa}</td>

                      <td>
                        {c.Cliente ? c.Cliente.nome : `#${c.clienteId}`}
                      </td>

                      <td>
                        {c.Funcionario
                          ? c.Funcionario.nome
                          : `#${c.funcionarioId}`}
                      </td>

                    

                      <td>
                        <button onClick={() => abrirConversa(c)}>
                          Abrir
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selecionada && (
        <ConversaDetalhesModal
          conversa={selecionada}
          onClose={fecharModal}
          onFinalizada={fecharModal}
        />
      )}
    </>
  );
}
