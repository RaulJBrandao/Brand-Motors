import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiTrash2, FiEye } from "react-icons/fi";
import { IoArrowBack } from "react-icons/io5";
import PainelHeader from "../../../components/PainelHeader";
import "./ClientesPage.css";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState({ coluna: "id", asc: true });
  const funcionario = JSON.parse(localStorage.getItem("user"));
const podeExcluir = funcionario && funcionario.cargo === "Gerente";

  const navigate = useNavigate();

  async function carregarClientes() {
    try {
      const resp = await fetch("/clientes");
      const dados = await resp.json();
      setClientes(dados);
    } catch (e) {
      console.error("Erro ao carregar clientes:", e);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function ordenar(coluna) {
    const asc = ordem.coluna === coluna ? !ordem.asc : true;

    const ordenados = [...clientes].sort((a, b) => {
      const x = a[coluna] ?? "";
      const y = b[coluna] ?? "";

      if (x < y) return asc ? -1 : 1;
      if (x > y) return asc ? 1 : -1;
      return 0;
    });

    setClientes(ordenados);
    setOrdem({ coluna, asc });
  }

  async function excluirCliente(id) {
  if (!podeExcluir) {
    alert("Apenas o gerente pode excluir clientes.");
    return;
  }

  if (!window.confirm("Deseja realmente excluir este cliente?")) return;

  try {
    await fetch(`/clientes/${id}`, { method: "DELETE" });
    carregarClientes();
  } catch (e) {
    console.error("Erro ao excluir:", e);
  }
}


  const clientesFiltrados = clientes.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      (c.nome || "").toLowerCase().includes(termo) ||
      (c.email || "").toLowerCase().includes(termo) ||
      (c.rg || "").toLowerCase().includes(termo) ||
      (c.telefone || "").toLowerCase().includes(termo)
    );
  });

  return (
    <>
      <PainelHeader />

      <div className="container-gerenciamento">
        {/* 🔙 Botão de Voltar */}
                      <button className="voltar-btn" onClick={() => navigate("/painel")}>
                        <IoArrowBack  size={22} /> Voltar
                      </button>

        <h2 className="titulo-gerenciamento">Gerenciamento de Clientes</h2>

        {/* CAMPO DE BUSCA */}
        <div className="busca-wrapper">
          <FiSearch size={18} />
          <input
            type="text"
            placeholder="Buscar cliente por nome, email, RG ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="tabela-gerenciamento">
          <thead>
            <tr>
              <th onClick={() => ordenar("id")}>ID</th>
              <th onClick={() => ordenar("nome")}>Nome</th>
              <th onClick={() => ordenar("email")}>Email</th>
              <th onClick={() => ordenar("rg")}>RG</th>
              <th onClick={() => ordenar("telefone")}>Telefone</th>
              <th style={{ textAlign: "center" }}>Ações</th>
            </tr>
          </thead>

          <tbody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cli) => (
                <tr key={cli.id}>
                  <td>{cli.id}</td>
                  <td>{cli.nome}</td>
                  <td>{cli.email}</td>
                  <td>{cli.rg}</td>
                  <td>{cli.telefone}</td>

                  <td className="acoes">
                    <Link to={`/painel/clientes/consulta/${cli.id}`}>
                      <FiEye className="icon-consulta" title="Consultar" />
                    </Link>

                    {podeExcluir ? (
  <FiTrash2
    className="icon-delete"
    title="Excluir"
    onClick={() => excluirCliente(cli.id)}
  />
) : (
  <FiTrash2
    className="icon-delete disabled"
    title="Apenas o gerente pode excluir"
    onClick={() => alert("Apenas o gerente pode excluir clientes.")}
  />
)}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
