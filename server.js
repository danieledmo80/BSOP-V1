const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const zonasAtivas = {};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Recebe comandos do painel / Companion
app.post('/zona', (req, res) => {
  const { action, zona } = req.body;
  if (!action || !zona) return res.status(400).json({ ok: false });

  // Atualiza estado
  zonasAtivas[zona] = action === 'ativar';

  // Envia a todos os clientes WebSocket
  const msg = JSON.stringify({ action, zona });
  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });

  return res.json({ ok: true });
});

// Envia estado inicial quando alguém entra
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ action: 'estado_inicial', zonas: zonasAtivas }));
});

server.listen(PORT, () => console.log(`✅ Servidor online na porta ${PORT}`));
