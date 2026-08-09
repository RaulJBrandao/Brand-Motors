import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import PainelHeader from "../../../components/PainelHeader";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "./PainelVendasPage.css";

export default function PainelVendasPage() {
  const [vendas, setVendas] = useState([]);
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [totalVendas, setTotalVendas] = useState(0);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const carregarVendas = async () => {
    try {
      setLoading(true);

      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;

      const res = await axios.get("/relatorios/vendas", { params });

      setVendas(res.data.vendas);
      setTotalVendas(res.data.totalVendas);
      setReceitaTotal(res.data.receitaTotal);
    } catch (err) {
      console.error("Erro ao carregar vendas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarVendas();
  }, []);

  // EXPORTAR PDF
  const exportarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório de Vendas - Brand Motors", 14, 18);

    doc.setFontSize(11);
    doc.text(`Período: ${from || "—"} até ${to || "—"}`, 14, 28);
    doc.text(`Total de Vendas: ${totalVendas}`, 14, 36);
    doc.text(`Receita Total: R$ ${receitaTotal}`, 14, 44);

    const tabela = vendas.map((v) => [
      v.idCarr,
      v.Carro?.modelo || "-",
      v.Carro?.marca || "-",
      `R$ ${v.valorTotalCarr}`,
      new Date(v.dataCarr).toLocaleDateString("pt-BR"),
    ]);

    autoTable(doc, {
      startY: 55,
      head: [["ID", "Modelo", "Marca", "Preço", "Data"]],
      body: tabela,
    });

    doc.save("relatorio-vendas.pdf");
  };

  return (
    <>
      <PainelHeader />

      <div className="pv-container">

        {/* 🔙 Botão de Voltar */}
                      <button className="voltar-btn" onClick={() => navigate("/painel")}>
                        <IoArrowBack  size={22} /> Voltar
                      </button>

        {/* Título */}
        <div className="pv-title-row">
          <h2>Relatório de Vendas</h2>
        </div>

        {/* Filtros */}
        <div className="pv-filtros">
          <div>
            <label>De:</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>

          <div>
            <label>Até:</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>

          <button className="pv-btn" onClick={carregarVendas}>Filtrar</button>

          <button className="pv-btn export" onClick={exportarPDF}>
            Exportar PDF
          </button>
        </div>

        {/* Cards resumo */}
        <div className="pv-cards">
          <div className="pv-card">
            <h3>Total de Vendas</h3>
            <p>{totalVendas}</p>
          </div>

          <div className="pv-card">
            <h3>Receita Total</h3>
            <p>R$ {receitaTotal}</p>
          </div>
        </div>

        {/* Tabela */}
        <div className="pv-table-wrap">
          <table className="pv-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Preço</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {vendas.map((v) => (
                <tr key={v.idCarr}>
                  <td>{v.idCarr}</td>
                  <td>{v.Carro?.modelo}</td>
                  <td>{v.Carro?.marca}</td>
                  <td>R$ {v.valorTotalCarr}</td>
                  <td>{new Date(v.dataCarr).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && <p>Carregando...</p>}
        </div>
      </div>
    </>
  );
}
