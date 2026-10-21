import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Confetti } from "@/components/Confetti";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";
import { WHATSAPP_URL } from "@/lib/site";

// Volta do checkout do Asaas depois do pagamento
export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [{ title: "Pagamento recebido | CheckZap" }, { name: "robots", content: "noindex" }],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  component: Obrigado,
});

// Os 3 primeiros passos da trilha de implantação
const PASSOS = [
  { t: "Aula 1 · cadastrar a equipe", d: "Vincular os números dos mecânicos. Leva 8 minutos." },
  { t: "Aula 2 · primeira OS pelo zap", d: "Áudio, fotos e a confirmação com um “sim”." },
  { t: "Aula 3 · catálogo e preços", d: "Os serviços que viram orçamento sozinhos." },
];

function Obrigado() {
  return (
    <main className="relative min-h-screen bg-cream overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="relative mx-auto max-w-2xl px-5 py-10 sm:py-16">
        <a href="/" aria-label="CheckZap, início">
          <Logo className="h-7" />
        </a>

        <motion.div
          className="relative mt-10 rounded-3xl bg-white border border-border shadow-[var(--shadow-card)] p-6 sm:p-10 text-center overflow-hidden"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Confetti active />
          <motion.div
            className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center shadow-[var(--shadow-glow)]"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.2 }}
          >
            <Check className="h-8 w-8 text-white" strokeWidth={3} />
          </motion.div>
          <h1 className="mt-6 font-display text-3xl sm:text-4xl font-bold leading-tight">
            Pagamento recebido! <span className="text-gradient-brand">Seu CheckZap está chegando.</span>
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Em instantes você recebe o acesso no WhatsApp e no e-mail. O WhatsApp que você informou já é o número do dono: é só mandar mensagem pro CheckZap.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-left">
            <div className="flex items-center gap-3 rounded-xl bg-surface-2 border border-border p-3">
              <span className="h-9 w-9 rounded-full bg-wa flex items-center justify-center shrink-0">
                <IconeWhatsApp className="h-5 w-5 text-white" />
              </span>
              <span className="text-sm"><b>No zap:</b> parabéns, link e a Aula 1</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-surface-2 border border-border p-3">
              <span className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-primary" />
              </span>
              <span className="text-sm"><b>No e-mail:</b> login e senha provisória</span>
            </div>
          </div>

          <div className="mt-8 text-left">
            <div className="text-sm font-semibold text-ink">Seus 3 primeiros passos</div>
            <ol className="mt-3 space-y-2.5">
              {PASSOS.map((p, i) => (
                <motion.li
                  key={p.t}
                  className="flex items-start gap-3 rounded-xl border border-border p-3"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                >
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-brand-dark text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-semibold">{p.t}</span>
                    <span className="block text-xs text-muted-foreground">{p.d}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Ainda não chegou? Às vezes o Pix leva alguns minutos para confirmar.
          </p>
          <a href="/entrar" className="btn-primary btn-shimmer mt-6 w-full sm:w-auto !px-8 !py-3.5 !text-base">
            Entrar no CheckZap <ArrowRight className="h-4 w-4" />
          </a>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={WHATSAPP_URL} className="btn-ghost">
              <MessageCircle className="h-4 w-4" /> Não chegou? Falar com o suporte
            </a>
            <a href="/" className="btn-ghost">
              <ArrowLeft className="h-4 w-4" /> Voltar ao site
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
