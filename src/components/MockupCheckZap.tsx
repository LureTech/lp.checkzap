import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Mic } from "lucide-react";
import { Iphone16Pro } from "@/components/Iphone16Pro";
import { StatusBar, WaHeader, WaChat, DateChip, Bubble, AudioBubble, Typing, ReplyButtons, BotAvatar, WaComposer } from "@/components/WhatsApp";
import { IconeWhatsApp } from "@/components/IconeWhatsApp";
import { useLoopSteps } from "@/hooks/use-loop-steps";
import { DOMINIO } from "@/lib/site";

// 1 áudio · 2 digitando · 3 resumo · 4 "sim" · 5 digitando · 6 OS aberta (card acende no print) · 7 cliente avisado
const TIMES = [700, 2000, 3200, 5200, 5800, 6700, 7600] as const;
const LOOP_MS = 13000;

// Palco com tamanho fixo, escalado para caber na coluna (mesma proporção do mockup do Pátio OS)
const STAGE_W = 680;
const STAGE_H = 566;

// Card do Civic (OS #1090) dentro do print do pátio, em % da imagem 1600×1000
const CARD_CIVIC = { left: "6.9%", top: "41.1%", width: "16.7%", height: "23.2%" };

export default function MockupCheckZap() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const step = useLoopSteps(TIMES, LOOP_MS, inView);

  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / STAGE_W)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-[680px] mx-auto">
      {/* glow verde de fundo */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] brilho-claro" />
      </div>

      <div className="relative" style={{ height: STAGE_H * scale }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
          {/* Painel — janela de navegador com o pátio real */}
          <div className="absolute left-0 top-0 w-full z-10 origin-center transition-transform duration-700 ease-out rotate-[-1deg] translate-x-[-6px] hover:rotate-0 hover:translate-x-0">
            <div className="rounded-2xl overflow-hidden bg-white ring-1 ring-black/5 shadow-[0_40px_80px_-30px_rgba(15,26,21,0.35)]">
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200/70">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                <div className="ml-3 flex-1 min-w-0">
                  <div className="mx-auto max-w-[55%] h-5 rounded-md bg-white border border-slate-200 text-[10px] text-slate-400 flex items-center justify-center truncate px-2">
                    {DOMINIO}/patio
                  </div>
                </div>
              </div>
              <div className="relative">
                <img src="/produto/patio.webp" alt="Pátio do CheckZap com os carros em cada etapa" width={1600} height={1000} className="w-full h-auto block" />
                <AnimatePresence>
                  {step >= 6 && (
                    <motion.div
                      key="destaque"
                      className="absolute rounded-lg border-2 border-primary shadow-[0_0_0_5px_rgba(0,168,98,0.2),0_16px_30px_-8px_rgba(0,168,98,0.55)]"
                      style={CARD_CIVIC}
                      initial={{ opacity: 0, scale: 1.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-white shadow-md inline-flex items-center gap-1">
                        <Mic className="h-2.5 w-2.5" /> Nova OS pelo áudio
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Celular — conversa do mecânico com o CheckZap */}
          <div className="absolute right-[-18px] bottom-[-44px] z-20 origin-bottom-right transition-transform duration-700 ease-out rotate-[2deg] hover:rotate-0" style={{ width: 236, height: 472 }}>
            <Iphone16Pro width={236} className="w-full h-full drop-shadow-[0_35px_60px_rgba(15,26,21,0.35)]" />
            <div
              className="absolute overflow-hidden flex flex-col bg-white"
              style={{ top: "3.2%", left: "7.04%", width: "85.99%", height: "93.59%", borderRadius: 29 }}
            >
              <StatusBar />
              <WaHeader name="CheckZap" status={step === 2 || step === 5 ? "digitando…" : "online"} avatar={<BotAvatar />} />
              <WaChat>
                <DateChip />
                {/* conversa de mais cedo: o chat nunca começa vazio */}
                <Bubble side="out" time="07:52">Compass subiu no elevador</Bubble>
                <Bubble side="in" time="07:52">👍 Feito. O Álvaro já foi avisado.</Bubble>
                {step >= 1 && <AudioBubble side="out" time="08:12" duration="0:09" transcript="Civic do João, barulho na suspensão, urgente" />}
                {step >= 3 && (
                  <Bubble side="in" time="08:12" footer={<ReplyButtons options={["Sim", "Corrigir"]} pressed={step >= 4 ? 0 : undefined} />}>
                    Abro a OS do <b className="whitespace-nowrap">Civic ABC-1D34</b> (João) como urgente?
                  </Bubble>
                )}
                {step >= 4 && <Bubble side="out" time="08:13">sim</Bubble>}
                {step >= 6 && (
                  <Bubble side="in" time="08:13">
                    ✅ <b>OS #1090 aberta.</b> O João já foi avisado.
                  </Bubble>
                )}
                <AnimatePresence>{(step === 2 || step === 5) && <Typing key="typing" />}</AnimatePresence>
              </WaChat>
              <WaComposer />
            </div>
          </div>

          {/* Selo — OS aberta (canto superior direito) */}
          <div className="absolute right-[-40px] top-[22px] z-30">
            <div className="bg-white rounded-2xl ring-1 ring-black/5 shadow-[0_20px_40px_-12px_rgba(15,26,21,0.25)] pl-3 pr-5 py-2.5 flex items-center gap-2.5 min-w-[180px]">
              <AnimatePresence mode="wait" initial={false}>
                {step >= 6 ? (
                  <motion.div key="ok" className="flex items-center gap-2.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shrink-0 shadow-[0_8px_16px_-4px_rgba(0,168,98,0.5)]">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="leading-tight">
                      <div className="text-xl font-extrabold text-slate-900">OS #1090</div>
                      <div className="text-[11px] font-medium text-slate-500">aberta pelo áudio</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="audio" className="flex items-center gap-2.5" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <div className="relative w-10 h-10 bg-brand-soft rounded-full flex items-center justify-center shrink-0">
                      <span className="absolute inset-0 rounded-full bg-primary/25 animate-ping" />
                      <Mic className="relative w-5 h-5 text-primary" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-[15px] font-extrabold text-slate-900">Áudio do Roberto</div>
                      <div className="text-[11px] font-medium text-slate-500">{step >= 1 ? "entendendo…" : "chegando no zap"}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Selo — cliente avisado (lado esquerdo) */}
          <div className="absolute left-[-40px] top-[58%] z-30">
            <AnimatePresence>
              {step >= 7 && (
                <motion.div
                  className="bg-white rounded-2xl ring-1 ring-black/5 shadow-[0_20px_40px_-12px_rgba(15,26,21,0.25)] pl-3 pr-5 py-2.5 flex items-center gap-2.5"
                  initial={{ opacity: 0, x: -20, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                >
                  <div className="w-10 h-10 bg-wa rounded-full flex items-center justify-center shrink-0 shadow-[0_8px_16px_-4px_rgba(37,211,102,0.55)]">
                    <IconeWhatsApp className="w-6 h-6 text-white" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-[15px] font-extrabold text-slate-900">João avisado</div>
                    <div className="text-[11px] font-medium text-slate-500">no WhatsApp, sozinho</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
