// Assinatura HMAC-SHA256 com Web Crypto (funciona em Node e em Workers).
const codificador = new TextEncoder();

export async function hmacHex(segredo: string, corpo: string): Promise<string> {
  const chave = await crypto.subtle.importKey("raw", codificador.encode(segredo), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const assinatura = await crypto.subtle.sign("HMAC", chave, codificador.encode(corpo));
  return Array.from(new Uint8Array(assinatura), (b) => b.toString(16).padStart(2, "0")).join("");
}

// Compara em tempo constante para não vazar o token por tempo de resposta
export function iguais(a: string, b: string): boolean {
  const x = codificador.encode(a);
  const y = codificador.encode(b);
  let diferenca = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diferenca |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diferenca === 0;
}

// Manda um evento assinado para a automação (n8n ou backend do CheckZap).
// O destino confere o header x-checkzap-assinatura com o mesmo segredo.
export async function enviarAssinado(url: string, segredo: string, evento: unknown): Promise<Response> {
  const corpo = JSON.stringify(evento);
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-checkzap-assinatura": `sha256=${await hmacHex(segredo, corpo)}`,
    },
    body: corpo,
    signal: AbortSignal.timeout(10000),
  });
}
