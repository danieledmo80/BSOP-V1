import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(PORT, () => {
  console.log(`🌍 Servidor rodando em http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ port: 8081 });
console.log("🔌 WebSocket ativo na porta 8081");

wss.on("connection", (ws) => {
  console.log("Cliente conectado ao WebSocket");
  ws.on("message", (message) => {
    console.log("Mensagem recebida:", message.toString());
    wss.clients.forEach((client) => {
      if (client.readyState === 1) client.send(message.toString());
    });
  });
});
