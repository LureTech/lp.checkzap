import { env } from "@/server/env";
import { hmacHex, iguais } from "@/server/assinado";
import { buscarCobranca, confirmarNoSandbox, pixDaCobranca, type CobrancaAsaas } from "@/server/asaas";
import { repassarEvento } from "@/server/webhook";
import type { DadosPix } from "@/lib/formulario";

// O navegador só consulta a cobrança que o próprio checkout entregou a ele:
// cada id vai junto com um token assinado no servidor.
const PAGO = new Set(["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"]);

function segredo(): string {
  return env("AUTOMACAO_SEGREDO") || env("ASAAS_WEBHOOK_TOKEN") || env("ASAAS_API_KEY");
}

export function tokenDaCobranca(cobrancaId: string): Promise<string> {
  return hmacHex(segredo(), `pix:${cobrancaId}`);
}

export async function tokenValido(cobrancaId: string, token: string): Promise<boolean> {
  return iguais(token, await tokenDaCobranca(cobrancaId));
}

// Monta o que o modal precisa para mostrar o Pix. Se o Asaas não devolver o QR, volta null
// e o checkout cai na fatura do Asaas.
export async function prepararPix(cobranca: CobrancaAsaas): Promise<DadosPix | null> {
  if (cobranca.billingType !== "PIX") return null;
  try {
    const pix = await pixDaCobranca(cobranca.id);
    if (!pix.encodedImage || !pix.payload) return null;
    return {
      id: cobranca.id,
      token: await tokenDaCobranca(cobranca.id),
      valor: cobranca.value,
      imagem: `data:image/png;base64,${pix.encodedImage}`,
      copiaECola: pix.payload,
      teste: modoTeste(),
    };
  } catch (e) {
    console.warn("[pix] não deu para gerar o QR code", e);
    return null;
  }
}

// Só a conta de teste do Asaas aceita pagamento simulado
export function modoTeste(): boolean {
  return env("ASAAS_API_URL").includes("sandbox");
}

// Sandbox: confirma o Pix como se o cliente tivesse pagado e repassa para o CheckZap,
// do mesmo jeito que o webhook do Asaas faz depois que a LP estiver publicada.
export async function simularPagamento(cobrancaId: string): Promise<{ ok: boolean; erro?: string }> {
  if (!modoTeste()) return { ok: false, erro: "Pagamento simulado só funciona no ambiente de teste." };
  const c = await buscarCobranca(cobrancaId);
  if (!PAGO.has(c.status)) await confirmarNoSandbox(cobrancaId);
  const paga = await buscarCobranca(cobrancaId);
  const r = await repassarEvento({ id: `simulado_${cobrancaId}`, event: "PAYMENT_RECEIVED", payment: paga });
  if (r.status >= 300) return { ok: false, erro: "O Pix foi confirmado, mas o CheckZap não respondeu. Veja se a API dele está rodando." };
  return { ok: true };
}

// A tela do Pix pergunta se caiu. Se caiu, avisa o CheckZap na hora, sem esperar o webhook do Asaas
// (que também avisa; o CheckZap ignora o repetido e não cria conta duas vezes).
export async function conferirEAvisar(cobrancaId: string): Promise<boolean> {
  const c = await buscarCobranca(cobrancaId);
  if (!PAGO.has(c.status)) return false;
  const r = await repassarEvento({ id: `pix_tela_${cobrancaId}`, event: "PAYMENT_RECEIVED", payment: c });
  if (r.status >= 300) console.error("[pix] Pix pago, mas o CheckZap não respondeu agora; o webhook do Asaas avisa de novo");
  return true;
}
