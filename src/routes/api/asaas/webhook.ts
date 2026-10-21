import { createFileRoute } from "@tanstack/react-router";

// Configurar no Asaas (Integrações → Webhooks): https://<domínio>/api/asaas/webhook
// com o token de autenticação igual ao ASAAS_WEBHOOK_TOKEN do .env
export const Route = createFileRoute("/api/asaas/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { receberWebhook } = await import("@/server/webhook");
        return receberWebhook(request);
      },
    },
  },
});
