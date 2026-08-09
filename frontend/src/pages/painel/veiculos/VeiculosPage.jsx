import React, { useEffect, useState } from "react";
import "./veiculo.css";
import { FaEdit, FaTrash, FaPlus} from "react-icons/fa";
import PainelHeader from "../../../components/PainelHeader";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState([]);
  const navigate = useNavigate();

  // 🔥 Pega o funcionário logado
  const funcionario = JSON.parse(localStorage.getItem("user"));

  // 🔒 Permissões
  const podeGerenciar = funcionario && ["Gerente", "Secretário"].includes(funcionario.cargo);
  const podeExcluir = funcionario && funcionario.cargo === "Gerente";


  const carregar = async () => {
    const resp = await fetch("/carros");
    const dados = await resp.json();
    setVeiculos(dados);
  };

  const excluir = async (id) => {
    if (!window.confirm("Deseja realmente excluir este veículo?")) return;

    await fetch(`/carros/${id}`, { method: "DELETE" });
    carregar();
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <>
     <PainelHeader />
    <div className="func-container">
      <div className="func-header">
        {/* 🔙 Botão de Voltar */}
              <button className="voltar-btn" onClick={() => navigate("/painel")}>
                <IoArrowBack  size={22} /> Voltar
              </button>
        <h2>Gerenciamento de Veículos</h2>

        {/* ➕ Botão de adicionar veículo só aparece para quem pode */}
          {podeGerenciar && (
            <button
              className="btn-add"
              onClick={() => navigate("/painel/veiculos/novo")}
            >
              <FaPlus /> Novo Veículo
            </button>
          )}
      </div>

      <table className="func-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Ano</th>
            <th>Preço</th>
            <th>Status</th>
            <th>Chassi</th>
            <th>Placa</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {veiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.modelo}</td>
              <td>{v.marca}</td>
              <td>{v.ano}</td>
              <td>R$ {parseFloat(v.preco).toLocaleString()}</td>
              <td>{v.status}</td>
              <td>{v.numeroChassiCar}</td>
              <td>{v.numeroPlacaCar}</td>

              <td className="acoes">
                {/* ✏ EDITAR */}
  {podeGerenciar ? (
    <FaEdit
      className="icon-edit"
      onClick={() => navigate(`/painel/veiculos/editar/${v.id}`)}
    />
  ) : (
    <span
      className="icon-wrapper"
      onClick={() => alert("Acesso negado: apenas Gerente ou Secretário podem editar veículos.")}
    >
      <FaEdit className="icon-edit icon-disabled" />
      <span className="tooltip">Sem permissão</span>
    </span>
  )}

  {/* 🗑 EXCLUIR */}
  {podeExcluir ? (
    <FaTrash
      className="icon-delete"
      onClick={() => excluir(v.id)}
    />
  ) : (
    <span
      className="icon-wrapper"
      onClick={() => alert("Acesso negado: apenas o Gerente pode excluir veículos.")}
    >
      <FaTrash className="icon-delete icon-disabled" />
      <span className="tooltip">Sem permissão</span>
    </span>
  )}

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
