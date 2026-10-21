// Links da página. Trocar aqui atualiza a página inteira.

// CTA principal: abre o formulário de compra (CheckoutModal escuta os links para #comecar).
export const CTA = {
  label: "Começar agora",
  href: "#comecar",
};

// Número de WhatsApp comercial do CheckZap (botão flutuante e CTA final).
export const WHATSAPP_URL = "/#cta"; // A DEFINIR: https://wa.me/55DDDNUMERO

// Domínio exibido nos links dos mockups (página do cliente, painel).
export const DOMINIO = "checkzaap.com.br";

// Login do sistema. www.checkzaap.com.br/entrar redireciona para cá (rota src/routes/entrar.ts),
// e é esse o link que vai no e-mail e no WhatsApp de boas-vindas. Trocar quando o painel tiver domínio próprio.
export const PAINEL_ENTRAR = "https://checkzap.169-58-59-237.sslip.io/entrar";
