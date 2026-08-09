import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthBar from "../components/AuthBar";
import "../styles/Agendamento.css";
import { useNavigate } from "react-router-dom";

export default function Agendamento() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    data: "",
    hora: "",
    veiculo: "",
    servicoId: "",
    funcionarioId: ""
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setMensagem("Agendamento realizado com sucesso!");

  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await fetch("http://localhost:3001/agendamentos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId: user?.id,
        ...form,
      }),
    });

  } catch (err) {
  }
};

  return (
    <>
      <Header backgroundColor="#010217" />
      <AuthBar />

      <div className="agendamento-wrapper">
        <h2>Agendar Serviço</h2>

        {/* MENSAGEM DE SUCESSO */}
        {mensagem && <p className="msg-sucesso">{mensagem}</p>}

        <form className="agendamento-form" onSubmit={handleSubmit}>
          <label>Data:</label>
          <input type="date" name="data" onChange={handleChange} required />

          <label>Horário:</label>
          <input type="time" name="hora" onChange={handleChange} required />

          <label>Veículo:</label>
          <input
            type="text"
            name="veiculo"
            placeholder="Ex: Honda Civic 2018"
            onChange={handleChange}
            required
          />
            
            <label>Serviço:</label>
                <select name="servicoId" onChange={handleChange} required>
                    <option value="">Selecione um serviço</option>
                    <option value="1">Troca de Óleo</option>
                    <option value="2">Revisão</option>
                    <option value="3">Alinhamento</option>
                    <option value="4">Balanceamento</option>
                    <option value="5">Test-Drive</option>
                </select>

            <label>Funcionário:</label>
                <select name="funcionarioId" onChange={handleChange} required>
                    <option value="">Selecione um funcionário</option>
                    <option value="1">João</option>
                    <option value="2">Lucas</option>
                    <option value="3">Matheus</option>
                </select>

          <button type="submit" className="btn-agendar">
            Confirmar Agendamento
          </button>
        </form>
      </div>

      <Footer backgroundColor="black" />
    </>
  );
}