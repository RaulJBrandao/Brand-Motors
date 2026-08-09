import React from 'react';
import HomePage from './pages/HomePage';
import Bm_servPage from './pages/Bm_servPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VenderPage from './pages/VenderPage';
import Vitrine from './pages/Vitrine';
import AnuncioPage from "./pages/AnuncioPage";
import CarrinhoPage from "./pages/Carrinho";
import PainelHome from "./pages/PainelHome";
import FuncionariosPage from "./pages/painel/FuncionarioPage";
import FormFuncionario from "./pages/painel/FormFuncionario";
import VeiculosPage from "./pages/painel/veiculos/VeiculosPage";
import VeiculoForm from "./pages/painel/veiculos/VeiculoForm";
import FavoritosPage from "./pages/FavoritosPage";
import ClientesPage from "./pages/painel/clientes/ClientesPage";
import ClienteConsulta from "./pages/painel/clientes/ClienteConsulta";
import PainelConversas from "./pages/painel/conversas/PainelConversas";
import PainelVendasPage from "./pages/painel//vendas/PainelVendasPage";
import Perfil from "./pages/Perfil";
import MeusVeiculosPage from "./pages/MeusVeiculosPage";
import HistoricoComprasPage from "./pages/HistoricoComprasPage";
import EditarPerfil from "./pages/EditarPerfil";
import Agendamento from "./pages/Agendamento";







function App() {
  return (
    //Isso aqui é responsável pela navegabilidade do site
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/servicos" element={<Bm_servPage />} />
        <Route path="/vender" element={<VenderPage />} />
        <Route path="/veiculo" element={<Vitrine />} />
        <Route path="/estoque" element={<Vitrine />} />
        <Route path="/anuncio/:id" element={<AnuncioPage />} />
        <Route path="/carrinho/:id" element={<CarrinhoPage />} />
        <Route path="/painel" element={<PainelHome />} />
        <Route path="/painel/funcionarios" element={<FuncionariosPage />} />
<Route path="/painel/funcionarios/novo" element={<FormFuncionario />} />
<Route path="/painel/funcionarios/editar/:id" element={<FormFuncionario />} />
      <Route path="/painel/veiculos" element={<VeiculosPage />} />
<Route path="/painel/veiculos/novo" element={<VeiculoForm />} />
<Route path="/painel/veiculos/editar/:id" element={<VeiculoForm />} />
<Route path="/painel/clientes" element={<ClientesPage />} />
<Route path="/painel/clientes/consulta/:id" element={<ClienteConsulta />} />
<Route path="/painel/conversas" element={<PainelConversas />} />
<Route path="/painel/vendas" element={<PainelVendasPage />} />
<Route path="/favoritos" element={<FavoritosPage />} />
        <Route path="/perfil/:id" element={<Perfil />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        <Route path="/agendar" element={<Agendamento />} />
        <Route path="/meuscarros" element={<MeusVeiculosPage />} />
        <Route path="/historico" element={<HistoricoComprasPage />} />


      </Routes>
    </Router>
  );
}

export default App;

