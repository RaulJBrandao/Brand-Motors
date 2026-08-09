import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthBar from "../components/AuthBar";
import axios from "axios";
import "../styles/EditarPerfil.css";

export default function EditarPerfil() {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    telefone: "",
    rg: "",
    dataNascimento: "",
    endereco: ""
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser(stored);
      setForm({
        telefone: stored.telefone || "",
        rg: stored.rg || "",
        dataNascimento: stored.dataNascimento || "",
        endereco: stored.endereco || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
  // ⭐ VALIDAR TELEFONE
  const telRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

  if (form.telefone && !telRegex.test(form.telefone)) {
    alert("Telefone inválido! Use formatos como:\n11 98765-4321 ou (11)987654321");
    return;
  }

  // ⭐ VALIDAR RG
  const rgRegex = /^\d{1,2}\.?\d{3}\.?\d{3}-?\d{1}$/;

  if (form.rg && !rgRegex.test(form.rg)) {
    alert("RG inválido! Formatos aceitos:\n12345678 ou 12.345.678-9");
    return;
  }

  try {
    await axios.put(`/clientes/${user.id}`, form);

    const updatedUser = {
      ...user,
      telefone: form.telefone,
      rg: form.rg,
      dataNascimento: form.dataNascimento,
      endereco: form.endereco
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Dados atualizados com sucesso!");
    window.history.back();

  } catch (err) {
    console.error(err);
    alert("Erro ao atualizar dados");
  }
};



  if (!user) return <h2>Carregando...</h2>;

  return (
    <>
      <Header backgroundColor="#010217" />
      <AuthBar />

      <div className="editar-perfil-wrapper">

        <h2>Editar Perfil</h2>

        <div className="editar-form">

          <label>Telefone:</label>
          <input
            type="text"
            name="telefone"
            value={form.telefone}
            onChange={handleChange}
          />

          <label>RG:</label>
          <input
            type="text"
            name="rg"
            value={form.rg}
            onChange={handleChange}
          />

          <label>Endereço:</label>
          <input
            type="text"
            name="endereco"
            value={form.endereco}
            onChange={handleChange}
          />

          <label>Data de Nascimento:</label>
          <input
            type="date"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
          />

          <button onClick={handleSave} className="salvar-btn">
            Salvar alterações
          </button>
        </div>

      </div>

      <Footer backgroundColor="black" />
    </>
  );
}
