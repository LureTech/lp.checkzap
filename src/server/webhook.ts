import { env } from "@/server/env";
import { enviarAssinado, iguais } from "@/server/assinado";
import { buscarCliente, type CobrancaAsaas } from "@/server/asaas";

// Eventos do Asaas que interessam à implantação, já com o nome que a automação usa
const EVENTOS: Record<string, string> = {
  PAYMENT_CONFIRMED: "pagamento_aprovado",
  PAYMENT_RECEIVED: "pagamento_aprovado",
  PAYMENT_OVERDUE: "pagamento_atrasado",
  PAYMENT_CREDIT_CARD_CAPTURE_REFUSED: "pagamento_recusado",
  PAYMENT_REPROVED_BY_RISK_ANALYSIS: "pagamento_recusado",
  PAYMENT_REFUNDED: "pagamento_estornado",
  PAYMENT_PARTIALLY_REFUNDED: "pagamento_estornado",
  PAYMENT_CHARGEBACK_REQUESTED: "pagamento_estornado",
  SUBSCRIPTION_DELETED: "assinatura_cancelada",
  SUBSCRIPTION_INACTIVATED: "assinatura_cancelada",
};

const json = (status: number, corpo: unknown) =>
  new Response(JSON.stringify(corpo), { status, headers: { "Content-Type": "application/json" } });

export type EventoAsaas = {
  id?: string;
  event?: string;
  payment?: CobrancaAsaas;
  subscription?: { id: string; customer: string; externalReference?: string | null };
};

// A conta do Asaas é compartilhada com outros produtos da Lure. Só repassa o que nasceu
// no checkout desta página: a assinatura (e as cobranças dela) levam a referência "lp:<cpf/cnpj>".
const REFERENCIA_LP = "lp:";
function eDaLp(corpo: EventoAsaas): boolean {
  const ref = corpo.payment?.externalReference ?? corpo.subscription?.externalReference ?? "";
  return ref.startsWith(REFERENCIA_LP);
}

// Recebe o webhook do Asaas e repassa para a automação de implantação.
// Se o repasse falhar, responde erro: o Asaas tenta de novo sozinho.
export async function receberWebhook(request: Request): Promise<Response> {
  const token = env("ASAAS_WEBHOOK_TOKEN");
  if (!token) return json(503, { erro: "webhook não configurado" });
  if (!iguais(request.headers.get("asaas-access-token") ?? "", token)) return json(401, { erro: "token inválido" });
  // evento do Asaas tem poucos KB; corpo enorme é abuso
  if (Number(request.headers.get("content-length") ?? 0) > 256 * 1024) return json(413, { erro: "corpo grande demais" });

  let corpo: EventoAsaas;
  try {
    corpo = await request.json();
  } catch {
    return json(400, { erro: "corpo inválido" });
  }
  const r = await repassarEvento(corpo);
  return json(r.status, r.corpo);
}

// Traduz o evento do Asaas e manda para a automação (também usado pelo pagamento simulado no sandbox)
export async function repassarEvento(corpo: EventoAsaas): Promise<{ status: number; corpo: Record<string, unknown> }> {
  const evento = EVENTOS[corpo.event ?? ""];
  if (!evento) return { status: 200, corpo: { ok: true, ignorado: corpo.event } };
  if (!eDaLp(corpo)) return { status: 200, corpo: { ok: true, ignorado: "cobrança de outro produto" } };

  const clienteId = corpo.payment?.customer ?? corpo.subscription?.customer;
  if (!clienteId) return { status: 200, corpo: { ok: true, ignorado: "sem cliente" } };

  const destino = env("AUTOMACAO_URL");
  if (!destino) {
    console.warn(`[webhook] ${corpo.event} recebido, mas AUTOMACAO_URL não está configurada`);
    return { status: 200, corpo: { ok: true, repassado: false } };
  }

  try {
    const cliente = await buscarCliente(clienteId);
    const p = corpo.payment;
    const r = await enviarAssinado(destino, env("AUTOMACAO_SEGREDO"), {
      evento,
      eventoAsaas: corpo.event,
      idEvento: corpo.id,
      quando: new Date().toISOString(),
      cliente: {
        asaasId: cliente.id,
        nome: cliente.name,
        oficina: cliente.company,
        email: cliente.email,
        whatsapp: cliente.mobilePhone ? `55${cliente.mobilePhone}` : null,
        cpfCnpj: cliente.cpfCnpj,
      },
      assinatura: p?.subscription ?? corpo.subscription?.id ?? null,
      pagamento: p ? { id: p.id, valor: p.value, status: p.status, forma: p.billingType, vencimento: p.dueDate, link: p.invoiceUrl } : null,
    });
    if (!r.ok) {
      console.error(`[webhook] automação respondeu ${r.status} para ${corpo.event}`);
      return { status: 502, corpo: { erro: "automação indisponível" } };
    }
    return { status: 200, corpo: { ok: true, repassado: true } };
  } catch (e) {
    console.error("[webhook] falha ao repassar", e);
    return { status: 502, corpo: { erro: "falha ao repassar" } };
  }
}
