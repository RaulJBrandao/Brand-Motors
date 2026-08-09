import React, { useState, useEffect } from "react";
import "./veiculo.css";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";

export default function VeiculoForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  

  const [form, setForm] = useState({
    modelo: "",
    marca: "",
    ano: "",
    cor: "",
    numeroChassiCar: "",
    numeroPlacaCar: "",
    preco: "",
    status: "disponível",
    descricaoCar: "",
    quilometragemCar: "",
    proprietario: "",
    destaque: false,
  });

  const [files, setFiles] = useState({
    imagemPrincipal: null,
    mini1: null,
    mini2: null,
    mini3: null,
  });

  const handleFile = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Carregar dados ao editar
  useEffect(() => {
    if (!id) return;

    async function carregar() {
      try {
        const resp = await fetch(`/carros/${id}`);
        const dados = await resp.json();

        setForm({
          modelo: dados.modelo || "",
          marca: dados.marca || "",
          ano: dados.ano || "",
          cor: dados.cor || "",
          numeroChassiCar: dados.numeroChassiCar || "",
          numeroPlacaCar: dados.numeroPlacaCar || "",
          preco: dados.preco || "",
          status: dados.status || "disponível",
          descricaoCar: dados.descricao || "",
          quilometragemCar: dados.quilometragemCar || "",
          proprietario: dados.proprietario || "",
          destaque: dados.destaque === true, // força booleano real
        });
      } catch (err) {
        console.error("Erro ao carregar carro:", err);
      }
    }

    carregar();
  }, [id]);

  // Funções de validação
const validarPreco = (preco) => {
  return Number(preco) >= 5000;
};

const validarPlaca = (placa) => {
  const regex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/i;
  return regex.test(placa);
};

const validarChassi = (chassi) => {
  const regex = /^[A-HJ-NPR-Z0-9]{17}$/i; 
  return regex.test(chassi);
};

  // Enviar formulário
  const enviar = async (e) => {
    e.preventDefault();

    // 🔥 VALIDAÇÕES ANTES DE ENVIAR
  if (!validarPreco(form.preco)) {
    alert("O preço deve ser no mínimo R$ 5.000");
    return;
  }

  if (!validarPlaca(form.numeroPlacaCar)) {
    alert("A placa é inválida! Use o padrão Mercosul (ex: ABC1D23).");
    return;
  }

  if (!validarChassi(form.numeroChassiCar)) {
    alert("O número do chassi deve ter exatamente 17 caracteres válidos.");
    return;
  }

    const formData = new FormData();

    // Converte boolean para string antes de enviar
    const formFinal = {
      ...form,
      destaque: form.destaque ? "true" : "false",
    };

    Object.entries(formFinal).forEach(([k, v]) => formData.append(k, v));
    Object.entries(files).forEach(([k, v]) => v && formData.append(k, v));

    const method = id ? "PUT" : "POST";
    const url = id ? `/carros/${id}` : "/carros";

    await fetch(url, { method, body: formData });

    navigate("/painel/veiculos");
  };

  return (
    <div className="form-veic-container">

      <button className="voltar-btn" onClick={() => navigate(-1)}>
        <IoArrowBack size={22} /> Voltar
      </button>

      <h1>{id ? "Editar Veículo" : "Cadastrar Veículo"}</h1>

      <form className="veiculo-form" onSubmit={enviar}>

        {/* Campos normais */}
        <input name="modelo" value={form.modelo} onChange={handleChange} required placeholder="Modelo" />
        <input name="marca" value={form.marca} onChange={handleChange} required placeholder="Marca" />
        <input type="number" name="ano" value={form.ano} onChange={handleChange} required placeholder="Ano" />
        <input name="cor" value={form.cor} onChange={handleChange} required placeholder="Cor" />
        <input name="numeroChassiCar" value={form.numeroChassiCar} onChange={handleChange} required placeholder="Chassi" />
        <input name="numeroPlacaCar" value={form.numeroPlacaCar} onChange={handleChange} required placeholder="Placa" />
        <input type="number" name="preco" value={form.preco} onChange={handleChange} required placeholder="Preço" />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="disponível">Disponível</option>
          <option value="vendido">Vendido</option>
        </select>

        <input type="number" name="quilometragemCar" value={form.quilometragemCar} onChange={handleChange} placeholder="Quilometragem" />
        <input name="proprietario" value={form.proprietario} onChange={handleChange} required placeholder="Proprietário" />

        <textarea name="descricaoCar" value={form.descricaoCar} onChange={handleChange} maxLength={80} placeholder="Descrição" />

        {/* Imagens */}
        <label>Imagem Principal:</label>
        <input type="file" name="imagemPrincipal" accept="image/*" onChange={handleFile} />

        <label>Miniatura 1:</label>
        <input type="file" name="mini1" accept="image/*" onChange={handleFile} />

        <label>Miniatura 2:</label>
        <input type="file" name="mini2" accept="image/*" onChange={handleFile} />

        <label>Miniatura 3:</label>
        <input type="file" name="mini3" accept="image/*" onChange={handleFile} />

        {/* Checkbox destaque */}
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={form.destaque}
            onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
          />
          Enviar para os destaques
        </label>

        <div className="form-buttons">
          <button type="submit" className="btn-save">Salvar</button>
          <button type="button" className="btn-cancel" onClick={() => navigate("/painel/veiculos")}>
            Cancelar
          </button>
        </div>

      </form>
    </div>
  );
}
