import React, { useEffect, useState } from "react";
import "../styles/LoginModal.css";
import logoBranca from "../assets/brandmech/bmech_serv/brancmechlogowhite.png";
import { useNavigate } from "react-router-dom";

export default function LoginModal({
  isOpen,
  onClose,
  isLoginView,
  setIsLoginView,
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    senhaConfirm: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ==========================
  //   LOGIN UNIVERSAL
  // ==========================
  const loginUniversal = async () => {
    // 1️⃣ Tentar login como funcionário
    let resp = await fetch("/funcionarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        senha: form.senha,
      }),
    });

    if (resp.ok) {
      const data = await resp.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.funcionario));
      localStorage.setItem("cargo", data.funcionario.cargo);
      localStorage.setItem("tipo", "funcionario");

      setMensagem("Login de funcionário realizado!");
      onClose();

      // 🔹 Redirecionar para a homepage de gerenciamento
      setTimeout(() => {
        // 3️⃣ REDIRECIONA DIRETAMENTE PARA A HOME DO PAINEL
          navigate("/painel");
      }, 500);

      return;
    }

    // 2️⃣ Se não for funcionário → tentar cliente
    resp = await fetch("/clientes/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        senha: form.senha,
      }),
    });

    const data = await resp.json();

    if (!resp.ok) throw new Error(data.erro || "Erro ao fazer login.");

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.cliente));
     localStorage.setItem("tipo", "cliente");

    setMensagem("Login realizado com sucesso!");
    onClose();

    setTimeout(() => window.location.reload(), 500);
  };

  // ==========================
  //     SUBMIT
  // ==========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem("");

    try {
      if (isLoginView) {
        // Login universal (tentativa automática)
        await loginUniversal();
      } else {
        // Cadastro cliente
        if (form.senha !== form.senhaConfirm)
          throw new Error("As senhas não coincidem!");

        const resp = await fetch("/clientes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nome: form.nome,
            email: form.email,
            senha: form.senha,
          }),
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.erro || "Erro ao cadastrar");

        setMensagem("Cadastro realizado! Agora faça login.");
        setIsLoginView(true);
      }
    } catch (err) {
      setMensagem(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="overlay open" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-inner">
          <div className="modal-brand">
            <img src={logoBranca} alt="Brand Mech" style={{ filter: "brightness(0.1)" }} />
          </div>

          <div className="modal-tabs">
            <button className={`tab ${isLoginView ? "active" : ""}`} onClick={() => setIsLoginView(true)}>Entrar</button>
            <button className={`tab ${!isLoginView ? "active" : ""}`} onClick={() => setIsLoginView(false)}>Cadastrar</button>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            {!isLoginView && (
              <input type="text" name="nome" placeholder="Nome completo" onChange={handleChange} required />
            )}

            <input type="email" name="email" placeholder="E-mail" onChange={handleChange} required />
            <input type="password" name="senha" placeholder="Senha" onChange={handleChange} required />

            {!isLoginView && (
              <input type="password" name="senhaConfirm" placeholder="Confirme a senha" onChange={handleChange} required />
            )}

            <button type="submit" className="primary" disabled={carregando}>
              {carregando ? "Processando..." : isLoginView ? "Entrar" : "Cadastrar"}
            </button>

            {mensagem && <p className="mensagem">{mensagem}</p>}

            {isLoginView ? 
            ( <p className="modal-note"> Ao entrar, você aceita os{" "}
            <a href="#">Termos</a> e a{" "} <a href="#">Política de Privacidade</a>. </p> ) : 
            ( <p className="modal-note"> Criaremos sua conta com segurança. Já tem conta?{" "} 
            <button type="button" className="link-btn" onClick={() => 
            setIsLoginView(true)}> Entrar </button> </p> )} </form> 
            </div>
             </div> 
             </div>
              ); 
            }