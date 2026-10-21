import { env } from "@/server/env";

// Cliente mínimo da API do Asaas (v3). A chave fica só no servidor.

export type ClienteAsaas = {
  id: string;
  name: string;
  email: string | null;
  mobilePhone: string | null;
  cpfCnpj: string;
  company: string | null;
  externalReference: string | null;
};

export type AssinaturaAsaas = { id: string; status: string; customer: string };

export type CobrancaAsaas = {
  id: string;
  status: string;
  value: number;
  billingType: string;
  dueDate: string;
  invoiceUrl: string;
  customer: string;
  subscription: string | null;
  externalReference: string | null;
};

type Lista<T> = { data: T[]; totalCount: number };

export class ErroAsaas extends Error {
  constructor(
    public status: number,
    public erros: { code: string; description: string }[],
  ) {
    super(erros.map((e) => e.description).join(" ") || `Asaas respondeu ${status}`);
  }
}

async function asaas<T>(metodo: "GET" | "POST" | "DELETE", caminho: string, corpo?: unknown): Promise<T> {
  const resposta = await fetch(env("ASAAS_API_URL") + caminho, {
    method: metodo,
    headers: { access_token: env("ASAAS_API_KEY"), "Content-Type": "application/json", "User-Agent": "checkzap-lp" },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
    signal: AbortSignal.timeout(15000),
  });
  const json = (await resposta.json().catch(() => ({}))) as { errors?: { code: string; description: string }[] };
  if (!resposta.ok) throw new ErroAsaas(resposta.status, json.errors ?? []);
  return json as T;
}

export async function clientePorDocumento(cpfCnpj: string): Promise<ClienteAsaas | null> {
  const r = await asaas<Lista<ClienteAsaas>>("GET", `/customers?cpfCnpj=${cpfCnpj}&limit=1`);
  return r.data[0] ?? null;
}

export function buscarCliente(id: string): Promise<ClienteAsaas> {
  return asaas<ClienteAsaas>("GET", `/customers/${id}`);
}

// Cria o cliente ou atualiza o que já existe com o mesmo CPF/CNPJ.
// Isso já deixa o lead registrado no Asaas antes do pagamento.
// Quem já tem assinatura ativa não é alterado: o formulário é público e
// não pode trocar o e-mail ou o WhatsApp de um cliente só sabendo o CPF dele.
export async function salvarCliente(dados: {
  nome: string;
  oficina: string;
  email: string;
  celular: string;
  cpfCnpj: string;
  referencia: string;
}): Promise<{ cliente: ClienteAsaas; assinatura: AssinaturaAsaas | null }> {
  const corpo = {
    name: dados.nome,
    company: dados.oficina,
    email: dados.email,
    mobilePhone: dados.celular,
    cpfCnpj: dados.cpfCnpj,
    externalReference: dados.referencia,
    notificationDisabled: false,
  };
  const existente = await clientePorDocumento(dados.cpfCnpj);
  if (!existente) return { cliente: await asaas<ClienteAsaas>("POST", "/customers", corpo), assinatura: null };
  const assinatura = await assinaturaAtiva(existente.id);
  if (assinatura) return { cliente: existente, assinatura };
  return { cliente: await asaas<ClienteAsaas>("POST", `/customers/${existente.id}`, corpo), assinatura: null };
}

export async function assinaturaAtiva(clienteId: string): Promise<AssinaturaAsaas | null> {
  const r = await asaas<Lista<AssinaturaAsaas>>("GET", `/subscriptions?customer=${clienteId}&status=ACTIVE&limit=1`);
  return r.data[0] ?? null;
}

export async function cobrancasDaAssinatura(assinaturaId: string): Promise<CobrancaAsaas[]> {
  const r = await asaas<Lista<CobrancaAsaas>>("GET", `/subscriptions/${assinaturaId}/payments`);
  return r.data;
}

// Data de hoje no horário de Brasília (o Asaas recusa vencimento no passado)
function hojeBrasil(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

export type PixAsaas = { encodedImage: string; payload: string; expirationDate: string };

// QR code (PNG em base64) e o código "copia e cola" de uma cobrança Pix
export function pixDaCobranca(cobrancaId: string): Promise<PixAsaas> {
  return asaas<PixAsaas>("GET", `/payments/${cobrancaId}/pixQrCode`);
}

export function buscarCobranca(cobrancaId: string): Promise<CobrancaAsaas> {
  return asaas<CobrancaAsaas>("GET", `/payments/${cobrancaId}`);
}

// Endpoint que só existe no sandbox: marca a cobrança como paga
export function confirmarNoSandbox(cobrancaId: string): Promise<CobrancaAsaas> {
  return asaas<CobrancaAsaas>("POST", `/sandbox/payment/${cobrancaId}/confirm`);
}

// Assinatura de quem começou antes desta regra (Pix, cartão ou boleto) passa a ser só Pix,
// inclusive a cobrança que ainda está em aberto.
export async function garantirPix(assinaturaId: string): Promise<void> {
  await asaas("POST", `/subscriptions/${assinaturaId}`, { billingType: "PIX", updatePendingPayments: true });
}

// Mensalidade só por Pix
export async function criarAssinatura(clienteId: string, referencia: string): Promise<AssinaturaAsaas> {
  const corpo = {
    customer: clienteId,
    billingType: "PIX",
    value: Number(env("PLANO_VALOR") || 97),
    nextDueDate: hojeBrasil(),
    cycle: "MONTHLY",
    description: "CheckZap · plano completo",
    externalReference: referencia,
  };
  const site = env("SITE_URL");
  if (site.startsWith("https://")) {
    try {
      // volta para a LP depois de pagar; só funciona com o domínio cadastrado no Asaas
      return await asaas<AssinaturaAsaas>("POST", "/subscriptions", {
        ...corpo,
        callback: { successUrl: `${site.replace(/\/$/, "")}/obrigado`, autoRedirect: true },
      });
    } catch (e) {
      if (!(e instanceof ErroAsaas) || !e.erros.some((x) => x.code === "invalid_object")) throw e;
    }
  }
  return asaas<AssinaturaAsaas>("POST", "/subscriptions", corpo);
}
