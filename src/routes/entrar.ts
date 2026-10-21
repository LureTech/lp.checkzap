import { createFileRoute } from "@tanstack/react-router";
import { PAINEL_ENTRAR } from "@/lib/site";

// www.checkzaap.com.br/entrar -> tela de login do sistema (o link do e-mail e do WhatsApp de boas-vindas)
const irParaOLogin = () => new Response(null, { status: 302, headers: { Location: PAINEL_ENTRAR, "Cache-Control": "no-store" } });

export const Route = createFileRoute("/entrar")({
  server: {
    handlers: {
      GET: irParaOLogin,
      HEAD: irParaOLogin,
    },
  },
});
