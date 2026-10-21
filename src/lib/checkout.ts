import { createServerFn } from "@tanstack/react-start";
import { ConsultaPixSchema, FormularioSchema, type ResultadoCheckout } from "@/lib/formulario";

// Chamadas do formulário de compra. O código do Asaas só roda no servidor.
const MINUTO = 60_000;

export const iniciarCheckout = createServerFn({ method: "POST" })
  .validator((dados: unknown) => FormularioSchema.parse(dados))
  .handler(async ({ data }): Promise<ResultadoCheckout> => {
    const { ipDaRequisicao, permitido } = await import("@/server/limite");
    // cada envio cria ou atualiza um cliente no Asaas: poucos por IP
    if (!permitido(`checkout:${ipDaRequisicao()}`, 6, 10 * MINUTO)) {
      return { ok: false, erro: "Muitas tentativas seguidas. Espere alguns minutos e tente de novo, ou chame a gente no WhatsApp." };
    }
    const { iniciarAssinatura } = await import("@/server/checkout");
    return iniciarAssinatura(data);
  });

// Botão de teste: só funciona com a conta sandbox do Asaas
export const simularPix = createServerFn({ method: "POST" })
  .validator((dados: unknown) => ConsultaPixSchema.parse(dados))
  .handler(async ({ data }): Promise<{ ok: boolean; erro?: string }> => {
    const { ipDaRequisicao, permitido } = await import("@/server/limite");
    if (!permitido(`simular:${ipDaRequisicao()}`, 10, 10 * MINUTO)) return { ok: false, erro: "Muitas tentativas. Espere um pouco." };
    const { simularPagamento, tokenValido } = await import("@/server/pix");
    if (!(await tokenValido(data.id, data.token))) return { ok: false, erro: "Pagamento não encontrado." };
    try {
      return await simularPagamento(data.id);
    } catch (e) {
      console.error("[pix] falha ao simular pagamento", e);
      return { ok: false, erro: "Não deu para simular agora. Tente de novo." };
    }
  });

// O modal pergunta de tempos em tempos se o Pix já caiu (a cada 4 s, ~15 por minuto)
export const consultarPix = createServerFn({ method: "POST" })
  .validator((dados: unknown) => ConsultaPixSchema.parse(dados))
  .handler(async ({ data }): Promise<{ pago: boolean }> => {
    const { ipDaRequisicao, permitido } = await import("@/server/limite");
    if (!permitido(`pix:${ipDaRequisicao()}`, 45, MINUTO)) return { pago: false };
    const { conferirEAvisar, tokenValido } = await import("@/server/pix");
    if (!(await tokenValido(data.id, data.token))) return { pago: false };
    try {
      return { pago: await conferirEAvisar(data.id) };
    } catch {
      return { pago: false };
    }
  });
