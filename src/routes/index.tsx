import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, LayoutGroup, MotionConfig } from "motion/react";

import {
  Car, ClipboardList, Camera, MessageCircle, Package, Receipt, Check, ChevronDown, Menu, X, Sparkles, ArrowRight,
  Zap, ShieldCheck, Clock, Star, Wrench, CheckCheck, BellRing, Search, EyeOff, LoaderCircle, Mic, KeyRound,
  BadgeCheck, Send, History, Lock, Flame, Video, CircleCheck, Smartphone,
} from "lucide-react";
import MockupCheckZap from "@/components/MockupCheckZap";
import { CheckoutModal } from "@/components/CheckoutModal";
import { Iphone16Pro } from "@/components/Iphone16Pro";
import { Confetti } from "@/components/Confetti";
import { Logo } from "@/components/Logo";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";
import { useLoopSteps } from "@/hooks/use-loop-steps";
import { CTA, DOMINIO, WHATSAPP_URL } from "@/lib/site";
import { VEICULO } from "@/lib/veiculos";
import osCarFront from "@/assets/os-car-front.jpg.asset.json";
import osCarInterior from "@/assets/os-car-interior.jpg.asset.json";
import osCarWheel from "@/assets/os-car-wheel.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
      { rel: "preload", href: "/produto/patio.webp", as: "image", type: "image/webp" },
    ],
  }),
  component: LandingPage,
});

// reducedMotion="user": quem pede menos movimento no sistema vê a página sem as animações
function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <SectionDivider icon={Car} label="Pátio em tempo real" />
      <Kanban />
      <SectionDivider icon={Mic} label="OS pelo WhatsApp" />
      <OSPeloZap />
      <SectionDivider icon={MessageCircle} label="Avisos automáticos" />
      <AvisosWhatsApp />
      <SectionDivider icon={Receipt} label="Orçamento sugerido" />
      <OrcamentoSugerido />
      <SectionDivider icon={Smartphone} label="Página do cliente" />
      <PaginaCliente />
      <SectionDivider icon={Zap} label="Implantação automática" />
      <Implantacao />
      <SectionDivider icon={CircleCheck} label="Plano" />
      <Planos />
      <SectionDivider icon={Search} label="Dúvidas frequentes" />
      <FAQ />
      <SectionDivider icon={KeyRound} label="Comece hoje" />
      <CTAFinal />
      <Footer />
      <FloatingWhatsApp />
      <CheckoutModal />
    </div>
    </MotionConfig>
  );
}

/* ---------------- DIVISOR DE SEÇÃO ---------------- */
function SectionDivider({ icon: Icon = Wrench, label, dark = false }: { icon?: typeof Wrench; label?: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  // as animações contínuas (CSS) só rodam com a divisória na tela
  const naTela = useInView(ref, { margin: "120px" });
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`relative z-10 -my-8 flex h-16 items-center justify-center gap-3 sm:gap-4 px-6 pointer-events-none ${naTela ? "" : "pausado"}`}
    >
      {/* Linha esquerda com pulso de energia correndo para fora */}
      <div className="relative flex-1 max-w-[9rem] sm:max-w-[18rem] h-[2px]">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-l from-primary/50 via-border to-transparent"
          style={{ transformOrigin: "right" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        {inView && (
          <div className="absolute inset-0 pulso-esq">
            <div className="absolute right-0 top-0 h-[2px] w-10 rounded-full bg-gradient-to-l from-primary to-transparent shadow-[0_0_10px_rgba(0,168,98,0.9)]" />
          </div>
        )}
      </div>

      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"
        initial={{ scale: 0 }}
        animate={inView ? { scale: [0, 1.6, 1] } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
      />

      {/* Medalhão central com anel tracejado girando */}
      <div className="relative flex items-center justify-center shrink-0">
        <motion.div
          className="absolute h-[4.25rem] w-[4.25rem]"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="h-full w-full rounded-full border border-dashed border-primary/35 giro-lento" />
        </motion.div>
        <motion.div
          className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-surface to-surface-2 border border-border shadow-[var(--shadow-card)] flex items-center justify-center"
          initial={{ scale: 0, rotate: -135, opacity: 0 }}
          animate={inView ? { scale: 1, rotate: 45, opacity: 1 } : {}}
          transition={{ type: "spring", stiffness: 190, damping: 14, delay: 0.05 }}
        >
          <div className="absolute inset-0 rounded-xl border-2 border-primary/30 pulso-borda" />
          <div className="-rotate-45 flex">
            <div className="flex boia">
              <Icon className="h-[1.15rem] w-[1.15rem] text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Etiqueta anunciando a próxima seção */}
        {label && (
          <motion.span
            className={`absolute top-full mt-3.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] whitespace-nowrap ${dark ? "text-white/70" : "text-muted-foreground"}`}
            initial={{ opacity: 0, y: -6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {label}
          </motion.span>
        )}
      </div>

      <motion.div
        className="h-1.5 w-1.5 rounded-full bg-primary/70 shrink-0"
        initial={{ scale: 0 }}
        animate={inView ? { scale: [0, 1.6, 1] } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
      />

      {/* Linha direita com pulso espelhado */}
      <div className="relative flex-1 max-w-[9rem] sm:max-w-[18rem] h-[2px]">
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/50 via-border to-transparent"
          style={{ transformOrigin: "left" }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        {inView && (
          <div className="absolute inset-0 pulso-dir">
            <div className="absolute left-0 top-0 h-[2px] w-10 rounded-full bg-gradient-to-r from-primary to-transparent shadow-[0_0_10px_rgba(0,168,98,0.9)]" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- NAV ---------------- */
const NAV_LINKS = [
  { href: "#patio", label: "Pátio" },
  { href: "#os", label: "OS pelo zap" },
  { href: "#avisos", label: "Avisos" },
  { href: "#planos", label: "Plano" },
  { href: "#faq", label: "Dúvidas" },
];

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-[9999] pointer-events-none transition-[padding] duration-500 ease-out ${scrolled ? "pt-3 px-3 sm:px-6" : "pt-0 px-0"}`}>
      <div
        className={`pointer-events-auto mx-auto flex items-center justify-between text-foreground transition-all duration-500 ease-out ${
          scrolled
            ? "max-w-5xl h-14 px-5 rounded-full border border-border/60 bg-background/75 supports-[backdrop-filter]:bg-background/60 backdrop-blur-md shadow-[0_10px_40px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.04]"
            : "max-w-7xl h-16 px-5 sm:px-8 rounded-none border-b border-border/40 bg-background/70 supports-[backdrop-filter]:bg-background/50 backdrop-blur-md"
        }`}
      >
        <a href="#" aria-label="CheckZap, início">
          <Logo className="h-7" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-foreground transition">{l.label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <a href="/entrar" className="text-sm text-muted-foreground hover:text-foreground transition">Entrar</a>
          <a href={CTA.href} className={`btn-primary btn-shimmer ${scrolled ? "!py-2 !px-4 !text-[0.85rem]" : ""}`}>{CTA.label}</a>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="pointer-events-auto md:hidden mx-auto max-w-5xl mt-2 rounded-2xl border border-border bg-background px-5 py-4 flex flex-col gap-4 shadow-2xl shadow-foreground/15">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a href="/entrar" onClick={() => setOpen(false)}>Entrar</a>
          <a href={CTA.href} onClick={() => setOpen(false)} className="btn-primary text-center btn-shimmer">{CTA.label}</a>
        </div>
      )}
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-24 md:pt-36 md:pb-32 bg-cream overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* LEFT — texto */}
          <div className="text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white/70 backdrop-blur text-xs text-muted-foreground mb-6"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Fase piloto: abrindo vagas para as primeiras oficinas
            </motion.div>
            <motion.h1
              className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] leading-[1.02] font-bold"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              O mecânico manda áudio, o pátio se mexe e o cliente é avisado{" "}
              <span className="text-underline-brand">tudo pelo WhatsApp.</span>
            </motion.h1>
            <motion.p
              className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              A equipe fala no zap como já faz hoje. O CheckZap transforma em OS, atualiza o pátio sozinho e avisa o cliente na hora certa.{" "}
              <b className="text-foreground">O mecânico usa WhatsApp. A oficina usa CheckZap.</b>
            </motion.p>
            <motion.div
              className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center lg:justify-start"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href={CTA.href} className="btn-primary text-base px-6 py-3.5 btn-shimmer">
                Quero o CheckZap na minha oficina <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#planos" className="btn-ghost text-base px-6 py-3.5">Ver o plano</a>
            </motion.div>
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.55 }}
            >
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Mecânico não instala nada</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Zero treinamento</span>
              <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Nada acontece sem um “sim”</span>
            </motion.div>
          </div>

          {/* RIGHT — pátio real + celular com a conversa */}
          <motion.div
            className="relative w-full pb-12 sm:pb-10 px-4 sm:px-0"
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="animate-float">
              <MockupCheckZap />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- SECTION HELPERS ---------------- */
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      className="max-w-3xl"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-brand-dark text-xs font-medium mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {eyebrow}
      </motion.div>
      <motion.h2
        className="font-display text-3xl md:text-5xl font-bold leading-[1.05]"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >{title}</motion.h2>
      {sub && (
        <motion.p
          className="mt-5 text-lg text-muted-foreground leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >{sub}</motion.p>
      )}
    </motion.div>
  );
}

/* ---------------- KANBAN ---------------- */
type OS = {
  id: string; model: string; plate: string; client: string; mec: string; sub: string; img: string;
  urgente?: boolean; acao?: string; nota?: { icon: typeof Wrench; text: string; tone?: "alerta" | "valor" };
};

// Mesmas colunas, cores e sub-status do painel
const COLUNAS: { title: string; cor: string; icon: typeof Wrench; subs: string; cards: OS[] }[] = [
  {
    title: "Avaliação", cor: "#3b82f6", icon: ClipboardList, subs: "No pátio · No elevador · Diagnóstico ok",
    cards: [
      { id: "1090", model: "HONDA CIVIC", plate: "ABC-1D34", client: "João Silva", mec: "Roberto Martins", sub: "No pátio", img: VEICULO.sedanBranco, urgente: true, acao: "Enviar checklist para Roberto" },
      { id: "1092", model: "TOYOTA COROLLA", plate: "OSA-3F21", client: "Ricardo Alves", mec: "Diego Ramos", sub: "Diagnóstico ok", img: VEICULO.sedanRoxo, nota: { icon: Wrench, text: "Amortecedores dianteiros vazando" } },
    ],
  },
  {
    title: "Orçamento", cor: "#f97316", icon: Receipt, subs: "Em montagem · Revisão · Enviado · Aprovado",
    cards: [
      { id: "1096", model: "JEEP COMPASS", plate: "JEE-9P88", client: "Álvaro Rocha", mec: "Kauan Souza", sub: "Aprovado", img: VEICULO.suvCinza, nota: { icon: Receipt, text: "R$ 600,00 · aprovado há 5h", tone: "valor" } },
      { id: "1094", model: "CHEVROLET ONIX", plate: "QWE-4R56", client: "Ana Paula", mec: "Roberto Martins", sub: "Enviado", img: VEICULO.sedanBranco, nota: { icon: Clock, text: "52h sem resposta", tone: "alerta" } },
    ],
  },
  {
    title: "Peças", cor: "#eab308", icon: Package, subs: "Aguardando · Recebidas",
    cards: [
      { id: "1097", model: "HYUNDAI HB20", plate: "HBV-2O20", client: "Carla Nunes", mec: "Diego Ramos", sub: "Aguardando", img: VEICULO.sedanBranco, nota: { icon: Package, text: "Peças chegam amanhã" } },
    ],
  },
  {
    title: "Execução", cor: "#0ea5e9", icon: Wrench, subs: "Em execução · Serviço feito · Teste e lavagem",
    cards: [
      { id: "1099", model: "TOYOTA HILUX", plate: "HIL-7X77", client: "Pedro Gomes", mec: "Roberto Martins", sub: "Teste e lavagem", img: VEICULO.picapeBranca },
      { id: "1098", model: "VW POLO", plate: "POL-0V11", client: "Marcos Paulo", mec: "Paulo Henrique", sub: "Em execução", img: VEICULO.hatchVerde, nota: { icon: Wrench, text: "Serviços 0/2 · até quarta" } },
    ],
  },
  {
    title: "Entrega", cor: "#22c55e", icon: KeyRound, subs: "Pronto · Entregue",
    cards: [
      { id: "1100", model: "RENAULT KWID", plate: "KWD-5R55", client: "Juliana Prado", mec: "Roberto Martins", sub: "Pronto", img: VEICULO.hatchVermelho, nota: { icon: KeyRound, text: "R$ 600,00 · cliente avisado", tone: "valor" } },
      { id: "1101", model: "YAMAHA FAZER 250", plate: "YAM-2F50", client: "Thiago Lins", mec: "Kauan Souza", sub: "Entregue", img: VEICULO.motoRoxa },
    ],
  },
];

const GOL: OS = { id: "1042", model: "VOLKSWAGEN GOL", plate: "ABC-1D23", client: "Marcos", mec: "Roberto Martins", sub: "", img: VEICULO.hatchVermelho };

// O que o mecânico manda no zap e para onde o Gol vai no pátio
const FRASES = [
  { msg: "subiu no elevador", col: 0, sub: "No elevador" },
  { msg: "diagnóstico: amortecedor vazando", col: 1, sub: "Em montagem" },
  { msg: "pedi a peça, chega amanhã", col: 2, sub: "Aguardando" },
  { msg: "começando o Gol", col: 3, sub: "Em execução" },
  { msg: "pronto", col: 4, sub: "Pronto" },
] as const;
const FRASES_TIMES = [0, 3000, 6000, 9000, 12000] as const;

function Kanban() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.2 });
  const step = useLoopSteps(FRASES_TIMES, 15500, inView);
  const idx = Math.min(FRASES.length - 1, Math.max(0, step - 1));
  const frase = FRASES[idx];

  // No celular o quadro rola de lado: acompanha a coluna do Gol
  const scrollRef = useRef<HTMLDivElement>(null);
  const colRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const sc = scrollRef.current;
    const col = colRefs.current[frase.col];
    if (!inView || !sc || !col || sc.scrollWidth <= sc.clientWidth + 4) return;
    sc.scrollTo({ left: col.offsetLeft - 20, behavior: "smooth" });
  }, [frase.col, inView]);

  return (
    <section id="patio" ref={sectionRef} className="py-14 sm:py-20 md:py-32">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-8">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <SectionHeader
            eyebrow="Pátio em tempo real"
            title={<>Uma frase no zap <span className="text-gradient-brand">e o carro muda de etapa.</span></>}
            sub="O mecânico fala do jeito dele e o pátio se move sozinho: avaliação, orçamento, peças, execução e entrega. Sem perguntar pra ninguém, sem carro esquecido no fundo do pátio."
          />

          {/* Frase que chegou → etapa nova */}
          <div className="claro flex items-center gap-3 rounded-2xl bg-white border border-border shadow-[var(--shadow-card)] p-3 pr-4 xl:min-w-[420px]">
            <span className="h-10 w-10 rounded-full bg-wa flex items-center justify-center shrink-0">
              <IconeWhatsApp className="h-6 w-6 text-white" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[11px] text-muted-foreground">Roberto, no zap:</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={idx}
                  className="text-[15px] font-semibold text-ink leading-snug sm:truncate"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  “{frase.msg}”
                </motion.div>
              </AnimatePresence>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
            <AnimatePresence mode="wait">
              <motion.span
                key={idx}
                className="text-[12px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ backgroundColor: `${COLUNAS[frase.col].cor}1a`, color: COLUNAS[frase.col].cor }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                ● {frase.sub}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <LayoutGroup>
          <motion.div ref={scrollRef} layoutScroll className="relative mt-10 md:mt-14 overflow-x-auto touch-pan-x pb-4 -mx-5 sm:-mx-8 px-5 sm:px-8">
            <div className="grid grid-flow-col auto-cols-[minmax(250px,1fr)] gap-3 min-w-full">
              {COLUNAS.map((col, colIdx) => {
                const Icon = col.icon;
                const aqui = frase.col === colIdx;
                return (
                  <motion.div
                    key={col.title}
                    ref={(el) => {
                      colRefs.current[colIdx] = el;
                    }}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: colIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="rounded-2xl bg-surface border border-border p-3 flex flex-col min-h-[420px]"
                  >
                    <div className="px-2.5 py-2 rounded-lg mb-3" style={{ backgroundColor: `${col.cor}14` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-md flex items-center justify-center" style={{ backgroundColor: col.cor }}>
                            <Icon className="h-3.5 w-3.5 text-white" />
                          </span>
                          <h3 className="font-semibold text-sm">{col.title}</h3>
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground bg-white/70 rounded-md px-1.5 py-0.5 min-w-6 text-center">
                          {col.cards.length + (aqui ? 1 : 0)}
                        </span>
                      </div>
                      <div className="mt-1.5 text-[10.5px] text-muted-foreground truncate">{col.subs}</div>
                    </div>

                    <div className="space-y-3">
                      {aqui && (
                        <motion.div layoutId="os-gol" transition={{ type: "spring", stiffness: 180, damping: 26 }}>
                          <OSCard os={GOL} sub={frase.sub} cor={col.cor} ultima={frase.msg} />
                        </motion.div>
                      )}
                      {col.cards.map((c, cardIdx) => (
                        <motion.div
                          key={c.id}
                          layout
                          initial={{ opacity: 0, y: 20, scale: 0.92 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.15 + cardIdx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <OSCard os={c} sub={c.sub} cor={col.cor} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}

function OSCard({ os, sub, cor, ultima }: { os: OS; sub: string; cor: string; ultima?: string }) {
  const destaque = !!ultima;
  const iniciais = os.mec.split(" ").map((x) => x[0]).slice(0, 2).join("");
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02, boxShadow: "var(--shadow-float)" }}
      className={`claro rounded-xl bg-white border p-3 shadow-sm transition-colors cursor-default ${
        destaque ? "border-primary ring-4 ring-primary/10 shadow-[0_12px_28px_-10px_rgba(0,168,98,0.45)]" : "border-border hover:border-primary/40"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-2 text-muted-foreground border border-border">OS #{os.id}</span>
          {os.urgente && (
            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-0.5 rounded bg-destructive/10 text-destructive border border-destructive/20">
              <Flame className="h-2.5 w-2.5" /> URGENTE
            </span>
          )}
        </span>
        {destaque && (
          <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-primary">
            <Mic className="h-3 w-3" /> pelo zap
          </span>
        )}
      </div>

      <div className="flex items-start gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div className="font-display font-bold text-sm truncate">{os.model}</div>
          <div className="text-[11px] text-muted-foreground truncate">{os.plate} · {os.client}</div>
        </div>
        <div className="rounded-lg bg-surface-2 flex items-center justify-center shrink-0 overflow-hidden h-14 w-20">
          <img src={os.img} alt="" loading="lazy" className="h-full w-full object-contain p-1" />
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] mb-2">
        <span className="h-4 w-4 rounded-full bg-primary/15 text-brand-dark text-[8px] font-bold flex items-center justify-center">{iniciais}</span>
        <span className="text-foreground/80 truncate">{os.mec}</span>
      </div>

      <span className="inline-flex items-center text-[10.5px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cor}1a`, color: cor }}>
        ● {sub}
      </span>

      {os.nota && (
        <div
          className={`mt-2 flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] ${
            os.nota.tone === "alerta" ? "bg-destructive/10 text-destructive font-semibold" : os.nota.tone === "valor" ? "bg-surface-2 text-foreground font-semibold" : "bg-surface-2 text-foreground/80"
          }`}
        >
          <os.nota.icon className="h-3 w-3 shrink-0" />
          <span className="truncate">{os.nota.text}</span>
        </div>
      )}

      {os.acao && (
        <div className="mt-2 w-full rounded-lg bg-primary py-2 text-[11px] font-semibold inline-flex items-center justify-center gap-1.5 text-white">
          <MessageCircle className="h-3.5 w-3.5" /> {os.acao}
        </div>
      )}

      {ultima && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={ultima}
            className="mt-2 pt-2 border-t border-border flex items-center gap-1.5 text-[11px] text-muted-foreground"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
          >
            <IconeWhatsApp className="h-3.5 w-3.5 text-wa shrink-0" />
            <span className="truncate italic">“{ultima}”</span>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
}

/* ---------------- OS PELO ZAP ---------------- */
function OSPeloZap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.35 });

  // O que o CheckZap tirou do áudio, campo por campo
  const campos = [
    { k: "Placa", v: "ABC-1D23" },
    { k: "Carro", v: "Volkswagen Gol" },
    { k: "Cliente", v: "Marcos · já cadastrado" },
    { k: "Relato", v: "Barulho na frente" },
    { k: "Entrega", v: "Sexta" },
  ];

  // Preenche um campo por vez — pausa no fim para comemorar
  const [done, setDone] = useState(0);
  const [showSim, setShowSim] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setDone(0);
    setShowSim(false);
    setCelebrate(false);
    let n = 0;
    let celebrating = false;
    const id = setInterval(() => {
      if (celebrating) return;
      n = n + 1;
      if (n > campos.length) {
        n = 0;
      }
      if (n === campos.length) {
        celebrating = true;
        setTimeout(() => setCelebrate(true), 900);
        setTimeout(() => {
          celebrating = false;
          setCelebrate(false);
          n = 0;
          setDone(0);
        }, 5200);
      }
      setDone(n);
    }, 1000);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => {
    if (done === campos.length) {
      const t = setTimeout(() => setShowSim(true), 600);
      return () => clearTimeout(t);
    }
    setShowSim(false);
  }, [done]);

  return (
    <section id="os" ref={ref} className="py-14 sm:py-20 md:py-32 bg-surface/40 border-y border-border overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <SectionHeader
            eyebrow="OS pelo WhatsApp"
            title={<>O mecânico fala, <span className="text-gradient-brand">a OS se preenche sozinha.</span></>}
            sub="Um áudio no zap e o CheckZap entende placa, carro, cliente e relato. Se a placa já existe, puxa o dono e as visitas anteriores. O mecânico confere e responde “sim”."
          />
          <ul className="mt-8 space-y-4">
            {[
              { i: Mic, t: "Áudio, texto ou foto", d: "Do jeito que ele já manda hoje. Sem app novo." },
              { i: History, t: "Memória do carro", d: "“Esse Gol já veio em março pela suspensão.”" },
              { i: Lock, t: "Nada sem um “sim”", d: "Abrir OS, enviar orçamento e concluir pedem confirmação." },
            ].map(({ i: Icon, t, d }, idx) => (
              <motion.li
                key={t}
                className="flex gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.12 }}
              >
                <div className="h-11 w-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{t}</div>
                  <div className="text-muted-foreground text-sm">{d}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Card da OS se preenchendo */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-10 brilho-verde -z-0" />
          <motion.div
            className={`relative rounded-2xl bg-surface border p-6 transition-[border-color,box-shadow] duration-500 ${
              celebrate ? "border-primary/60 shadow-[0_20px_60px_-15px_rgba(0,168,98,0.35)]" : "border-border shadow-[var(--shadow-card)]"
            }`}
          >
            <Confetti active={celebrate} />
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-muted-foreground">OS #1042</div>
                <div className="font-display font-bold text-xl">Volkswagen Gol</div>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showSim ? "ok" : "lendo"}
                  className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                    showSim ? "bg-[#3b82f6]/10 text-[#2563eb]" : "bg-primary/15 text-brand-dark"
                  }`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${showSim ? "bg-[#3b82f6]" : "bg-primary animate-pulse"}`} />
                  {showSim ? "No pátio" : "Lendo o áudio"}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Áudio que chegou */}
            <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-wa-bubble/60 border border-wa/20">
              <div className="h-11 w-11 rounded-full bg-wa flex items-center justify-center shrink-0">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Áudio do Roberto · 0:07</div>
                <div className="font-semibold text-sm italic text-ink">“Chegou um Gol ABC1D23, barulho na frente, pra sexta”</div>
              </div>
            </div>

            {/* Campos preenchidos um a um */}
            <div className="space-y-2.5">
              {campos.map((c, i) => {
                const isDone = i < done;
                return (
                  <motion.div
                    key={c.k}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-2 border border-border"
                    initial={{ opacity: 0, x: -12 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <motion.div
                      className={`h-5 w-5 rounded-md flex items-center justify-center border ${isDone ? "bg-success border-success" : "border-border bg-transparent"}`}
                      animate={isDone ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <AnimatePresence>
                        {isDone && (
                          <motion.span
                            key="c"
                            initial={{ scale: 0, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          >
                            <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <span className="text-sm text-muted-foreground w-16 shrink-0">{c.k}</span>
                    <span className={`text-sm font-semibold transition-opacity duration-300 ${isDone ? "opacity-100" : "opacity-0"}`}>{c.v}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Progresso */}
            <div className="mt-5 pt-4 border-t border-border">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Preenchido pelo áudio</span>
                <span className="font-semibold text-ink">{done}/{campos.length}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/70"
                  animate={{ width: `${(done / campos.length) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            <AnimatePresence>
              {showSim && (
                <motion.div
                  className="mt-4 flex items-center gap-3 rounded-xl border border-wa/30 bg-wa/10 p-3"
                  initial={{ opacity: 0, y: 16, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wa text-white"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.1 }}
                  >
                    <IconeWhatsApp className="h-5 w-5" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-wa-dark">Roberto respondeu “sim”</div>
                    <div className="text-xs text-wa-dark/70">OS aberta e Marcos avisado no zap</div>
                  </div>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.25 }}>
                    <CircleCheck className="h-5 w-5 text-wa" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- AVISOS NO WHATSAPP ---------------- */
function AvisosWhatsApp() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.05 });
  const phoneRef = useRef<HTMLDivElement>(null);
  const phoneInView = useInView(phoneRef, { once: false, amount: 0.45 });

  // Textos padrão dos avisos do painel (WhatsApp → Avisos ao cliente)
  const messages = [
    { emoji: "👋", l1: "Oi, Marcos!", l2: <>Seu <b>Gol (ABC1D23)</b> foi recebido aqui na Oficina do Roberto. Vamos te avisando por aqui cada etapa do serviço.</>, time: "08:14", delay: 0.4 },
    { emoji: "🔧", l1: "Oi, Marcos!", l2: <>Seu Gol acabou de <b>subir no elevador</b> para analisarmos o barulho na frente.</>, time: "08:40", delay: 2.0 },
    { emoji: "📋", l1: "Marcos,", l2: <>segue o <b>orçamento</b> do seu Gol. É só revisar e aprovar pelo link.</>, time: "10:46", delay: 3.6 },
    { emoji: "🔑", l1: "Seu Gol está pronto!", l2: <>Troca dos amortecedores feita. <b>Pode retirar até as 18h.</b></>, time: "16:32", delay: 5.2 },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (!phoneInView) {
      setVisible(0);
      return;
    }
    setVisible(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    messages.forEach((m, i) => {
      timers.push(setTimeout(() => {
        setVisible((v) => Math.max(v, i + 1));
      }, m.delay * 1000));
    });
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [phoneInView]);

  return (
    <section id="avisos" className="py-14 sm:py-20 md:py-32" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* Celular do cliente com WhatsApp */}
        <motion.div
          className="order-2 lg:order-1 relative flex justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-10 brilho-zap -z-0" />

          <div ref={phoneRef} className="relative z-10" style={{ width: 320, height: 640 }}>
            <Iphone16Pro width={320} className="w-full h-full" />
            <div
              className="absolute overflow-hidden flex flex-col"
              style={{ top: "3.2%", left: "7.04%", width: "85.99%", height: "93.59%", borderRadius: 39 }}
            >
              {/* Status bar */}
              <div className="flex justify-between items-center px-5 pt-2.5 pb-1 text-white text-[11px] font-semibold shrink-0 bg-[#0b141a]">
                <span>9:41</span>
                <span className="opacity-0">·</span>
                <span className="flex items-center gap-1 text-[10px]">
                  <span>•••</span>
                  <span>5G</span>
                  <span>▮</span>
                </span>
              </div>

              {/* WhatsApp header */}
              <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2 border-b border-white/5 shrink-0">
                <ArrowRight className="h-4 w-4 text-white/70 rotate-180" />
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-brand-dark flex items-center justify-center text-white font-bold text-xs">OR</div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-semibold truncate">Oficina do Roberto</div>
                  <div className="text-[#25D366] text-[11px]">online</div>
                </div>
                <div className="flex gap-3 text-white/70">
                  <Camera className="h-4 w-4" />
                  <MessageCircle className="h-4 w-4" />
                </div>
              </div>

              {/* Chat — papel de parede escuro do WhatsApp; as mensagens novas ficam embaixo e as antigas sobem */}
              <div
                className="flex-1 min-h-0 px-3 py-3 flex flex-col justify-end gap-2 overflow-hidden relative"
                style={{
                  backgroundColor: "#0b141a",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='0.045' stroke-width='1.2'%3E%3Cpath d='M20 30 q10 -12 22 -2 q10 10 -2 20 q-12 8 -22 -2 q-8 -10 2 -16 z'/%3E%3Cpath d='M90 60 l6 -8 l10 4 l-2 10 l-10 4 z'/%3E%3Ccircle cx='160' cy='40' r='10'/%3E%3Cpath d='M195 90 q8 -4 12 4 q4 8 -4 12 q-8 4 -12 -4 q-4 -8 4 -12 z'/%3E%3Cpath d='M40 120 q14 -6 18 8 q4 14 -10 16 q-14 2 -16 -12 q-2 -12 8 -12 z'/%3E%3Cpath d='M120 130 l14 0 l6 12 l-14 8 l-12 -8 z'/%3E%3Cpath d='M190 170 q10 -10 20 0 q10 10 0 20 q-10 10 -20 0 q-10 -10 0 -20 z'/%3E%3Cpath d='M60 200 l10 -6 l12 6 l-2 14 l-14 2 z'/%3E%3Cpath d='M140 210 q8 -8 16 0 q8 8 0 16 q-8 8 -16 0 q-8 -8 0 -16 z'/%3E%3Cpath d='M15 165 l8 -4 l6 8 l-6 8 l-10 -4 z'/%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "240px 240px",
                }}
              >
                <div className="text-center mb-auto">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#182229] text-white/60 text-[11px]">hoje</span>
                </div>

                <AnimatePresence>
                  {messages.slice(0, visible).map((m, i) => (
                    <motion.div
                      key={i}
                      layout="position"
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="flex justify-start"
                    >
                      {/* Card com prévia do link, como no WhatsApp */}
                      <div className="max-w-[90%] bg-[#202c33] text-white rounded-lg rounded-tl-sm shadow-sm overflow-hidden">
                        <div className="bg-[#1a2830] px-2.5 py-1.5 border-l-[3px] border-[#25D366]">
                          <div className="text-[11px] font-semibold text-white leading-tight">Oficina do Roberto</div>
                          <div className="text-[9px] text-white/60 leading-tight">{DOMINIO}</div>
                        </div>
                        <div className="px-2.5 py-1.5">
                          <div className="text-[11px] leading-snug">
                            <span className="mr-1">{m.emoji}</span>
                            {m.l1}
                          </div>
                          <div className="text-[11px] leading-snug mt-1">{m.l2}</div>
                          <div className="mt-1.5 text-[10px] leading-snug">
                            <div className="flex items-center gap-1 text-white/85">
                              <span>🔍</span>
                              <span>Acompanhe seu carro:</span>
                            </div>
                            <div className="text-[#53bdeb] underline break-all mt-0.5">{DOMINIO}/r/8f2k91c…</div>
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] text-white/60">
                            {m.time}
                            <CheckCheck className="h-3 w-3 text-[#53bdeb]" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Composer */}
              <div className="bg-[#0b141a] border-t border-white/5 px-3 py-2 flex items-center gap-2 shrink-0">
                <div className="flex-1 rounded-full bg-[#202c33] px-3 py-1.5 text-white/40 text-xs">Mensagem</div>
                <div className="h-8 w-8 rounded-full bg-[#25D366] flex items-center justify-center">
                  <Mic className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="order-1 lg:order-2"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <SectionHeader
            eyebrow="Avisos automáticos"
            title={<>Cada etapa avisa o cliente <span className="text-gradient-brand">sozinha no WhatsApp.</span></>}
            sub="Quando o carro muda de etapa, o CheckZap manda a mensagem certa pro cliente, com o nome dele, o carro e o link de acompanhamento. E a pergunta “já tá pronto?” para de chegar na recepção."
          />
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            {[
              { t: "Ninguém digita nada", d: "Mudou a etapa no zap ou no painel, a mensagem sai sozinha." },
              { t: "8 momentos", d: "Chegou, elevador, orçamento, aprovado, peça, execução, pronto e entregue." },
              { t: "Só no horário da oficina", d: "Nada de mensagem de madrugada pro seu cliente." },
              { t: "Cliente pediu, parou", d: "Se ele responder “sair”, para de receber os avisos." },
            ].map((x, i) => (
              <motion.div
                key={x.t}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.1 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="rounded-xl bg-surface border border-border p-4 hover:border-primary/40 hover:shadow-[0_8px_24px_-8px_rgba(0,168,98,0.25)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={inView ? { rotate: [0, -12, 12, -8, 8, 0] } : {}}
                    transition={{ duration: 0.9, delay: 0.6 + i * 0.15, ease: "easeInOut" }}
                  >
                    <BellRing className="h-4 w-4 text-primary" />
                  </motion.div>
                  <div className="font-semibold text-sm">{x.t}</div>
                </div>
                <div className="text-sm text-muted-foreground">{x.d}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- ORÇAMENTO SUGERIDO ---------------- */
function AnimatedNumber({ value, format = (n: number) => String(n), duration = 0.9 }: { value: number; format?: (n: number) => string; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    prev.current = value;
    if (from === value) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{format(display)}</>;
}

const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")},00`;

function OrcamentoSugerido() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Ciclo: diagnóstico chega -> IA busca no catálogo -> orçamento pronto e enviado
  const mockRef = useRef<HTMLDivElement>(null);
  const mockInView = useInView(mockRef, { once: false, amount: 0.35 });
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");

  useEffect(() => {
    if (!mockInView) {
      setPhase("idle");
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;
    const cycle = () => {
      if (cancelled) return;
      setPhase("idle");
      timers.push(setTimeout(() => setPhase("scanning"), 1600));
      timers.push(setTimeout(() => setPhase("done"), 4600));
      timers.push(setTimeout(cycle, 10800));
    };
    cycle();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [mockInView]);

  const done = phase === "done";
  const scanning = phase === "scanning";

  // Tilt 3D que acompanha o mouse (desktop)
  const tiltXRaw = useMotionValue(0);
  const tiltYRaw = useMotionValue(0);
  const tiltX = useSpring(tiltXRaw, { stiffness: 180, damping: 22 });
  const tiltY = useSpring(tiltYRaw, { stiffness: 180, damping: 22 });
  const handleTilt = (e: { clientX: number; clientY: number; currentTarget: EventTarget & HTMLDivElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    tiltYRaw.set(px * 7);
    tiltXRaw.set(-py * 5);
  };
  const resetTilt = () => {
    tiltXRaw.set(0);
    tiltYRaw.set(0);
  };

  // Valores só ilustram o mockup
  const itens = [
    { n: "Amortecedor dianteiro (par)", t: "Peça", v: 420 },
    { n: "Troca dos amortecedores", t: "Mão de obra", v: 130 },
    { n: "Alinhamento", t: "Serviço", v: 50 },
  ];

  return (
    <section id="orcamento" className="py-14 sm:py-20 md:py-32 bg-surface/40 border-y border-border" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <div>
          <SectionHeader
            eyebrow="Orçamento sugerido"
            title={<>O diagnóstico vira <span className="text-gradient-brand">orçamento pronto pra enviar.</span></>}
            sub="O mecânico fala o que achou no zap. O CheckZap monta o orçamento com o catálogo de serviços da sua oficina, a recepção revisa e envia com um toque. O cliente aprova pelo link e fica tudo registrado."
          />
          <ul className="mt-8 space-y-4">
            {[
              { i: Sparkles, t: "Sugerido pelo seu catálogo", d: "Peças, mão de obra e serviços que a oficina já cobra." },
              { i: Send, t: "Enviado com um toque", d: "A recepção revisa e manda. Ninguém digita valor no zap." },
              { i: BadgeCheck, t: "Aprovação registrada", d: "O que foi enviado e o que foi aprovado fica guardado na OS." },
              { i: EyeOff, t: "Mecânico não vê valores", d: "O dono libera o orçamento só pra quem ele quiser." },
            ].map((x, idx) => (
              <motion.li
                key={x.t}
                className="flex gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="h-11 w-11 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                  <x.i className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{x.t}</div>
                  <div className="text-muted-foreground text-sm">{x.d}</div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        <div style={{ perspective: 1400 }} className="relative">
          {/* Glow ambiente atrás do card */}
          <div className={`absolute -inset-10 -z-10 pointer-events-none transition-opacity duration-700 brilho-laranja ${done ? "opacity-0" : "opacity-100"}`} />
          <div className={`absolute -inset-10 -z-10 pointer-events-none transition-opacity duration-700 brilho-verde ${done ? "opacity-100" : "opacity-0"}`} />
          <motion.div
            ref={mockRef}
            className="relative rounded-2xl bg-surface border border-border shadow-[var(--shadow-card)] overflow-hidden"
            initial={{ opacity: 0, y: 48, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
            onMouseMove={handleTilt}
            onMouseLeave={resetTilt}
          >
            <Confetti active={done} />

            {/* Brilho que varre o card no sucesso */}
            <AnimatePresence>
              {done && (
                <motion.div
                  className="absolute inset-y-0 w-1/3 pointer-events-none z-40 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  style={{ skewX: -18 }}
                  initial={{ left: "-45%", opacity: 0 }}
                  animate={{ left: "125%", opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            {/* Toolbar tipo janela */}
            <div className="border-b border-border p-3.5 flex items-center justify-between bg-surface-2/60">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/70" />
                <div className="w-3 h-3 rounded-full bg-warning/70" />
                <div className="w-3 h-3 rounded-full bg-success/70" />
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  ao vivo
                </span>
                <motion.div
                  className="px-3 py-1 bg-primary/15 text-brand-dark text-[10px] font-bold uppercase tracking-wider rounded-full border border-primary/30"
                >
                  OS #1042 · Gol
                </motion.div>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-3 p-4">
              {[
                { label: "Para revisar", num: done ? 0 : 1, fmt: (n: number) => String(n), delta: "-1", tint: true },
                { label: "Enviados hoje", num: done ? 5 : 4, fmt: (n: number) => String(n), delta: "+1", tint: false },
                { label: "Orçamento", num: done ? 600 : 0, fmt: (n: number) => `R$ ${n}`, delta: "novo", tint: false, underline: true },
              ].map((kpi, idx) => (
                <motion.div
                  key={kpi.label}
                  className={`relative p-3 rounded-xl border shadow-sm ${kpi.tint ? "bg-primary/10 border-primary/25" : "bg-surface border-border"}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -3, transition: { duration: 0.2 } }}
                >
                  <AnimatePresence>
                    {done && (
                      <motion.span
                        className="absolute top-1.5 right-1.5 text-[8px] font-bold text-success bg-success/10 border border-success/30 rounded-full px-1.5 py-px"
                        initial={{ opacity: 0, y: 6, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.35, delay: 0.35 + idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {kpi.delta}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <p className={`text-[10px] font-semibold uppercase tracking-wide ${kpi.tint ? "text-brand-dark" : "text-muted-foreground"}`}>{kpi.label}</p>
                  <motion.p
                    className={`mt-1 text-xl font-display font-bold text-foreground tabular-nums ${kpi.underline ? "underline decoration-primary decoration-2 underline-offset-4" : ""}`}
                    animate={done ? { scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.12 }}
                  >
                    <AnimatedNumber value={mockInView ? kpi.num : 0} format={kpi.fmt} duration={done ? 0.7 : 1.1} />
                  </motion.p>
                </motion.div>
              ))}
            </div>

            {/* Diagnóstico chegando e IA montando */}
            <motion.div
              className="relative mx-4 mb-4 p-3 rounded-xl border flex items-center justify-between overflow-hidden"
              animate={
                done
                  ? { backgroundColor: "rgba(0,168,98,0.08)", borderColor: "rgba(0,168,98,0.35)" }
                  : { backgroundColor: "rgba(249,115,22,0.07)", borderColor: "rgba(249,115,22,0.3)" }
              }
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="absolute bottom-0 left-0 h-[3px] bg-primary rounded-full"
                initial={false}
                animate={scanning ? { width: "100%", opacity: 1 } : { width: "0%", opacity: 0 }}
                transition={scanning ? { width: { duration: 2.8, ease: "easeInOut" }, opacity: { duration: 0.15 } } : { duration: 0.3 }}
              />

              {/* Itens do catálogo voando para dentro do orçamento */}
              <AnimatePresence>
                {scanning &&
                  ["Amortecedor", "Mão de obra", "Alinhamento"].map((t, i) => (
                    <motion.div
                      key={t}
                      className="absolute flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-border shadow-md text-[9px] font-semibold text-foreground z-10 pointer-events-none"
                      style={{ top: "50%" }}
                      initial={{ left: "72%", y: "-50%", opacity: 0, scale: 0.9 }}
                      animate={{ left: ["72%", "9%"], y: "-50%", opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.4] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.8, ease: "easeInOut" }}
                    >
                      <Receipt className="w-3 h-3 text-primary" />
                      {t}
                    </motion.div>
                  ))}
              </AnimatePresence>
              <div className="flex items-center gap-3 min-w-0">
                <motion.div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${done ? "bg-success text-white" : "bg-[#f97316] text-white"} ${scanning ? "animate-spin [animation-duration:1.2s]" : ""}`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={done ? "check" : "sparkles"}
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.4, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex"
                    >
                      {done ? <Check className="w-4.5 h-4.5" strokeWidth={3} /> : <Sparkles className="w-4.5 h-4.5" />}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">Roberto: “diagnóstico: amortecedor vazando”</p>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.p
                      key={phase}
                      className="text-[10px] text-muted-foreground truncate"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      {phase === "idle" && "Chegou pelo zap · pronto para montar"}
                      {phase === "scanning" && "Buscando no catálogo da oficina..."}
                      {phase === "done" && "Orçamento revisado e enviado pro Marcos ✓"}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
              <motion.div
                className={`px-3 py-1.5 text-[10px] font-bold rounded-lg shadow-sm shrink-0 inline-flex items-center gap-1.5 ${done ? "bg-success text-white" : "bg-primary text-white"}`}
                animate={scanning ? { scale: [1, 0.88, 1] } : { scale: 1 }}
                transition={{ duration: 0.35 }}
              >
                {scanning && <LoaderCircle className="w-3 h-3 animate-spin" />}
                {phase === "idle" && "Montar"}
                {phase === "scanning" && "Montando..."}
                {phase === "done" && "Enviado"}
              </motion.div>
            </motion.div>

            {/* Tabela do orçamento */}
            <div className="px-4 pb-4">
              <div className="bg-surface rounded-lg border border-border overflow-hidden relative">
                <AnimatePresence>
                  {scanning && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-10 varrer-rapido"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="h-12 bg-gradient-to-b from-transparent via-primary/15 to-transparent border-b border-primary/40" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <table className="w-full text-left">
                  <thead className="bg-surface-2 text-[10px] text-muted-foreground font-semibold">
                    <tr>
                      <th className="px-3 py-2 uppercase tracking-wide">Item</th>
                      <th className="px-3 py-2 uppercase tracking-wide">Valor</th>
                      <th className="px-3 py-2 text-right uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px] text-foreground divide-y divide-border">
                    {itens.map((row, rowIdx) => (
                      <motion.tr
                        key={row.n}
                        initial={{ opacity: 0, y: 14 }}
                        animate={inView ? { opacity: 1, y: 0, backgroundColor: done ? "rgba(0,168,98,0.07)" : "rgba(0,0,0,0)" } : {}}
                        transition={{ duration: 0.45, delay: done ? rowIdx * 0.12 : 0.5 + rowIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <td className="px-3 py-2.5">
                          <span className="font-semibold block text-foreground">{row.n}</span>
                          <span className="text-[9px] text-muted-foreground">{row.t}</span>
                        </td>
                        <td className="px-3 py-2.5 font-mono tabular-nums text-foreground">{scanning || done ? brl(row.v) : "—"}</td>
                        <td className="px-3 py-2.5 text-right">
                          <AnimatePresence mode="popLayout" initial={false}>
                            <motion.span
                              key={done ? "ok" : scanning ? "sug" : "esp"}
                              className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[9px] border ${
                                done
                                  ? "bg-success/10 text-success border-success/30"
                                  : scanning
                                    ? "bg-primary/10 text-brand-dark border-primary/30"
                                    : "bg-surface-2 text-muted-foreground border-border"
                              }`}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.5, opacity: 0 }}
                              transition={{ duration: 0.3, delay: rowIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            >
                              {done ? "Enviado" : scanning ? "Sugerido" : "Aguardando"}
                            </motion.span>
                          </AnimatePresence>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rodapé */}
            <div className="px-4 py-3 bg-surface-2/60 border-t border-border flex items-center justify-between text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <EyeOff className="h-3.5 w-3.5" /> O mecânico não vê os valores
              </span>
              <span className="font-display font-bold text-sm tabular-nums">Total {scanning || done ? brl(600) : "—"}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PÁGINA DO CLIENTE ---------------- */
type Evento = { h: string; t: string; quem: string; origem: "zap" | "auto" | "painel" | "cliente"; icon: typeof Wrench };

const EVENTOS: Evento[] = [
  { h: "08:05", t: "OS aberta", quem: "Carlos, por áudio", origem: "zap", icon: Mic },
  { h: "08:06", t: "Aviso “no pátio” enviado", quem: "Automático", origem: "auto", icon: BellRing },
  { h: "08:30", t: "Subiu no elevador", quem: "Carlos, no zap", origem: "zap", icon: Wrench },
  { h: "09:12", t: "Fotos e vídeo do diagnóstico", quem: "Carlos, no zap", origem: "zap", icon: Video },
  { h: "09:40", t: "Orçamento enviado", quem: "Recepção, no painel", origem: "painel", icon: Send },
  { h: "09:52", t: "Orçamento aprovado", quem: "Eduardo, pelo link", origem: "cliente", icon: BadgeCheck },
  { h: "15:20", t: "Pronto para retirar", quem: "Carlos, no zap", origem: "zap", icon: KeyRound },
  { h: "16:05", t: "Avaliou com 5 estrelas", quem: "Eduardo, pelo link", origem: "cliente", icon: Star },
];

const ORIGEM: Record<Evento["origem"], { label: string; cls: string }> = {
  zap: { label: "zap", cls: "bg-wa/15 text-wa-dark" },
  auto: { label: "automático", cls: "bg-primary/10 text-brand-dark" },
  painel: { label: "painel", cls: "bg-[#3b82f6]/10 text-[#2563eb]" },
  cliente: { label: "cliente", cls: "bg-amber-100 text-amber-700" },
};

function PaginaCliente() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [filtro, setFiltro] = useState<"tudo" | "zap" | "cliente">("tudo");
  const [aprovado, setAprovado] = useState(false);
  const eventos = EVENTOS.filter((e) => filtro === "tudo" || (filtro === "zap" ? e.origem === "zap" : e.origem === "cliente" || e.origem === "auto"));

  // Valores só ilustram o mockup
  const itens = [
    { n: "Pastilhas de freio dianteiras", v: 260 },
    { n: "Disco de freio (par)", v: 480 },
    { n: "Mão de obra", v: 150 },
  ];
  const etapas = ["Avaliação", "Orçamento", "Peças", "Execução", "Entrega"];
  const atual = aprovado ? 3 : 1;

  return (
    <section id="cliente" className="py-14 sm:py-20 md:py-32 bg-surface/40 border-y border-border" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="Página do cliente"
          title={<>O cliente acompanha e aprova <span className="text-gradient-brand">sem baixar nada.</span></>}
          sub="Pelo link que chega no zap, sem senha, o cliente vê onde o carro está, as fotos da entrada, o vídeo do diagnóstico e o orçamento pra aprovar. E cada passo fica na linha do tempo da OS, com quem fez e por onde."
        />

        <div className="mt-10 md:mt-14 grid lg:grid-cols-2 gap-6">
          {/* PÁGINA DO CLIENTE */}
          <motion.div
            className="claro rounded-[28px] bg-[#eef3f0] border border-border overflow-hidden hover-lift shadow-xl"
            initial={{ opacity: 0, y: 50, rotateY: -5 }}
            animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.01 }}
          >
            <div className="px-3 pt-3">
              <div className="rounded-2xl overflow-hidden bg-neutral-900 relative h-44">
                <img src={osCarFront.url} alt="Honda Civic na oficina" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
                <div className="absolute left-4 bottom-4 text-white">
                  <div className="text-[10px] font-bold tracking-widest text-[#3ee69a] uppercase">Acompanhe seu carro</div>
                  <div className="font-display font-bold text-xl leading-none mt-1">Honda Civic · RXO-4187</div>
                </div>
                <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-ink">
                  <Lock className="h-3 w-3" /> sem login
                </div>
              </div>
            </div>

            <div className="px-6 pt-4 pb-6 relative">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 rounded-2xl bg-white shadow-lg border border-border flex items-center justify-center font-display font-bold text-xl text-brand-dark">
                OR
              </div>
              <div className="text-center mt-8">
                <div className="font-display font-bold text-xl text-neutral-900">Oficina do Roberto</div>
                <div className="text-xs text-neutral-500 mt-1">Olá, Eduardo! Seu carro está em <b className="text-brand-dark">{etapas[atual]}</b>.</div>
              </div>

              {/* Onde o carro está */}
              <div className="mt-5 flex items-start">
                {etapas.map((e, i) => {
                  const feito = i < atual;
                  const agora = i === atual;
                  return (
                    <div key={e} className="flex-1 flex flex-col items-center gap-1.5 relative">
                      {i > 0 && <span className={`absolute top-[9px] right-1/2 w-full h-[2px] transition-colors duration-500 ${feito || agora ? "bg-primary" : "bg-neutral-300"}`} />}
                      <span
                        className={`relative h-5 w-5 rounded-full flex items-center justify-center transition-colors duration-500 ${
                          feito ? "bg-primary" : agora ? "bg-white border-2 border-primary" : "bg-white border-2 border-neutral-300"
                        }`}
                      >
                        {feito && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                        {agora && <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
                      </span>
                      <span className={`text-[10px] font-semibold ${agora ? "text-brand-dark" : "text-neutral-500"}`}>{e}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-white border border-neutral-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-neutral-900 text-sm flex items-center gap-1.5"><Camera className="h-4 w-4 text-primary" /> Fotos da entrada</div>
                    <span className="text-[11px] text-neutral-500 inline-flex items-center gap-1"><Video className="h-3 w-3" /> + vídeo do diagnóstico</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[osCarFront.url, osCarInterior.url, osCarWheel.url].map((src) => (
                      <img key={src} src={src} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-lg object-cover" />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-neutral-200 p-4 relative overflow-hidden">
                  <Confetti active={aprovado} />
                  <div className="font-bold text-neutral-900 text-sm flex items-center gap-1.5"><Receipt className="h-4 w-4 text-primary" /> Orçamento</div>
                  <div className="mt-2.5 space-y-1.5">
                    {itens.map((it) => (
                      <div key={it.n} className="flex justify-between gap-2 text-xs">
                        <span className="text-neutral-600 truncate">{it.n}</span>
                        <span className="font-semibold tabular-nums shrink-0">{brl(it.v)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
                    <div className="text-sm font-bold text-neutral-900">Total {brl(890)}</div>
                    <AnimatePresence mode="wait" initial={false}>
                      {aprovado ? (
                        <motion.button
                          key="ok"
                          type="button"
                          onClick={() => setAprovado(false)}
                          className="text-xs font-bold px-4 py-2 rounded-full bg-primary/10 text-brand-dark inline-flex items-center gap-1.5"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                        >
                          <BadgeCheck className="h-4 w-4" /> Aprovado
                        </motion.button>
                      ) : (
                        <motion.button
                          key="btn"
                          type="button"
                          onClick={() => setAprovado(true)}
                          className="text-xs font-bold px-4 py-2 rounded-full bg-neutral-900 text-white"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                        >
                          Aprovar orçamento
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* LINHA DO TEMPO */}
          <motion.div
            className="claro rounded-2xl bg-white border border-border p-6 hover-lift shadow-xl"
            initial={{ opacity: 0, y: 50, rotateY: 5 }}
            animate={inView ? { opacity: 1, y: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, scale: 1.01 }}
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
                <History className="h-4 w-4 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-neutral-900">Linha do tempo da OS #1027</div>
                <div className="text-xs text-neutral-500">Tudo que aconteceu, quem fez e por onde.</div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {([["tudo", "Tudo"], ["zap", "Equipe no zap"], ["cliente", "Cliente"]] as const).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setFiltro(k)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition ${
                    filtro === k ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <ol className="mt-5 relative">
              <span className="absolute left-[17px] top-2 bottom-2 w-px bg-neutral-200" />
              <AnimatePresence initial={false}>
                {eventos.map((e, i) => (
                  <motion.li
                    key={e.h}
                    layout
                    className="relative flex items-start gap-3 py-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.35, delay: inView ? 0.4 + i * 0.06 : 0 }}
                  >
                    <span className="relative z-10 h-9 w-9 rounded-xl bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                      <e.icon className="h-4 w-4 text-primary" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-neutral-900 truncate">{e.t}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${ORIGEM[e.origem].cls}`}>{ORIGEM[e.origem].label}</span>
                      </div>
                      <div className="text-xs text-neutral-500">{e.quem}</div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-400 tabular-nums pt-1">{e.h}</span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- IMPLANTAÇÃO AUTOMÁTICA ---------------- */
const FUNIL = [
  { t: "Seus dados e o Pix", d: "Direto aqui no site. O Pix confirma na hora." },
  { t: "Acesso criado em segundos", d: "A oficina e o dono no CheckZap. Seu WhatsApp já entra como dono." },
  { t: "Boas-vindas no zap e no e-mail", d: "Login, senha provisória e o link da primeira aula." },
  { t: "6 aulas curtas", d: "A oficina implanta sozinha, no ritmo dela." },
  { t: "Oficina rodando", d: "A primeira OS aberta por um áudio no zap." },
];

// Cada aula só conta como feita quando a ação aparece no sistema
const AULAS = [
  { t: "Cadastrar a equipe", conta: "1º mecânico vinculado" },
  { t: "Primeira OS pelo zap", conta: "1ª OS criada pelo bot" },
  { t: "Catálogo e preços", conta: "serviços com preço" },
  { t: "Avisos ao cliente", conta: "avisos revisados e ligados" },
  { t: "Conectar o WhatsApp da oficina", conta: "número conectado" },
  { t: "Orçamento e aprovação", conta: "1º orçamento aprovado" },
];

function Implantacao() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const trilhaRef = useRef<HTMLDivElement>(null);
  const trilhaInView = useInView(trilhaRef, { amount: 0.4 });

  // Marca uma aula por vez; no 6 de 6 comemora e recomeça
  const [feitas, setFeitas] = useState(0);
  useEffect(() => {
    if (!trilhaInView) return;
    setFeitas(0);
    let n = 0;
    let pausa = false;
    const id = setInterval(() => {
      if (pausa) return;
      n += 1;
      setFeitas(n);
      if (n === AULAS.length) {
        pausa = true;
        setTimeout(() => {
          n = 0;
          setFeitas(0);
          pausa = false;
        }, 4500);
      }
    }, 1100);
    return () => clearInterval(id);
  }, [trilhaInView]);
  const completa = feitas === AULAS.length;

  return (
    <section id="implantacao" className="py-14 sm:py-20 md:py-32 bg-surface/40 border-y border-border overflow-hidden" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <div>
          <SectionHeader
            eyebrow="Implantação 100% automática"
            title={<>Pagou hoje, <span className="text-gradient-brand">a oficina roda sem nenhuma call.</span></>}
            sub="Ninguém da Lure precisa entrar no meio. O pagamento aprovado cria a oficina e o dono na hora, o acesso chega no zap e no e-mail, e 6 aulas curtas levam até a primeira OS pelo WhatsApp."
          />

          {/* Do pagamento à oficina rodando */}
          <ol className="mt-8 relative">
            <motion.span
              className="absolute left-[19px] top-3 w-[2px] bg-gradient-to-b from-primary to-primary/20 origin-top"
              style={{ bottom: "1.5rem" }}
              initial={{ scaleY: 0 }}
              animate={inView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
            {FUNIL.map((f, i) => (
              <motion.li
                key={f.t}
                className="relative flex gap-4 pb-5 last:pb-0"
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-sm border ${
                    i === FUNIL.length - 1 ? "bg-primary text-white border-primary shadow-[var(--shadow-glow)]" : "bg-white text-brand-dark border-primary/30"
                  }`}
                >
                  {i === FUNIL.length - 1 ? <Check className="h-5 w-5" strokeWidth={3} /> : i + 1}
                </span>
                <div className="pt-1.5">
                  <div className="font-semibold">{f.t}</div>
                  <div className="text-sm text-muted-foreground">{f.d}</div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Trilha de aulas */}
        <motion.div
          ref={trilhaRef}
          className="relative"
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-10 brilho-verde" />
          <div className="relative rounded-2xl bg-surface border border-border p-5 sm:p-6 shadow-[var(--shadow-card)] overflow-hidden">
            <Confetti active={completa} />
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Oficina do Roberto</div>
                <div className="font-display font-bold text-xl">Trilha de implantação</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-primary/15 text-brand-dark text-xs font-semibold tabular-nums">{feitas} de {AULAS.length}</span>
            </div>
            <div className="hidden sm:flex justify-between px-1 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span>Aula</span>
              <span>Conta como feita quando o sistema vê</span>
            </div>
            <div className="space-y-2">
              {AULAS.map((a, i) => {
                const feita = i < feitas;
                return (
                  <div key={a.t} className={`flex items-center gap-3 rounded-xl border p-2.5 transition-colors duration-300 ${feita ? "bg-primary/[0.06] border-primary/25" : "bg-surface-2 border-border"}`}>
                    <span className="h-7 w-7 rounded-full bg-white border border-border text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="text-sm font-semibold flex-1 min-w-0 truncate">{a.t}</span>
                    <span className="hidden sm:inline text-[11px] text-muted-foreground truncate max-w-[45%]">{a.conta}</span>
                    <motion.span
                      className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 border ${feita ? "bg-success border-success" : "bg-white border-border"}`}
                      animate={feita ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      {feita && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3.5} />}
                    </motion.span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-surface-2 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-primary to-brand-light" animate={{ width: `${(feitas / AULAS.length) * 100}%` }} transition={{ duration: 0.5 }} />
            </div>
            <AnimatePresence>
              {completa && (
                <motion.div
                  className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-center text-sm font-bold text-brand-dark"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  6 de 6: oficina implantada, sem nenhuma call
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Agente que acompanha */}
          <div className="relative mt-4 grid sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-wa-chat p-3">
              <div className="text-center text-[10px] font-semibold text-[#54656f] mb-1.5">DIA 4 · NENHUMA OS AINDA</div>
              <div className="rounded-lg rounded-tl-none bg-white px-2.5 py-2 text-[12px] leading-snug text-[#111b21] shadow-sm">
                Travou em algo? Esse vídeo de 1 minuto mostra a 1ª OS pelo zap.
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-border p-3 text-sm">
              <div className="font-semibold flex items-center gap-1.5"><IconeWhatsApp className="h-4 w-4 text-wa" /> Suporte individual</div>
              <div className="mt-1 text-muted-foreground text-[13px] leading-snug">A IA responde com o trecho da aula certa. O time entra quando precisa.</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- PLANO (ÚNICO) ---------------- */
const INCLUSO = [
  "A equipe trabalhando pelo WhatsApp, sem app novo e sem treinamento.",
  "Pátio com a jornada do carro e avisos automáticos ao cliente em 8 momentos.",
  "Orçamento sugerido pelo seu catálogo e aprovação pelo link.",
  "IA que entende áudio, texto e foto, sempre com um “sim” antes de agir.",
  "Checklist com foto e vídeo, lembretes, pós-venda e revisão.",
  "Painel no celular e no computador, com relatórios pro dono.",
];

function Planos() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="planos" className="relative py-20 sm:py-24 md:py-32 overflow-hidden bg-white border-y border-border" ref={ref}>
      {/* luzes de fundo */}
      <div className="pointer-events-none absolute -top-56 -left-48 h-[48rem] w-[48rem] brilho-verde opacity-60" />
      <div className="pointer-events-none absolute -bottom-64 right-[-14rem] h-[44rem] w-[44rem] brilho-claro" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgb(15_26_21/0.12)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent)]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <motion.h2
          className="font-display text-center text-4xl sm:text-5xl md:text-[3.6rem] font-medium leading-[1.12]"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Uma decisão, <span className="text-primary">a</span>
          <br />
          <span className="text-primary">oficina inteira</span>
        </motion.h2>

        <div className="mt-14 md:mt-16 grid lg:grid-cols-[1fr_minmax(0,410px)_1fr] gap-10 lg:gap-12 items-center">
          {/* Marca e origem */}
          <motion.div
            className="order-3 lg:order-1 text-center lg:text-left max-w-sm mx-auto lg:mx-0 lg:justify-self-end"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo className="h-8 mx-auto lg:mx-0" />
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
              Feito pela Lure Digital pra oficina que já trabalha no WhatsApp. Não é sistema genérico adaptado: o mecânico continua no zap e a oficina inteira entra junto.
            </p>
          </motion.div>

          {/* Card do plano */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute -inset-10 brilho-verde opacity-60" />
            <div className="relative rounded-[1.75rem] border border-border bg-gradient-to-b from-white to-[#f3faf6] px-7 pt-14 pb-9 sm:px-9 text-center overflow-hidden shadow-[0_40px_80px_-30px_rgba(15,26,21,0.28)]">
              {/* Feixe de luz correndo pela borda esquerda */}
              <span className="absolute left-0 top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
              <span className="absolute left-0 inset-y-0 w-[2px] descer">
                <span className="block w-[2px] h-24 rounded-full bg-gradient-to-b from-transparent via-primary to-transparent shadow-[0_0_12px_rgba(0,168,98,0.8)]" />
              </span>

              {/* Recorte no topo */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-9 w-48 rounded-b-[999px] bg-white border-x border-b border-border flex items-end justify-center pb-1">
                <span className="flex boia">
                  <ChevronDown className="h-4 w-4 text-primary" />
                </span>
              </div>

              <div className="font-display text-[1.7rem] font-medium leading-tight text-ink">CheckZap</div>
              <div className="font-display text-[1.7rem] font-medium leading-tight text-primary">plano completo</div>

              <div className="mt-5 inline-flex rounded-full border border-border px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                Sua oficina inteira
              </div>

              <div className="mt-8 text-[15px] text-muted-foreground">tudo isso por</div>
              <div className="mt-1 flex items-start justify-center gap-1.5">
                <span className="mt-4 font-display text-3xl font-medium text-ink/70">R$</span>
                <span
                  className="font-display text-[6.5rem] sm:text-[7.5rem] font-medium leading-[0.95] tracking-tight bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #00a862, #00c977, #007043, #00c977, #00a862)", backgroundSize: "200% 100%" }}
                >
                  97
                </span>
                <span className="self-end mb-4 text-lg font-medium text-muted-foreground">/mês</span>
              </div>

              <div className="mt-8">
                <a
                  href={CTA.href}
                  className="relative inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#00c977] to-[#00964f] px-10 py-4 text-[15px] font-semibold text-white ring-[6px] ring-primary/15 shadow-[0_12px_40px_-8px_rgba(0,168,98,0.7)] transition hover:brightness-110 hover:-translate-y-0.5 btn-shimmer"
                >
                  Quero contratar
                </a>
              </div>
            </div>
          </motion.div>

          {/* O que vem no plano */}
          <ul className="order-2 lg:order-3 space-y-6 max-w-sm mx-auto lg:mx-0">
            {INCLUSO.map((item, i) => (
              <motion.li
                key={item}
                className="flex gap-3.5"
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <CheckCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-[15px] font-medium leading-snug text-ink">{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>

      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const faqs = [
    { q: "Preciso de outro número de WhatsApp?", a: "Não precisa de chip novo. A equipe manda mensagem pro número do CheckZap, e o WhatsApp que a oficina já usa com os clientes se conecta por QR code, igual ao WhatsApp Web." },
    { q: "O mecânico precisa instalar algum app?", a: "Não. Ele usa o WhatsApp que já tem no celular. Pra entrar, manda o código da oficina e o dono aprova com um toque. O próprio número dele vira o login." },
    { q: "Como é a implantação? Precisa de reunião?", a: "Não precisa. Assim que o pagamento é aprovado, você recebe o acesso no WhatsApp e no e-mail, e o número que você informou já entra como dono. Depois são 6 aulas curtas, e cada uma só conta como feita quando a ação aparece no sistema." },
    { q: "Quanto custa e como pago?", a: "R$ 97 por mês, com tudo incluso. O pagamento é por Pix: confirmou, o acesso chega em segundos." },
    { q: "Funciona no celular?", a: "Funciona. O mecânico trabalha pelo zap, e o painel da recepção e do dono funciona bem no celular e no computador." },
    { q: "O bot vai responder meus amigos?", a: "Não. No WhatsApp da oficina, o CheckZap só responde quem tem carro na oficina. Amigo, parente e fornecedor não recebem resposta do bot." },
    { q: "Como funciona o suporte?", a: "Pelo WhatsApp, individual e sem grupo. A IA responde primeiro com o trecho da aula certa; quando é algo que ela não pode resolver, o time entra na conversa." },
    { q: "E se a IA entender errado?", a: "Nada importante acontece sem um “sim”. Antes de abrir OS, enviar orçamento ou concluir o serviço, o CheckZap mostra o que entendeu e pede confirmação. Se estiver errado, é só corrigir." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-14 sm:py-20 md:py-32" ref={ref}>
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeader eyebrow="Dúvidas comuns" title={<>Perguntas que <span className="text-gradient-brand">todo dono faz.</span></>} />
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              className="rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" aria-expanded={open === i}>
                <span className="font-semibold pr-4 text-foreground">{f.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                  <ChevronDown className="h-5 w-5 text-primary shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA FINAL ---------------- */
function CTAFinal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="cta" className="py-14 sm:py-20 md:py-32 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto max-w-4xl px-5 sm:px-8 text-center">
        <motion.h2
          className="font-display text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.05]"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          O mecânico usa WhatsApp. <span className="text-gradient-brand">A oficina usa CheckZap.</span>
        </motion.h2>
        <motion.p
          className="mt-6 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          A oficina inteira conectada ao WhatsApp. Estamos abrindo vagas para as primeiras oficinas do piloto.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.a
            href={CTA.href}
            className="btn-primary text-base px-6 py-3.5 animate-pulse-glow btn-shimmer"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Quero começar agora <ArrowRight className="h-4 w-4" />
          </motion.a>
          <motion.a
            href={WHATSAPP_URL}
            target={WHATSAPP_URL.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="btn-whatsapp text-base px-6 py-3.5"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <IconeWhatsApp className="h-5 w-5" /> Falar com a gente
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- WHATSAPP FLUTUANTE ---------------- */
function FloatingWhatsApp() {
  return (
    <motion.a
      href={WHATSAPP_URL}
      target={WHATSAPP_URL.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_32px_-8px_rgba(37,211,102,0.55)]"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <IconeWhatsApp className="w-8 h-8" />
    </motion.a>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <footer className="border-t border-border bg-surface/40 py-14" ref={ref}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          className="grid md:grid-cols-4 gap-10"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="md:col-span-2">
            <Logo className="h-8" />
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              A oficina inteira conectada ao WhatsApp. Um produto da Lure Digital pra oficinas mecânicas e centros automotivos do Brasil.
            </p>
          </div>
          <div>
            <div className="font-semibold text-sm mb-4">Produto</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#patio" className="hover:text-foreground">Pátio</a></li>
              <li><a href="#planos" className="hover:text-foreground">Plano</a></li>
              <li><a href="#faq" className="hover:text-foreground">Dúvidas</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-sm mb-4">Legal</div>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Termos de uso</a></li>
              <li><a href="#" className="hover:text-foreground">Privacidade</a></li>
              <li><a href={WHATSAPP_URL} className="hover:text-foreground">Contato</a></li>
            </ul>
          </div>
        </motion.div>
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} CheckZap · Lure Digital</div>
          <div>O mecânico usa WhatsApp. A oficina usa CheckZap.</div>
        </div>
      </div>
    </footer>
  );
}
