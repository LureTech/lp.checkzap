import { useEffect, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, LoaderCircle, Lock, QrCode, Smartphone, X } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Confetti } from "@/components/Confetti";
import { consultarPix, iniciarCheckout, simularPix } from "@/lib/checkout";
import { FormularioSchema, mascaraCelular, mascaraDocumento, type DadosPix, type Formulario } from "@/lib/formulario";

type Campo = Exclude<keyof Formulario, "czx">;
const CAMPOS: Campo[] = ["nome", "oficina", "email", "whatsapp", "cpfCnpj"];
const VAZIO: Record<Campo | "czx", string> = { nome: "", oficina: "", email: "", whatsapp: "", cpfCnpj: "", czx: "" };

// Abre com qualquer link para #comecar (botões de CTA da página)
export function CheckoutModal() {
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [pix, setPix] = useState<{ dados: DadosPix; fatura: string } | null>(null);
  const [pago, setPago] = useState(false);
  const primeiroCampo = useRef<HTMLInputElement>(null);
  const etapa = pago ? 2 : pix ? 1 : 0;

  // Com o Pix na tela, confere de tempos em tempos se ele caiu
  useEffect(() => {
    if (!aberto || !pix || pago) return;
    let ativo = true;
    const conferir = async () => {
      try {
        const r = await consultarPix({ data: { id: pix.dados.id, token: pix.dados.token } });
        if (ativo && r.pago) setPago(true);
      } catch {
        // rede instável: tenta de novo na próxima volta
      }
    };
    const id = setInterval(conferir, 4000);
    return () => {
      ativo = false;
      clearInterval(id);
    };
  }, [aberto, pix, pago]);

  useEffect(() => {
    if (!pago) return;
    const t = setTimeout(() => (window.location.href = "/obrigado"), 3200);
    return () => clearTimeout(t);
  }, [pago]);

  useEffect(() => {
    const abrir = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href="#comecar"]');
      if (!link) return;
      e.preventDefault();
      setAberto(true);
    };
    document.addEventListener("click", abrir);
    if (window.location.hash === "#comecar") setAberto(true);
    return () => document.removeEventListener("click", abrir);
  }, []);

  useEffect(() => {
    if (!aberto) return;
    const fechar = (e: KeyboardEvent) => e.key === "Escape" && !enviando && setAberto(false);
    document.addEventListener("keydown", fechar);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => primeiroCampo.current?.focus(), 250);
    return () => {
      document.removeEventListener("keydown", fechar);
      document.body.style.overflow = overflow;
      clearTimeout(t);
    };
  }, [aberto, enviando]);

  const mudar = (campo: Campo, valor: string) => {
    const v = campo === "whatsapp" ? mascaraCelular(valor) : campo === "cpfCnpj" ? mascaraDocumento(valor) : valor;
    setForm((f) => ({ ...f, [campo]: v }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  };

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErroGeral(null);
    const r = FormularioSchema.safeParse(form);
    if (!r.success) {
      const novos: Partial<Record<Campo, string>> = {};
      for (const issue of r.error.issues) {
        const campo = issue.path[0] as Campo;
        if (CAMPOS.includes(campo) && !novos[campo]) novos[campo] = issue.message;
      }
      setErros(novos);
      // erro fora dos campos visíveis nunca pode travar em silêncio
      if (Object.keys(novos).length === 0) setErroGeral("Confira os dados e tente de novo.");
      return;
    }
    setEnviando(true);
    try {
      const res = await iniciarCheckout({ data: r.data });
      if (res.ok && res.pix) {
        setPix({ dados: res.pix, fatura: res.url });
        setEnviando(false);
        return;
      }
      if (res.ok) {
        window.location.href = res.url;
        return;
      }
      setErroGeral(res.erro);
    } catch (err) {
      console.error("[checkout]", err);
      setErroGeral("Não conseguimos gerar o pagamento agora. Tente de novo em instantes.");
    }
    setEnviando(false);
  }

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-[#0f1a15]/55 backdrop-blur-sm sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && !enviando && setAberto(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-titulo"
            className="relative w-full sm:max-w-[920px] max-h-[94vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white shadow-[0_40px_100px_-20px_rgba(15,26,21,0.5)] grid md:grid-cols-[0.85fr_1.15fr]"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={() => !enviando && setAberto(false)}
              className="absolute right-3 top-3 z-10 h-9 w-9 rounded-full bg-white/80 hover:bg-surface-2 flex items-center justify-center text-muted-foreground"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Resumo do plano */}
            <div className="relative bg-cream border-b md:border-b-0 md:border-r border-border p-6 sm:p-8 overflow-hidden flex flex-col">
              <div className="absolute -top-32 -left-32 h-80 w-80 brilho-verde" />
              <div className="absolute -bottom-36 -right-28 h-80 w-80 brilho-claro" />
              <div className="relative flex-1 flex flex-col">
                <div className="flex items-center gap-2.5">
                  <LogoMark className="h-9 w-9" />
                  <div className="leading-tight">
                    <div className="font-display font-bold text-ink">CheckZap</div>
                    <div className="text-xs text-muted-foreground">plano completo</div>
                  </div>
                </div>
                <div className="mt-6 flex items-end gap-1">
                  <span className="font-display text-xl font-semibold text-ink/70 mb-2">R$</span>
                  <span className="font-display text-6xl font-bold text-gradient-brand leading-none">97</span>
                  <span className="text-muted-foreground mb-1.5">/mês</span>
                </div>
                <ul className="hidden md:block mt-6 space-y-3 text-sm">
                  {[
                    "Pagamento por Pix, na hora",
                    "Acesso no zap e no e-mail em segundos",
                    "Implantação sozinha, em 6 aulas curtas",
                    "Suporte no WhatsApp individual",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-0.5 h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-white" strokeWidth={3} />
                      </span>
                      <span className="text-foreground/85">{t}</span>
                    </li>
                  ))}
                </ul>
                {/* O que acontece daqui pra frente */}
                <ol className="hidden md:block mt-auto pt-8 relative">
                  <span className="absolute left-[13px] top-11 bottom-4 w-px bg-primary/25" />
                  {[
                    { t: "Seus dados", d: etapa > 0 ? "pronto" : "agora, leva 1 minuto" },
                    { t: "Pagamento", d: pago ? "Pix recebido" : "Pix, confirma na hora" },
                    { t: "Acesso no zap", d: "em segundos depois de pagar" },
                  ].map((p, i) => (
                    <li key={p.t} className="relative flex items-center gap-3 py-1.5">
                      <span
                        className={`relative h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-500 ${
                          i < etapa
                            ? "bg-primary text-white"
                            : i === etapa
                              ? "bg-primary text-white shadow-[0_0_0_4px_rgba(0,168,98,0.15)]"
                              : "bg-white border border-border text-muted-foreground"
                        }`}
                      >
                        {i < etapa ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="leading-tight">
                        <span className={`block text-sm font-semibold ${i <= etapa ? "text-ink" : "text-foreground/70"}`}>{p.t}</span>
                        <span className="block text-xs text-muted-foreground">{p.d}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
            {pix ? (
              <PixPasso key="pix" pix={pix.dados} fatura={pix.fatura} pago={pago} voltar={() => setPix(null)} aoPagar={() => setPago(true)} />
            ) : (
            /* Formulário */
            <motion.form
              key="form"
              onSubmit={enviar}
              noValidate
              className="p-6 sm:p-8"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 id="checkout-titulo" className="font-display text-2xl font-bold">Comece agora</h2>
              <p className="mt-1 text-sm text-muted-foreground">Leva 1 minuto. Depois é só pagar com Pix.</p>

              <div className="mt-6 grid gap-4">
                <CampoTexto ref={primeiroCampo} rotulo="Seu nome" valor={form.nome} erro={erros.nome} autoComplete="name" onChange={(v) => mudar("nome", v)} />
                <CampoTexto rotulo="Nome da oficina" valor={form.oficina} erro={erros.oficina} autoComplete="organization" onChange={(v) => mudar("oficina", v)} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <CampoTexto
                    rotulo="WhatsApp"
                    valor={form.whatsapp}
                    erro={erros.whatsapp}
                    tipo="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="(11) 98765-4321"
                    onChange={(v) => mudar("whatsapp", v)}
                    dica="Vira o número do dono no CheckZap."
                  />
                  <CampoTexto
                    rotulo="CPF ou CNPJ"
                    valor={form.cpfCnpj}
                    erro={erros.cpfCnpj}
                    inputMode="numeric"
                    onChange={(v) => mudar("cpfCnpj", v)}
                    dica="Para emitir a cobrança."
                  />
                </div>
                <CampoTexto rotulo="E-mail" valor={form.email} erro={erros.email} tipo="email" inputMode="email" autoComplete="email" onChange={(v) => mudar("email", v)} dica="Seu login e a senha chegam aqui." />
                {/* robôs preenchem este campo; pessoas não veem */}
                <input
                  type="text"
                  name="czx"
                  data-1p-ignore
                  data-lpignore="true"
                  data-form-type="other"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  value={form.czx}
                  onChange={(e) => setForm((f) => ({ ...f, czx: e.target.value }))}
                />
              </div>

              <AnimatePresence>
                {erroGeral && (
                  <motion.p
                    className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                  >
                    {erroGeral}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" disabled={enviando} className="btn-primary btn-shimmer mt-6 w-full !py-3.5 !text-base disabled:opacity-70 disabled:cursor-wait">
                {enviando ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Gerando seu Pix…
                  </>
                ) : (
                  <>
                    Gerar meu Pix <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" /> Pagamento por Pix, processado pelo Asaas. O QR code aparece na próxima tela.
              </p>
            </motion.form>
            )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------- PAGAMENTO PIX ---------------- */
function PixPasso({ pix, fatura, pago, voltar, aoPagar }: { pix: DadosPix; fatura: string; pago: boolean; voltar: () => void; aoPagar: () => void }) {
  const [copiado, setCopiado] = useState(false);
  const [simulando, setSimulando] = useState(false);
  const [erroSimulacao, setErroSimulacao] = useState<string | null>(null);

  async function simular() {
    setSimulando(true);
    setErroSimulacao(null);
    try {
      const r = await simularPix({ data: { id: pix.id, token: pix.token } });
      if (r.ok) aoPagar();
      else setErroSimulacao(r.erro ?? "Não deu para simular agora.");
    } catch {
      setErroSimulacao("Não deu para simular agora. Tente de novo.");
    }
    setSimulando(false);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(pix.copiaECola);
    } catch {
      // navegador sem permissão de área de transferência: copia pelo jeito antigo
      const campo = document.createElement("textarea");
      campo.value = pix.copiaECola;
      document.body.appendChild(campo);
      campo.select();
      document.execCommand("copy");
      campo.remove();
    }
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  const valor = pix.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <motion.div
      className="relative p-6 sm:p-8 overflow-hidden"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <Confetti active={pago} />
      <AnimatePresence mode="wait" initial={false}>
        {pago ? (
          <motion.div
            key="pago"
            className="min-h-[460px] flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="h-20 w-20 rounded-full bg-primary flex items-center justify-center shadow-[var(--shadow-glow)]"
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
            >
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </motion.div>
            <h2 id="checkout-titulo" className="mt-6 font-display text-3xl font-bold">Pix recebido!</h2>
            <p className="mt-2 text-muted-foreground max-w-xs">Estamos criando a sua oficina. O acesso chega no seu WhatsApp e no e-mail em instantes.</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-dark">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Indo para os próximos passos…
            </div>
          </motion.div>
        ) : (
          <motion.div key="aguardando" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
            <div className="flex items-start justify-between gap-4 pr-8">
              <div>
                <h2 id="checkout-titulo" className="font-display text-2xl font-bold">Pague com Pix</h2>
                <p className="mt-1 text-sm text-muted-foreground">Escaneie o QR code no app do seu banco ou use o Pix copia e cola.</p>
              </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-[auto_1fr] gap-6 items-center">
              {/* QR code com moldura e leitura animada */}
              <div className="relative mx-auto">
                <div className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-primary/30 via-emerald-200/40 to-primary/10 blur-xl" />
                <div className="relative rounded-3xl bg-white p-3 ring-2 ring-primary/30 shadow-[var(--shadow-card)]">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img src={pix.imagem} alt="QR code do Pix" width={200} height={200} className="block h-44 w-44 sm:h-52 sm:w-52" />
                    <span className="pointer-events-none absolute inset-0 varrer">
                      <span className="absolute inset-x-2 top-[4%] h-[3px] rounded-full bg-primary shadow-[0_0_14px_3px_rgba(0,168,98,0.55)]" />
                    </span>
                  </div>
                  {/* cantos de mira */}
                  {["top-1.5 left-1.5 border-t-[3px] border-l-[3px] rounded-tl-xl", "top-1.5 right-1.5 border-t-[3px] border-r-[3px] rounded-tr-xl", "bottom-1.5 left-1.5 border-b-[3px] border-l-[3px] rounded-bl-xl", "bottom-1.5 right-1.5 border-b-[3px] border-r-[3px] rounded-br-xl"].map((c) => (
                    <span key={c} className={`absolute h-6 w-6 border-primary ${c}`} />
                  ))}
                </div>
              </div>

              <div className="text-center sm:text-left">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Valor</div>
                <div className="font-display text-4xl font-bold text-ink">{valor}</div>
                <div className="text-xs text-muted-foreground">mensalidade do CheckZap · plano completo</div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-800">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                  Aguardando o pagamento
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Esta tela atualiza sozinha quando o Pix cair.</p>
              </div>
            </div>

            {/* Copia e cola */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-ink mb-1.5">Pix copia e cola</div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 min-w-0 rounded-xl border border-border bg-surface-2/60 px-4 py-3 font-mono text-[12px] text-muted-foreground truncate" title={pix.copiaECola}>
                  {pix.copiaECola}
                </div>
                <button type="button" onClick={copiar} className={`btn-primary !py-3 shrink-0 transition-colors ${copiado ? "!bg-none !bg-brand-dark" : ""}`}>
                  {copiado ? (
                    <>
                      <Check className="h-4 w-4" strokeWidth={3} /> Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copiar código
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Só no ambiente de teste do Asaas: paga sem banco */}
            {pix.teste && (
              <div className="mt-4 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/70 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 text-xs text-amber-900 leading-snug">
                  <b className="block text-[13px]">Ambiente de teste</b>
                  Este Pix é do sandbox e não aceita pagamento de banco. Simule para ver o resto do fluxo.
                </div>
                <button
                  type="button"
                  onClick={simular}
                  disabled={simulando}
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 px-4 py-2.5 text-sm font-bold text-amber-950 transition disabled:opacity-70 disabled:cursor-wait"
                >
                  {simulando ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" strokeWidth={3} />}
                  {simulando ? "Confirmando…" : "Simular pagamento"}
                </button>
                {erroSimulacao && <p className="sm:basis-full text-xs font-medium text-destructive" role="alert">{erroSimulacao}</p>}
              </div>
            )}

            {/* Como pagar */}
            <ol className="mt-6 grid sm:grid-cols-3 gap-2">
              {[
                { i: Smartphone, t: "Abra o banco" },
                { i: QrCode, t: "Escolha Pix" },
                { i: Check, t: "Escaneie ou cole" },
              ].map(({ i: Icon, t }, n) => (
                <li key={t} className="flex items-center gap-2.5 rounded-xl bg-surface-2/70 border border-border px-3 py-2.5 text-[13px] text-foreground/85">
                  <span className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  <span>
                    <span className="text-muted-foreground mr-1">{n + 1}.</span>
                    {t}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-sm">
              <button type="button" onClick={voltar} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink">
                <ArrowLeft className="h-4 w-4" /> Corrigir meus dados
              </button>
              <a href={fatura} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-brand-dark hover:text-primary">
                Abrir a fatura <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" /> Pagamento seguro, processado pelo Asaas para Lure Digital.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CampoTexto({
  rotulo,
  valor,
  erro,
  onChange,
  tipo = "text",
  dica,
  ref,
  ...resto
}: {
  rotulo: string;
  valor: string;
  erro?: string;
  onChange: (v: string) => void;
  tipo?: string;
  dica?: ReactNode;
  ref?: Ref<HTMLInputElement>;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = `campo-${rotulo.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink mb-1.5">{rotulo}</label>
      <input
        ref={ref}
        id={id}
        type={tipo}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!erro}
        aria-describedby={erro || dica ? `${id}-info` : undefined}
        className={`w-full rounded-xl border bg-surface-2/60 px-4 py-3 text-[15px] text-ink outline-none transition focus:bg-white focus:ring-4 ${
          erro ? "border-destructive/60 focus:ring-destructive/15" : "border-border focus:border-primary focus:ring-primary/15"
        }`}
        {...resto}
      />
      {(erro || dica) && (
        <p id={`${id}-info`} className={`mt-1 text-xs ${erro ? "text-destructive font-medium" : "text-muted-foreground"}`}>{erro ?? dica}</p>
      )}
    </div>
  );
}
