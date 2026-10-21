# CheckZap · landing page

Landing page do CheckZap com compra por Pix (Asaas). O formulário cria o cliente e a assinatura de R$ 97/mês no Asaas, mostra o Pix na própria página e avisa o CheckZap quando o pagamento cai.

## Rodar no computador

```bash
npm install
cp .env.example .env   # preencha com as chaves do sandbox
npm run dev            # http://localhost:8080
```

## Publicar na Vercel

1. Suba o repositório no GitHub como **privado**. O `.env` não vai junto (está no `.gitignore`).
2. Na Vercel: **Add New → Project**, escolha o repositório. Não precisa mudar nada no build: a Vercel detecta sozinha.
3. Em **Settings → Environment Variables**, cadastre as variáveis do `.env.example`. Marque como **Sensitive** a `ASAAS_API_KEY`, a `ASAAS_WEBHOOK_TOKEN` e a `AUTOMACAO_SEGREDO`. Na Vercel a chave do Asaas vai **sem aspas**.
4. Depois do primeiro deploy, no painel do Asaas:
   - **Integrações → Webhooks**: URL `https://SEU-DOMINIO/api/asaas/webhook`, token igual à `ASAAS_WEBHOOK_TOKEN`, eventos de **cobrança** e de **assinatura**.
   - **Minha Conta → Informações**: cadastre o domínio do site (sem isso o cliente não volta para `/obrigado` depois de pagar).
5. Recomendado: em **Vercel → Firewall**, crie uma regra de rate limit para `/_serverFn` (por exemplo 60 requisições por minuto por IP).

## Segurança

- A chave do Asaas só é lida no servidor e não aparece no código que vai para o navegador.
- O webhook do Asaas só é aceito com o token certo. Os eventos para o CheckZap vão assinados com HMAC-SHA256.
- O navegador só consulta o Pix da própria compra (cada cobrança vai com um token assinado).
- Limite de tentativas por IP no checkout e na consulta do Pix.
- Cabeçalhos de segurança em produção (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy). Se entrar pixel do Meta ou do Google, libere os domínios deles no CSP em `src/server.ts`.
- O botão "Simular pagamento" só existe com a URL do sandbox do Asaas.

## Onde mexer

| O quê | Arquivo |
|---|---|
| Textos e seções da página | `src/routes/index.tsx` |
| Botão de compra, link do WhatsApp, domínio dos mockups | `src/lib/site.ts` |
| Formulário e tela do Pix | `src/components/CheckoutModal.tsx` |
| Integração com o Asaas | `src/server/` |
