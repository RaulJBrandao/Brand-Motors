import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Funcionarios.css";
import { IoArrowBack } from "react-icons/io5";

export default function FormFuncionario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    endereco: "",
    cargo: "",
    salario: "",
    senha: "",
  });

  useEffect(() => {
    if (id) carregar();
  }, [id]);

  async function carregar() {
    const resp = await fetch(`/funcionarios/${id}`);
    const data = await resp.json();
    setForm(data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const metodo = id ? "PUT" : "POST";
    const url = id ? `/funcionarios/${id}` : "/funcionarios";

    const resp = await fetch(url, {
      method: metodo,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form),
    });

    const data = await resp.json();

    alert(id ? "Funcionário atualizado!" : "Funcionário cadastrado!");
    navigate("/painel/funcionarios");
  }

  function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  let resto;

  for (let i = 1; i <= 9; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++)
    soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);

  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;

  return resto === parseInt(cpf.substring(10, 11));
}

  return (
    <div className="form-func-container">
           {/* 🔙 Botão de Voltar */}
              <button className="voltar-btn" onClick={() => navigate("/painel/funcionarios")}>
                <IoArrowBack  size={22} /> Voltar
              </button>
      <h2>{id ? "Editar Funcionário" : "Novo Funcionário"}</h2>

      <form onSubmit={handleSubmit} className="form-func">
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" required />
        <input
  name="cpf"
  placeholder="CPF"
  required
  maxLength={14}
  value={form.cpf}
  onChange={(e) => {
    let v = e.target.value.replace(/\D/g, ""); // remove tudo que não é número

    // aplica máscara
    if (v.length > 3) v = v.replace(/(\d{3})(\d)/, "$1.$2");
    if (v.length > 6) v = v.replace(/(\d{3})(\d)/, "$1.$2");
    if (v.length > 9) v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setForm({ ...form, cpf: v });
  }}
  onBlur={() => {
    if (form.cpf && !validarCPF(form.cpf)) {
      alert("CPF inválido!");
      setForm({ ...form, cpf: "" });
    }
  }}
/>

        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="Telefone" required />
        <input name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço" required />
        <input name="cargo" value={form.cargo} onChange={handleChange} placeholder="Cargo" required />
        <input type="number" name="salario" value={form.salario} onChange={handleChange} placeholder="Salário" required />

        {!id && (
          <input
            name="senha"
            type="password"
            value={form.senha}
            onChange={handleChange}
            placeholder="Senha"
            required
          />
        )}

        <button type="submit" className="btn-salvar">
          {id ? "Salvar Alterações" : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
