const express = require('express');
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { Carro, Servico } = require('../models');
const upload = require("../middleware/multerCarros");


/*
███████████████████████████████████████████████████████████████████
█  FUNÇÃO AUXILIAR → Lê JSON externo do carro                      █
███████████████████████████████████████████████████████████████████
*/
function readCarJson(id) {
  const jsonPath = path.resolve("uploads/cars", `${id}.json`);
  if (!fs.existsSync(jsonPath)) {
    return { principal: null, mini1: null, mini2: null, mini3: null, descricao: "" };
  }
  return JSON.parse(fs.readFileSync(jsonPath));
}

/*
███████████████████████████████████████████████████████████████████
█  POST /carros → Cria carro + JSON externo                       █
███████████████████████████████████████████████████████████████████
*/
router.post(
  "/",
  upload.fields([
    { name: "imagemPrincipal", maxCount: 1 },
    { name: "mini1", maxCount: 1 },
    { name: "mini2", maxCount: 1 },
    { name: "mini3", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const body = req.body;

      // salva no banco
      const novoCarro = await Carro.create(body);

      // pega id
      const id = novoCarro.id;

      // monta JSON das imagens
      const jsonData = {
        principal: req.files.imagemPrincipal?.[0]?.filename || null,
        mini1: req.files.mini1?.[0]?.filename || null,
        mini2: req.files.mini2?.[0]?.filename || null,
        mini3: req.files.mini3?.[0]?.filename || null,
        descricao: body.descricaoCar || "",
        // 🔥 novo campo para homepage
    destaque: body.destaque === "true" ? true : false
      };

      // caminho
      const jsonPath = path.resolve("uploads/cars", `${id}.json`);

      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));

      return res.status(201).json(novoCarro);

    } catch (err) {
      console.error("Erro ao cadastrar carro:", err);
      return res.status(500).json({ erro: "Erro ao cadastrar carro" });
    }
  }
);


const { Op } = require('sequelize');

router.get('/filtrar', async (req, res) => {
  try {
    const { marca, modelo, precoMin, precoMax, anoMin, anoMax, kmMin, kmMax } = req.query;

    // Monta o filtro base
    const filtro = {};

    if (marca) {
      filtro.marca = { [Op.like]: `%${marca}%` };
    }

    if (modelo) {
      filtro.modelo = { [Op.like]: `%${modelo}%` };
    }

    if (precoMin || precoMax) {
      filtro.preco = {};
      if (precoMin) filtro.preco[Op.gte] = parseFloat(precoMin);
      if (precoMax) filtro.preco[Op.lte] = parseFloat(precoMax);
    }

      // ano
    if (anoMin || anoMax) {
      filtro.ano = {};
      if (anoMin) filtro.ano[Op.gte] = parseInt(anoMin);
      if (anoMax) filtro.ano[Op.lte] = parseInt(anoMax);
    }

    // quilometragem
    if (kmMin || kmMax) {
      filtro.quilometragemCar = {};
      if (kmMin) filtro.quilometragemCar[Op.gte] = parseInt(kmMin);
      if (kmMax) filtro.quilometragemCar[Op.lte] = parseInt(kmMax);
    }

    // Executa a busca
    const carros = await Carro.findAll({
      where: filtro
    });

    if (!carros || carros.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhum carro encontrado com os filtros informados' });
    }

    return res.json(carros);
  } catch (err) {
    console.error('Erro ao filtrar carros:', err);
    res.status(500).json({ erro: 'Erro ao filtrar carros' });
  }
});

/*
███████████████████████████████████████████████████████████████████
█  GET /carros → Lista todos com JSON embutido                     █
███████████████████████████████████████████████████████████████████
*/
router.get("/", async (req, res) => {
  try {
    const carros = await Carro.findAll();

    const lista = carros.map(c => {
      const json = readCarJson(c.id);
      return {
        ...c.toJSON(),
        imagens: {
          principal: json.principal,
          mini1: json.mini1,
          mini2: json.mini2,
          mini3: json.mini3
        },
        descricao: json.descricao,
        // 🔥 retorna destaque para o front
destaque: json.destaque || false
      };
    });

    res.json(lista);
  } catch (err) {
    console.error("Erro ao buscar carros:", err);
    res.status(500).json({ erro: "Erro ao buscar carros" });
  }
});

/*
========================================================
GET /carros/destaques ← ANTES DE /:id
========================================================
*/
router.get("/destaques", async (req, res) => {
  try {
    const carros = await Carro.findAll();

    const lista = carros
      .map(c => {
        const json = readCarJson(c.id);
        return {
          ...c.toJSON(),
          imagens: json,
          descricao: json.descricao,
          destaque: json.destaque || false
        };
      })
      .filter(c => c.destaque === true);

    res.json(lista);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar carros em destaque" });
  }
});



/*
███████████████████████████████████████████████████████████████████
█  GET /carros/:id → retorna carro + JSON                          █
███████████████████████████████████████████████████████████████████
*/
router.get("/:id", async (req, res) => {
  try {
    const carro = await Carro.findByPk(req.params.id);
    if (!carro) return res.status(404).json({ erro: "Carro não encontrado" });

    const json = readCarJson(carro.id);

    return res.json({
      ...carro.toJSON(),
      imagens: {
        principal: json.principal,
        mini1: json.mini1,
        mini2: json.mini2,
        mini3: json.mini3
      },
      descricao: json.descricao,
      // 🔥 retorna destaque para o front
destaque: json.destaque || false
    });

  } catch (err) {
    console.error("Erro ao buscar carro:", err);
    res.status(500).json({ erro: "Erro ao buscar carro" });
  }
});

/*
███████████████████████████████████████████████████████████████████
█  PUT /carros/:id → Atualiza banco + JSON                         █
███████████████████████████████████████████████████████████████████
*/
router.put(
  "/:id",
  upload.fields([
    { name: "imagemPrincipal", maxCount: 1 },
    { name: "mini1", maxCount: 1 },
    { name: "mini2", maxCount: 1 },
    { name: "mini3", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const carro = await Carro.findByPk(req.params.id);
      if (!carro) return res.status(404).json({ erro: "Carro não encontrado" });

      // atualiza o banco
      await carro.update(req.body);

      // lê JSON atual
      const jsonPath = path.resolve("uploads/cars", `${carro.id}.json`);
      let json = readCarJson(carro.id);

      // atualiza imagens só se enviar novas
      json.principal = req.files.imagemPrincipal?.[0]?.filename || json.principal;
      json.mini1 = req.files.mini1?.[0]?.filename || json.mini1;
      json.mini2 = req.files.mini2?.[0]?.filename || json.mini2;
      json.mini3 = req.files.mini3?.[0]?.filename || json.mini3;
      json.descricao = req.body.descricaoCar || json.descricao;

            // atualiza destaque se enviado
if (req.body.destaque !== undefined) {
  json.destaque = req.body.destaque === "true";
}

      // salva JSON atualizado
      fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));

      res.json({ mensagem: "Carro atualizado com sucesso" });

    } catch (err) {
      console.error("Erro ao atualizar carro:", err);
      res.status(500).json({ erro: "Erro ao atualizar carro" });
    }
  }
);

/*
███████████████████████████████████████████████████████████████████
█  DELETE /carros/:id → remove banco + json + imagens              █
███████████████████████████████████████████████████████████████████
*/
router.delete("/:id", async (req, res) => {
  try {
    const carro = await Carro.findByPk(req.params.id);
    if (!carro) return res.status(404).json({ erro: "Carro não encontrado" });

    const json = readCarJson(carro.id);

    // apaga imagens
    const imgs = [json.principal, json.mini1, json.mini2, json.mini3];
    for (const img of imgs) {
      if (img) {
        const imgPath = path.resolve("uploads/cars", img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      }
    }

    // apaga JSON
    const jsonPath = path.resolve("uploads/cars", `${carro.id}.json`);
    if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);

    await carro.destroy();

    res.json({ mensagem: "Carro e imagens excluídos com sucesso" });

  } catch (err) {
    console.error("Erro ao excluir carro:", err);
    res.status(500).json({ erro: "Erro ao excluir carro" });
  }
});


router.get('/:id/servicos', async (req, res) => {
  try {
    const carro = await Carro.findByPk(req.params.id, {
      include: [{ model: Servico }]
    });
    if (!carro) {
      return res.status(404).json({ erro: 'Carro não encontrado' });
    }
    res.json(carro.Servicos || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar serviços do carro' });
  }
  
});



module.exports = router;