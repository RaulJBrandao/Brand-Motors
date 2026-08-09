import React, { useState } from "react";
import Header from "../components/Header"; 
import Footer from "../components/Footer";
import BannerSlider from "../components/BannerSlider";
import AuthBar from "../components/AuthBar";
import "../styles/Brand-Mech.css";

import { FaRegUserCircle, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { RiMessage2Line } from "react-icons/ri";

import logoBranca from "../assets/brandmech/bmech_serv/brancmechlogowhite.png";
import flexcare from "../assets/brandmech/bmech_serv/flexcare.jpg";
import garantia from "../assets/brandmech/bmech_serv/garantia.jpg";
import manutencao from "../assets/brandmech/bmech_serv/manutencao.jpg";
import testdrive from "../assets/brandmech/bmech_serv/testdrive.jpg";
import recall from "../assets/brandmech/bmech_serv/recall.jpg";
import revisao from "../assets/brandmech/bmech_serv/revisao.jpg";

export default function BMServPage() {

 

  const services = [
    { title: "FLEXCARE", description: "Serviços para quem é apaixonado por tranquilidade", image: flexcare },
    { title: "GARANTIA ADICIONAL", description: "Aumente o tempo de garantia do seu carro e fique tranquilo por mais tempo.", image: garantia },
    { title: "PACOTES DE MANUTENÇÃO", description: "Com FlexCare, seu carro está sempre em dia.", image: manutencao },
    { title: "TEST DRIVE", description: "Realize o seu Test drive gratuitamente conosco", image: testdrive },
    { title: "RECALL", description: "Consulte se seu carro tem algum Recall pendente.", image: recall },
    { title: "REVISÃO", description: "Cuide do seu carro em nossa rede de especialistas.", image: revisao },
  ];

  return (
    <div className="bm-serv-page">
      <Header logo={logoBranca} backgroundColor="#010217" />

      <AuthBar />

      {/* resto da página */}
      <div className="breadcrumb">
        <span>Menu &gt; Pacotes de serviço</span>
        <span>| Pacote de manutenção</span>
        <span>| Garantia adicional</span>
        <span>| Revisão</span>
        <span>| Recall</span>
        <span>| Assistência 24H</span>
        <span>| Manuais</span>
        <span>| Agendamento Online</span>
      </div>

      <BannerSlider />

      <div className="service-grid">
        {services.map((s, i) => (
          <div className="service-card" key={i}>
            <img src={s.image} alt={s.title} />
            <h3>{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>

      <section className="bm-service-agendamento">
        <h2>AGENDE SEU SERVIÇO</h2>
        <p>Agora você pode agendar sua próxima revisão online, com mais rapidez e praticidade</p>
        <div className="bm-agendamento-content">
          <img src={require("../assets/brandmech/bmech_serv/banneragend.jpg")} alt="bagend" />
        </div>
      </section>

      <section className="bm-suporte">
        <h2>CENTRAL DE ATENDIMENTO BRAND MECH</h2>
        <ul>
          <li><strong>Assistência 24h - Confiat:</strong> reboque, veículo reserva, socorro mecânico e outras solicitações emergenciais.</li>
          <li><strong>Atendimento geral:</strong> dúvidas, sugestões, reclamações e elogios.</li>
        </ul>

        <div className="info-cards">
          <div className="info-card"><strong><FaWhatsapp style={{ fontSize: '35px' }}/> Whatsapp</strong><p><b>(69)96783-0019</b></p></div>
          <div className="info-card"><strong><FaPhoneAlt style={{ fontSize: '35px' }}/> Telefone</strong><p><b>0800 707 1000</b></p></div>
          <div className="info-card"><strong><RiMessage2Line style={{ fontSize: '35px' }}/> Mensagem</strong><p><b>Envie uma mensagem</b></p></div>
        </div>
      </section>

      <Footer backgroundColor="black" />
    </div>
  );
}
