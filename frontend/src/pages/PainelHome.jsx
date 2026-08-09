// src/pages/PainelHome.jsx

import React from "react";
import "../styles/PainelHome.css";
import PanelCard from "../components/PainelCard";
import PainelHeader from "../components/PainelHeader";

import { FaCarSide } from "react-icons/fa";
import { GiAutoRepair } from "react-icons/gi";
import { FaClipboardList } from "react-icons/fa";
import { FaUserFriends } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaComments } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";
import { FaMoneyBillWave } from "react-icons/fa";

import logoBranca from "../assets/brandmech/bmech_serv/brancmechlogowhite.png";
import { useNavigate } from "react-router-dom";

export default function PainelHome() {
  const navigate = useNavigate();

  // 🔥 Aqui está o funcionário salvo no login
  const funcionario = JSON.parse(localStorage.getItem("user"));

  // Verificação de permissão (Gerente ou Secretário)
  const podeAcessarFuncionarios =
    funcionario &&
    ["Gerente", "Secretário"].includes(funcionario.cargo);

  return (
    <>
      <PainelHeader />

      <div className="painel-container">

        {/* LOGO + TÍTULO */}
        <div className="painel-header">
          <img src={logoBranca} alt="Brand Mech" className="painel-logo" />
          <h2 className="painel-welcome">Bem Vindo à Brand Mech</h2>
          <h3 className="painel-user">{funcionario?.nome}</h3>
        </div>

        {/* GRID DE CARDS */}
        <div className="painel-grid">

          <PanelCard
            icon={FaCarSide}
            label="Veículos"
            onClick={() => navigate("/painel/veiculos")}
          />

          <PanelCard
            icon={GiAutoRepair}
            label="Serviços"
            onClick={() => navigate("/painel/servicos")}
          />

          <PanelCard
            icon={FaClipboardList}
            label="Processos"
            onClick={() => navigate("/painel/processos")}
          />

          <PanelCard
            icon={FaCalendarAlt}
            label="Agendamentos"
            onClick={() => navigate("/painel/agendamentos")}
          />

          <PanelCard
            icon={FaUserFriends}
            label="Clientes"
            onClick={() => navigate("/painel/clientes")}
          />

          {/* CARD RESTRITO */}
          <PanelCard
            icon={FaUserTie}
            label="Funcionários"
            disabled={!podeAcessarFuncionarios}
            onClick={() => {
              if (podeAcessarFuncionarios) {
                navigate("/painel/funcionarios");
              } else {
                alert("Acesso restrito: apenas Gerente ou Secretário podem acessar esta área.");
              }
            }}
          />

          <PanelCard
            icon={FaComments}
            label="Conversas"
            onClick={() => navigate("/painel/conversas")}
          />

          <PanelCard
            icon={FaMoneyBillWave}
            label="Vendas"
            onClick={() => navigate("/painel/vendas")}
          />

        </div>
      </div>
    </>
  );
}
