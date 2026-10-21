import { z } from "zod";

// Formulário de compra: validado no navegador e de novo no servidor.

export const soDigitos = (v: string) => v.replace(/\D/g, "");

function cpfValido(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const dv = (base: string, pesoInicial: number) => {
    const soma = base.split("").reduce((s, n, i) => s + Number(n) * (pesoInicial - i), 0);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return dv(cpf.slice(0, 9), 10) === Number(cpf[9]) && dv(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

function cnpjValido(cnpj: string): boolean {
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const dv = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = base.split("").reduce((s, n, i) => s + Number(n) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  return dv(cnpj.slice(0, 12)) === Number(cnpj[12]) && dv(cnpj.slice(0, 13)) === Number(cnpj[13]);
}

// WhatsApp brasileiro: DDD + número, com ou sem 55 na frente
export function celularBR(v: string): string | null {
  let d = soDigitos(v);
  if (d.length >= 12 && d.startsWith("55")) d = d.slice(2);
  return d.length === 10 || d.length === 11 ? d : null;
}

export const FormularioSchema = z.object({
  nome: z.string().trim().min(3, "Escreva seu nome").max(80),
  oficina: z.string().trim().min(2, "Escreva o nome da oficina").max(80),
  email: z.string().trim().toLowerCase().email("E-mail inválido").max(120),
  whatsapp: z.string().refine((v) => celularBR(v) !== null, "WhatsApp com DDD, ex.: (11) 98765-4321"),
  cpfCnpj: z.string().refine((v) => {
    const d = soDigitos(v);
    return d.length === 11 ? cpfValido(d) : cnpjValido(d);
  }, "CPF ou CNPJ inválido"),
  // campo escondido (armadilha para robô). Só o servidor confere; o nome é
  // propositalmente sem sentido para o autopreenchimento do navegador não mexer nele.
  czx: z.string().max(200).optional(),
});

export type Formulario = z.infer<typeof FormularioSchema>;

// Pix mostrado dentro da LP (o token deixa o navegador consultar só esta cobrança)
// `teste` liga o botão de pagamento simulado (só no sandbox do Asaas)
export type DadosPix = { id: string; token: string; valor: number; imagem: string; copiaECola: string; teste: boolean };

export type ResultadoCheckout = { ok: true; url: string; pix: DadosPix | null } | { ok: false; erro: string };

export const ConsultaPixSchema = z.object({
  id: z.string().regex(/^pay_[A-Za-z0-9]{1,40}$/),
  token: z.string().regex(/^[0-9a-f]{64}$/),
});

// Máscaras de digitação
export function mascaraCelular(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascaraDocumento(v: string): string {
  const d = soDigitos(v).slice(0, 14);
  if (d.length <= 11) {
    return d
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}
