import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handler } from './handler.js';

// Para ES modules, precisamos definir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/processar-deals', async (req, res) => {
  console.log('Recebida requisição para /processar-deals...');

  const result = await handler();

  const body = JSON.parse(result.body);

  res.status(result.statusCode).json(body);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando!`);
  console.log(`Acesse http://localhost:${PORT} para usar a interface`);
  console.log(`API disponível em http://localhost:${PORT}/processar-deals`);
});
