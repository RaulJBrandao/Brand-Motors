// backend/rotas/history.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// pasta onde os JSONs são gravados
const HISTORY_FOLDER = path.join(__dirname, '..', 'history');

// Certifique-se de que a pasta exista
if (!fs.existsSync(HISTORY_FOLDER)) {
  fs.mkdirSync(HISTORY_FOLDER, { recursive: true });
}

// GET /history
// retorna todos os arquivos JSON da pasta (parsed)
router.get('/', async (req, res) => {
  try {
    const files = fs.readdirSync(HISTORY_FOLDER).filter(f => f.endsWith('.json'));
    const items = files.map(f => {
      try {
        const raw = fs.readFileSync(path.join(HISTORY_FOLDER, f), 'utf8');
        return { fileName: f, data: JSON.parse(raw) };
      } catch (e) {
        return { fileName: f, error: 'invalid_json' };
      }
    });
    res.json(items);
  } catch (err) {
    console.error('Erro lendo history:', err);
    res.status(500).json({ erro: 'Erro ao ler histórico' });
  }
});

// GET /history/cliente/:id
// filtra arquivos cujo nome comece com cliente-<id>-  (conforme seu pattern)
router.get('/cliente/:id', async (req, res) => {
  const clienteId = String(req.params.id);
  try {
    const files = fs.readdirSync(HISTORY_FOLDER).filter(f => f.endsWith('.json'));
    const match = files
      .filter(f => f.startsWith(`cliente-${clienteId}-`))
      .map(f => {
        try {
          const raw = fs.readFileSync(path.join(HISTORY_FOLDER, f), 'utf8');
          return { fileName: f, data: JSON.parse(raw) };
        } catch (e) {
          return { fileName: f, error: 'invalid_json' };
        }
      });
    res.json(match);
  } catch (err) {
    console.error('Erro lendo history/cliente:', err);
    res.status(500).json({ erro: 'Erro ao ler histórico do cliente' });
  }
});

// GET /history/file/:name  -> retorna raw JSON (útil para download/preview)
router.get('/file/:name', (req, res) => {
  const name = req.params.name;
  // prevenir path traversal
  if (name.includes('..') || path.basename(name) !== name) {
    return res.status(400).json({ erro: 'Nome inválido' });
  }
  const filePath = path.join(HISTORY_FOLDER, name);
  if (!fs.existsSync(filePath)) return res.status(404).json({ erro: 'Arquivo não encontrado' });
  res.sendFile(filePath);
});

module.exports = router;
