/// <reference types="node" />

// Variáveis do servidor: primeiro as do ambiente (produção), depois o .env da raiz (dev).
// Em dev o .env é lido aqui com o parser do Node porque:
// - a config do Vite troca o texto "process.env" por um objeto fixo no código do servidor;
// - um plugin carrega o .env antes expandindo "$...", o que zera a chave do Asaas ($aact_...).
const proc = globalThis.process;
let arquivo: Record<string, string> | null = null;

function lerArquivo(): Record<string, string> {
  if (arquivo) return arquivo;
  arquivo = {};
  try {
    const fs = proc?.getBuiltinModule?.("node:fs") as typeof import("node:fs") | undefined;
    const util = proc?.getBuiltinModule?.("node:util") as typeof import("node:util") | undefined;
    if (fs?.existsSync(".env") && util?.parseEnv) arquivo = util.parseEnv(fs.readFileSync(".env", "utf8")) as Record<string, string>;
  } catch {
    // sem acesso a arquivo (ex.: Workers): fica só com o ambiente
  }
  return arquivo;
}

export function env(nome: string): string {
  const doAmbiente = (proc?.env?.[nome] ?? "").trim();
  const doArquivo = (lerArquivo()[nome] ?? "").trim();
  // Em dev o .env manda: o valor que entrou no processo na primeira subida fica preso nele
  // mesmo depois de o Vite reiniciar por mudança no .env. Em produção não há .env.
  if (import.meta.env.DEV) return doArquivo || doAmbiente;
  return doAmbiente || doArquivo;
}
