# 🚀 Pipeline Data Processor

Aplicação para processar e exportar dados do Pipedrive de forma automatizada, com interface web simples e intuitiva.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 20 ou superior) - [Download aqui](https://nodejs.org/)
- **Git** - [Download aqui](https://git-scm.com/)
- **Conta no Pipedrive** com acesso à API

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pipeline-data-processor.git
cd pipeline-data-processor
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
touch .env
```

Adicione as seguintes variáveis no arquivo `.env`:

```env
# Configurações do Pipedrive
PIPEDRIVE_API_KEY=seu_token_api_aqui
PIPEDRIVE_BASE_URL_V1=https://api.pipedrive.com/v1
PIPEDRIVE_BASE_URL_V2=https://api.pipedrive.com/api/v2
PIPELINE_NAME=o_nome_da_pipeline_para_analise

# Configuração do servidor
PORT=3333
```

> ⚠️ **Importante**: Substitua `suaempresa` pelo subdomínio da sua conta Pipedrive

### 4. Como obter seu Token da API do Pipedrive

1. Acesse sua conta do Pipedrive
2. Vá em **Configurações** → **Preferências Pessoais**
3. Clique na aba **API**
4. Copie seu **Token da API**
5. Cole no arquivo `.env` na variável `PIPEDRIVE_API_KEY`

## 🚀 Como executar

### 1. Inicie o servidor

```bash
npm start
```

Você verá a mensagem:

```
🚀 Servidor de teste rodando!
Acesse http://localhost:3000 para usar a interface
API disponível em http://localhost:3000/processar-deals
```

### 2. Acesse a interface web

Abra seu navegador e vá para: **http://localhost:3333**

### 3. Execute o processamento

1. Clique no botão **"Processar Deals"**
2. Aguarde o processamento (pode levar alguns minutos)
3. Veja os resultados na tela

## 📁 Onde encontrar os arquivos gerados

### Arquivos JSON locais

Os arquivos são salvos na pasta `data/` na raiz do projeto:

```
seu-projeto/
└── data/
    └── 1234567890_uuid-12345.json
```

**Formato do nome**: `{timestamp}_{uuid}.json`

### Estrutura do arquivo JSON

```json
{
  "metadata": {
    "generatedAt": "2024-01-15T10:30:00.000Z",
    "totalDeals": 50,
    "organizationsFound": 45,
    "organizationsNotFound": 5,
    "pipelineId": 123
  },
  "data": {
    "Mapear | Sem prévia": [...],
    "Form preenchido": [...],
    "Qualificar": [...],
    "Personalização | Proposta comercial": [...],
    "Visita técnica": [...],
    "Etapa de negociação": [...],
    "Fechamento": [...]
  }
}
```

## 🔧 Scripts disponíveis

```bash
# Iniciar o servidor
npm start

# Executar apenas o handler (sem interface web)
node handler.js

# Modo desenvolvimento (com auto-reload)
npm run dev
```

## 📊 Funcionalidades

### ✅ O que a aplicação faz:

- **Extrai todos os deals** do pipeline principal
- **Busca informações completas** de pessoas e organizações
- **Coleta atividades e notas** de cada deal
- **Organiza por estágios** do pipeline
- **Gera estatísticas** de processamento
- **Salva em arquivo JSON** com timestamp único
- **Interface web simples** para execução

### 📈 Dados coletados por deal:

- Nome da pessoa
- Nome da organização
- Campos customizados (proposta comercial)
- Data de entrada no pipeline
- Data da última atualização
- Lista de atividades
- Lista de notas
- ID do deal (para referência)

## 🐛 Troubleshooting

### Problema: "API Token inválido"

**Solução**: Verifique se o token no `.env` está correto e não expirou.

### Problema: "Organização não encontrada"

**Solução**: Normal! Alguns deals podem não ter organização ou a organização pode ter sido deletada.

### Problema: "Rate limit exceeded"

**Solução**: A aplicação já tem delays de 3 segundos entre requisições. Se persistir, aumente o delay no arquivo `handler.js`.

### Problema: "ENOTFOUND" ou erro de conexão

**Solução**: Verifique se a URL base no `.env` está correta (ex: `api.pipedrive.com`).

### Problema: Pasta `data` não existe

**Solução**: A aplicação cria automaticamente. Verifique as permissões da pasta.

## 📁 Estrutura do projeto

```
VOU FAZER UM CLEAN CODE NESSE PROJETO RS, POR ENQUANTO FOI SO PARA TESTE
```

## 🔒 Segurança

- ✅ **Nunca commite** o arquivo `.env` (já está no `.gitignore`)
- ✅ **Mantenha seu API token seguro**
- ✅ **Use HTTPS** em produção
- ✅ **Limite o acesso** à aplicação se necessário

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se encontrar problemas:

1. ✅ Verifique se seguiu todos os passos da instalação
2. ✅ Confira se as variáveis de ambiente estão corretas
3. ✅ Olhe os logs no terminal para identificar o erro
4. ✅ Abra uma issue no GitHub com detalhes do problema

---

**Desenvolvido com ❤️ para simplificar a gestão de dados do Pipedrive**
