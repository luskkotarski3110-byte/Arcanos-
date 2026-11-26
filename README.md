# Arcanos 🔮

Assistente em português para estudar Tarot, Baralho Cigano/Lenormand e outras tradições oraculares. Leituras são apresentadas como interpretações simbólicas, não previsões garantidas.

## Executar localmente

1. Instale Node.js 20 ou superior.
2. Execute `npm install`.
3. Configure `GEMINI_API_KEY` no ambiente (não publique sua chave).
4. Execute `npm start` e abra `http://localhost:3000`.

## Publicar no Render

Crie um serviço **Web Service** conectado a este repositório. Build Command: `npm install`. Start Command: `npm start`. Em Environment, adicione `GEMINI_API_KEY` como Secret e, opcionalmente, `GEMINI_MODEL=gemini-2.5-flash`. Nunca coloque a chave no código ou no GitHub.

## Rotas

- `GET /api/health`: verifica o servidor e se a chave foi configurada.
- `POST /api/chat`: recebe `{ "messages": [{ "role": "user", "text": "..." }] }`.

O projeto ainda não inclui contas, histórico permanente, geração de imagens ou sistema de cotas de imagem.
