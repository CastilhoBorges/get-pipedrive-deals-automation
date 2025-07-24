import 'dotenv/config';
import express from 'express';
import { handler } from './handler.js';

const app = express();
const PORT = process.env.PORT;

app.get('/processar-deals', async (req, res) => {
  console.log('Recebida requisição para /processar-deals...');

  const result = await handler();

  const body = JSON.parse(result.body);

  res.status(result.statusCode).json(body);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor de teste rodando!`);
  console.log(
    `Acesse http://localhost:${PORT}/processar-deals para executar a função.`
  );
});
