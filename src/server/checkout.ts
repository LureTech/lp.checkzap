import { env } from "@/server/env";
import { enviarAssinado } from "@/server/assinado";
import { ErroAsaas, cobrancasDaAssinatura, criarAssinatura, garantirPix, salvarCliente } from "@/server/asaas";
import { prepararPix } from "@/server/pix";
import { celularBR, soDigitos, type Formulario, type ResultadoCheckout } from "@/lib/formulario";

// Formulário enviado -> cliente no Asaas (lead) -> assinatura -> link da 1ª cobrança.
export async function iniciarAssinatura(dados: Formulario): Promise<ResultadoCheckout> {
  console.log(`[checkout] pedido de ${dados.email.replace(/^(.).*@/, "$1***@")}`);
  // Preenchimento automático/IA do navegador também mexe no campo armadilha. Só recusa
  // se, além disso, o envio veio rápido demais para uma pessoa (ou sem o tempo, direto na API).
  if (dados.czx) {
    const rapido = (dados.tempoMs ?? 0) < 3000;
    console.warn(`[checkout] campo armadilha preenchido, enviado em ${dados.tempoMs ?? "?"} ms${rapido ? ", pedido recusado" : ", segue"}`);
    if (rapido) {
      return { ok: false, erro: "Não foi possível continuar. Recarregue a página e tente de novo, ou chame a gente no WhatsApp." };
    }
  }
  if (!env("ASAAS_API_KEY")) return { ok: false, erro: "Pagamento indisponível no momento. Chame a gente no WhatsApp." };

  const celular = celularBR(dados.whatsapp) as string;
  const cpfCnpj = soDigitos(dados.cpfCnpj);
  const referencia = `lp:${cpfCnpj}`;

  try {
    const salvo = await salvarCliente({ nome: dados.nome, oficina: dados.oficina, email: dados.email, celular, cpfCnpj, referencia });
    const cliente = salvo.cliente;

    // Já começou antes e não pagou: reaproveita a mesma cobrança em vez de abrir outra.
    // Se já pagou alguma vez, é cliente: a cobrança em aberto é a do mês seguinte (o Asaas gera
    // sozinho) e não pode ser oferecida aqui, senão a pessoa paga a próxima mensalidade adiantada.
    let assinatura = salvo.assinatura;
    const cobrancas = assinatura ? await cobrancasDaAssinatura(assinatura.id) : [];
    const jaPagou = cobrancas.some((c) => ["RECEIVED", "CONFIRMED", "RECEIVED_IN_CASH"].includes(c.status));
    let cobranca = cobrancas.find((c) => c.status === "PENDING" || c.status === "OVERDUE");
    if (assinatura && (jaPagou || !cobranca)) {
      return { ok: false, erro: "Você já é cliente do CheckZap. Para entrar, use o acesso que chegou no seu e-mail ou chame o suporte no WhatsApp." };
    }
    if (assinatura && cobranca && cobranca.billingType !== "PIX") {
      await garantirPix(assinatura.id);
      cobranca = (await cobrancasDaAssinatura(assinatura.id)).find((c) => c.id === cobranca?.id) ?? cobranca;
    }
    if (!assinatura) {
      assinatura = await criarAssinatura(cliente.id, referencia);
      cobranca = (await cobrancasDaAssinatura(assinatura.id))[0];
    }
    if (!cobranca) return { ok: false, erro: "Não conseguimos gerar o pagamento agora. Tente de novo em instantes." };

    await avisarLead({
      evento: "lead",
      quando: new Date().toISOString(),
      cliente: { asaasId: cliente.id, nome: dados.nome, oficina: dados.oficina, email: dados.email, whatsapp: `55${celular}`, cpfCnpj },
      assinatura: assinatura.id,
      cobranca: { id: cobranca.id, valor: cobranca.value, vencimento: cobranca.dueDate, link: cobranca.invoiceUrl },
    });

    return { ok: true, url: cobranca.invoiceUrl, pix: await prepararPix(cobranca) };
  } catch (e) {
    if (e instanceof ErroAsaas && e.status === 400 && e.message) return { ok: false, erro: e.message };
    console.error("[checkout] falha ao iniciar assinatura", e);
    return { ok: false, erro: "Não conseguimos gerar o pagamento agora. Tente de novo em instantes." };
  }
}

// Lead salvo no CRM antes de pagar (n8n ou backend). Não trava o checkout se falhar.
async function avisarLead(evento: unknown) {
  const url = env("LEAD_WEBHOOK_URL");
  if (!url) return;
  try {
    const r = await enviarAssinado(url, env("AUTOMACAO_SEGREDO"), evento);
    if (!r.ok) console.warn("[checkout] CRM respondeu", r.status);
  } catch (e) {
    console.warn("[checkout] não deu para avisar o CRM", e);
  }
}
