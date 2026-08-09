import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AnuncioPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import {
  IoCalendarOutline,
  IoWaterOutline,
  IoArrowBack
} from "react-icons/io5";
import { PiSpeedometer } from "react-icons/pi";
import AuthBar from "../components/AuthBar";

// ⭐ IMPORTAÇÃO DO FAVORITE BUTTON
import FavoriteButton from "../components/FavoriteButton";

// ⭐ IMPORTAÇÃO DO MODAL
import ModalConfirmarCompra from "../components/ModalConfirmarCompra";

function AnuncioPage() {
  const { id } = useParams();
  const [carro, setCarro] = useState(null);
  const [imagens, setImagens] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  const navigate = useNavigate();

  // 🔥 MODAL + PAGAMENTO
  const [modalOpen, setModalOpen] = useState(false);
  const [idCarrParaCompra, setIdCarrParaCompra] = useState(null);
  const [formaPagamento, setFormaPagamento] = useState("");
  const [parcelas, setParcelas] = useState(null);
  const [valorParcela, setValorParcela] = useState(null);

  // 🔥 PEGAR CLIENTE LOGADO
  const user = JSON.parse(localStorage.getItem("user"));
  const tipo = localStorage.getItem("tipo");
  const clienteId = tipo === "cliente" ? user?.id : null;

  const PLACEHOLDER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>
        <rect width='100%' height='100%' fill='#f2f3f5'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
          fill='#b0b3b8' font-family='Arial' font-size='24'>
          Sem imagem
        </text>
      </svg>`
    );

  // ============================
  // BUSCA O CARRO + JSON DE IMAGENS
  // ============================
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const respCarro = await axios.get(`/carros/${id}`);
        setCarro(respCarro.data);

        try {
          const respJson = await axios.get(`/uploads/cars/${id}.json`);
          setImagens(respJson.data);
        } catch {
          console.warn("Nenhum arquivo JSON encontrado.");
        }
      } catch (err) {
        console.error("Erro ao carregar o anúncio:", err);
      }
    };

    fetchCar();
  }, [id]);

  // 🔥 CHECAR FAVORITO
  useEffect(() => {
    if (!clienteId) return;

    const checkFav = async () => {
      try {
        const resp = await axios.get(`/clientes/${clienteId}/favoritos`);
        const favoritosIds = resp.data.favoritos.map((c) => c.id);
        setIsFavorited(favoritosIds.includes(Number(id)));
      } catch (err) {
        console.error("Erro ao verificar favorito:", err);
      }
    };

    checkFav();
  }, [clienteId, id]);


// ======================================================
// ⭐⭐ FUNÇÃO ORIGINAL: ADICIONAR AO CARRINHO (NÃO MEXER)
// ======================================================
const adicionarCarrinho = async () => {
  if (!user) {
    alert("Você precisa estar logado para adicionar ao carrinho!");
    return;
  }

  if (tipo === "funcionario") {
    alert("Funcionários não podem adicionar itens ao carrinho!");
    return;
  }

  try {
    // 1️⃣ Criar o carrinho
    const novoCarrinho = {
      quantProdutoCarr: 1,
      valorTotalCarr: carro.preco,
      dataCarr: new Date(),
      fk_Carros_idCar: carro.id,
      formaPagamento: "não definido"
    };

    const resp = await axios.post("/carrinhos", novoCarrinho);
    const idCarrCriado = resp.data.idCarr;

    // 2️⃣ Associar carrinho ao cliente
    await axios.put(`/clientes/${clienteId}`, {
      fk_Carrinho_idCarr: idCarrCriado
    });

    alert("Carro adicionado ao carrinho!");

  } catch (err) {
    console.error("Erro ao adicionar ao carrinho:", err);
    alert("Erro ao adicionar ao carrinho!");
  }
};

//Função para compartilhar

const handleShare = async () => {
    const shareUrl = `${window.location.origin}/anuncio/${id}`;
    const shareText = `Confira este carro: ${carro.marca} ${carro.modelo} - ${shareUrl}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${carro.marca} ${carro.modelo}`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert("🔗 Link copiado!");
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
    }
  };

  // ======================================================
  // ⭐⭐ INICIAR COMPRA DIRETA (CRIAR CARRINHO + ABRIR MODAL)
  // ======================================================
  const iniciarCompraDireta = async () => {
    if (!user) {
      alert("Você precisa estar logado para enviar uma mensagem!");
      return;
    }

    if (tipo === "funcionario") {
      alert("Funcionários não podem realizar compras!");
      return;
    }

    try {
      // 1️⃣ Criar carrinho automaticamente
      const novoCarrinho = {
        quantProdutoCarr: 1,
        valorTotalCarr: carro.preco,
        dataCarr: new Date(),
        fk_Carros_idCar: carro.id,
        formaPagamento: "não definido"
      };

      const resp = await axios.post("/carrinhos", novoCarrinho);
      const idCarr = resp.data.idCarr;

      // 2️⃣ Vincular carrinho ao cliente
      await axios.put(`/clientes/${clienteId}`, {
        fk_Carrinho_idCarr: idCarr
      });

      // 3️⃣ Salvar para o modal
      setIdCarrParaCompra(idCarr);

      // 4️⃣ Abrir modal
      setModalOpen(true);

    } catch (err) {
      console.error("Erro ao iniciar compra direta:", err);
      alert("Erro ao enviar mensagem!");
    }
  };

  // ======================================================


  const resolveImage = (file) =>
    !file ? PLACEHOLDER : `/uploads/cars/${file}`;

  if (!carro) return <p>Carregando...</p>;

  const imgPrincipal = resolveImage(imagens?.principal);
  const mini1 = resolveImage(imagens?.mini1);
  const mini2 = resolveImage(imagens?.mini2);
  const mini3 = resolveImage(imagens?.mini3);

  return (
    <>
      <Header backgroundColor="#010217" />
      <AuthBar />

      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <img className="lightbox-img" src={lightboxImg} />
          <button className="lightbox-close">✕</button>
        </div>
      )}

      <div className="anuncio-container">
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          <IoArrowBack />
        </button>

        <div className="anuncio-header">

          {/* ===== IMAGENS ===== */}
          <div className="anuncio-imagens">
            <div className="img-principal">
              <img
                src={imgPrincipal}
                alt="Principal"
                onClick={() => setLightboxImg(imgPrincipal)}
                style={{ cursor: "zoom-in" }}
              />
            </div>

            <div className="img-miniaturas">
              {[mini1, mini2, mini3].map((m, i) => (
                <img
                  key={i}
                  className="img-thumb"
                  src={m}
                  alt="Thumb"
                  onClick={() => setLightboxImg(m)}
                  style={{ cursor: "zoom-in" }}
                />
              ))}
            </div>
          </div>

          {/* ===== DADOS ===== */}
          <div className="anuncio-dados">

            {clienteId && (
              <div className="fav-btn-anuncio">
                <FavoriteButton
                  carroId={Number(id)}
                  clienteId={clienteId}
                  isFavoritedDefault={isFavorited}
                />
              </div>
            )}

            <h1>{carro.marca} {carro.modelo}</h1>

            <p className="preco">
              R$ {parseFloat(carro.preco).toLocaleString("pt-BR", {
                minimumFractionDigits: 2
              })}
            </p>

            <ul className="info-lista">
              <li><IoCalendarOutline /> {carro.ano}</li>
              <li><IoWaterOutline /> {carro.cor}</li>
              <li><PiSpeedometer /> {carro.quilometragemCar} km</li>
              <li><strong>Status:</strong> {carro.status}</li>
            </ul>

            {/* ===== AÇÕES ===== */}
            <div className="fale-conosco">
              <h3>Fale conosco</h3>

              <p><FaWhatsapp /> (11) 99999-9999</p>
              <p><FaPhoneAlt /> (11) 99999-9999</p>
              <p><FaMapMarkerAlt /> Onde estamos</p>

              {/* ⭐ BOTÃO ADAPTADO PARA BLOQUEAR FUNCIONÁRIOS ⭐ */}
<button
  className="btn-enviar"
  onClick={() => {
    if (!user) {
      alert("Você precisa estar logado para enviar uma mensagem!");
      return;
    }

    if (tipo === "funcionario") {
      alert("❌ Acesso negado: Funcionários não podem enviar mensagens!");
      return;
    }

    iniciarCompraDireta(); // 👍 cliente pode prosseguir normalmente
  }}
>
  Enviar mensagem
</button>


              <button className="btn-carrinho" onClick={adicionarCarrinho}>
                Adicionar ao Carrinho
              </button>

              <button className="btn-compartilhar" onClick={handleShare}>
                Compartilhar
              </button>
            </div>
          </div>
        </div>

        {/* DETALHES */}
        <div className="anuncio-detalhes">
          <h2>Detalhes</h2>
          {carro.descricaoCar ? (
            <ul className="detalhes-lista">
              {carro.descricaoCar.split(",").map((txt, i) => (
                <li key={i}>{txt.trim()}</li>
              ))}
            </ul>
          ) : (
            <p>Sem detalhes cadastrados.</p>
          )}
        </div>
      </div>

      {/* ⭐⭐⭐ MODAL COMPRA ⭐⭐⭐ */}
      {modalOpen && (
        <ModalConfirmarCompra
          isOpen={modalOpen}
          carro={carro}
          formaPagamento={formaPagamento}
          parcelas={parcelas}
          valorParcela={valorParcela}
          idCarr={idCarrParaCompra}
          fromAnuncio={true} 
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
            alert("Mensagem enviada com sucesso!");
          }}
        />
      )}

      <Footer backgroundColor="black" />
    </>
  );
}

export default AnuncioPage;
