import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

// Limite de tentativas por IP, em memória. Na Vercel cada instância tem a própria memória:
// segura abuso simples (alguém criando cliente no Asaas sem parar). Para ataque de verdade,
// ligar uma regra de rate limit no Firewall da Vercel.
const baldes = new Map<string, { n: number; ate: number }>();

export function permitido(chave: string, maximo: number, janelaMs: number): boolean {
  const agora = Date.now();
  if (baldes.size > 5000) {
    for (const [k, b] of baldes) if (b.ate < agora) baldes.delete(k);
  }
  const b = baldes.get(chave);
  if (!b || b.ate < agora) {
    baldes.set(chave, { n: 1, ate: agora + janelaMs });
    return true;
  }
  b.n += 1;
  return b.n <= maximo;
}

// IP de quem chamou. A Vercel preenche x-real-ip e x-forwarded-for com o IP verdadeiro.
export function ipDaRequisicao(): string {
  const real = getRequestHeader("x-real-ip");
  if (real) return real.trim();
  const encaminhado = getRequestHeader("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0].trim();
  return getRequestIP() ?? "desconhecido";
}
