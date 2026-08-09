import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PainelHeader from "../../../components/PainelHeader";
import { IoArrowBack } from "react-icons/io5";

export default function ClienteConsulta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    async function buscar() {
      const resp = await fetch(`/clientes/${id}`);
      const dados = await resp.json();
      setCliente(dados);
    }
    buscar();
  }, [id]);

  if (!cliente) return <p>Carregando...</p>;

  return (
    <>
      <PainelHeader />

      <div style={{ padding: "40px" }}>
        {/* 🔙 Botão de Voltar */}
                      <button className="voltar-btn" onClick={() => navigate("/painel/clientes")}>
                        <IoArrowBack  size={22} /> Voltar
                      </button>

        <h2>Detalhes do Cliente</h2>

        <div className="detalhes-box">
          <p><b>ID:</b> {cliente.id}</p>
          <p><b>Nome:</b> {cliente.nome}</p>
          <p><b>Email:</b> {cliente.email}</p>
          <p><b>Telefone:</b> {cliente.telefone ? cliente.telefone : "Não informado"}</p>
          <p><b>RG:</b> {cliente.rg ? cliente.rg : "Não informado"}</p>
          <p><b>Endereço:</b>  
            {cliente.endereco ? cliente.endereco : "Não informado"}
          </p>

        </div>
      </div>
    </>
  );
}
