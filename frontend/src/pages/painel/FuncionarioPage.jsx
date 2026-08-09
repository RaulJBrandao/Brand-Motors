import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Funcionarios.css";
import { FiEdit, FiTrash2, FiUserPlus} from "react-icons/fi";
import PainelHeader from "../../components/PainelHeader";
import { IoArrowBack } from "react-icons/io5";


export default function FuncionariosPage() {
  const [lista, setLista] = useState([]);
  const navigate = useNavigate();

  async function carregarFuncionarios() {
    try {
      const resp = await fetch("/funcionarios");
      const data = await resp.json();
      setLista(data);
    } catch (err) {
      console.error("Erro ao buscar funcionários:", err);
    }
  }

  async function deletarFuncionario(id) {
    if (!window.confirm("Deseja realmente excluir este funcionário?")) return;

    try {
      const token = localStorage.getItem("token");

      const resp = await fetch(`/funcionarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await resp.json();
      alert(data.mensagem);
      carregarFuncionarios();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  }

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  return (
    <>
    <PainelHeader />
    
    <div className="func-container">

        {/* 🔙 Botão de Voltar */}
      <button className="voltar-btn" onClick={() => navigate("/painel")}>
        <IoArrowBack  size={22} /> Voltar
      </button>
        
      <div className="func-header">
        <h2>Funcionários</h2>

        <button
          className="btn-add-func"
          onClick={() => navigate("/painel/funcionarios/novo")}
        >
          <FiUserPlus size={20} />
          Novo Funcionário
        </button>
      </div>

      <table className="func-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Email</th>
            <th>Cargo</th>
            <th>Salário</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((f) => (
            <tr key={f.idFuncionario}>
              <td>{f.idFuncionario}</td>
              <td>{f.nome}</td>
              <td>{f.cpf}</td>
              <td>{f.email}</td>
              <td>{f.cargo}</td>
              <td>R$ {Number(f.salario).toFixed(2)}</td>

              <td className="acoes">
                <FiEdit
                  size={20}
                  className="acao editar"
                  onClick={() => navigate(`/painel/funcionarios/editar/${f.idFuncionario}`)}
                />

                <FiTrash2
                  size={20}
                  className="acao deletar"
                  onClick={() => deletarFuncionario(f.idFuncionario)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
