import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Camera, CheckCheck, Mic, Paperclip, Phone, Play, Smile, Video } from "lucide-react";
import { Iphone16Pro } from "@/components/Iphone16Pro";
import { LogoMark } from "@/components/Logo";

/* ---------------- CELULAR ---------------- */
// Moldura SVG do iPhone com a tela em HTML por cima.
export function PhoneMockup({ width = 300, children, className = "" }: { width?: number; children: ReactNode; className?: string }) {
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width, height: width * 2 }}>
      <Iphone16Pro width={width} className="w-full h-full" />
      <div
        className="absolute overflow-hidden flex flex-col bg-white"
        style={{ top: "3.2%", left: "7.04%", width: "85.99%", height: "93.59%", borderRadius: width * 0.123 }}
      >
        {children}
      </div>
    </div>
  );
}

export function StatusBar({ className = "bg-wa-dark text-white" }: { className?: string }) {
  return (
    <div className={`relative flex justify-between items-center px-5 pt-2 pb-1 text-[10px] font-semibold shrink-0 ${className}`}>
      <span>9:41</span>
      <span className="absolute left-1/2 top-1.5 -translate-x-1/2 h-[17px] w-[64px] rounded-full bg-black" />
      <span className="tracking-tight">5G ▮</span>
    </div>
  );
}

/* ---------------- CONVERSA ---------------- */
export function BotAvatar() {
  return (
    <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shrink-0">
      <LogoMark className="h-6 w-6" />
    </div>
  );
}

export function InitialsAvatar({ initials, className = "bg-brand-soft text-brand-dark" }: { initials: string; className?: string }) {
  return (
    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold ${className}`}>
      {initials}
    </div>
  );
}

export function WaHeader({ name, status = "online", avatar }: { name: string; status?: string; avatar: ReactNode }) {
  return (
    <div className="bg-wa-dark text-white px-2.5 pt-1 pb-2 flex items-center gap-2 shrink-0">
      <ArrowLeft className="h-4 w-4 opacity-80 shrink-0" />
      {avatar}
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold truncate leading-tight">{name}</div>
        <div className="text-[10px] text-white/75 leading-tight truncate">{status}</div>
      </div>
      <Video className="h-4 w-4 opacity-80 shrink-0" />
      <Phone className="h-3.5 w-3.5 opacity-80 shrink-0" />
    </div>
  );
}

// Área do chat: as mensagens ficam presas embaixo e as antigas sobem, como no app.
export function WaChat({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex-1 min-h-0 bg-wa-chat px-2.5 py-2 overflow-hidden flex flex-col justify-end gap-1.5 ${className}`}>
      {children}
    </div>
  );
}

export function DateChip({ label = "HOJE" }: { label?: string }) {
  return (
    <div className="text-center mb-auto pb-1">
      <span className="inline-block px-2.5 py-0.5 rounded-md bg-white/90 text-[#54656f] text-[9.5px] font-medium shadow-sm">{label}</span>
    </div>
  );
}

type Side = "out" | "in";

export function Bubble({
  side,
  time,
  children,
  footer,
  className = "",
}: {
  side: Side;
  time: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const out = side === "out";
  return (
    <motion.div
      layout="position"
      className={`flex ${out ? "justify-end" : "justify-start"}`}
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div
        className={`max-w-[86%] rounded-lg text-[11px] leading-snug text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
          out ? "bg-wa-bubble rounded-tr-none" : "bg-white rounded-tl-none"
        } ${className}`}
      >
        <div className="px-2 pt-1.5 pb-1">
          {children}
          <span className="float-right ml-2 mt-1.5 -mb-0.5 inline-flex items-center gap-0.5 text-[8.5px] text-[#667781] leading-none">
            {time}
            {out && <CheckCheck className="h-3 w-3 text-[#53bdeb]" />}
          </span>
        </div>
        {footer}
      </div>
    </motion.div>
  );
}

const WAVE = [6, 10, 16, 9, 18, 12, 7, 14, 20, 11, 8, 15, 19, 10, 6, 12, 17, 9];

// Sem avatar e sem largura mínima: cabe na tela estreita do celular dos mockups
export function AudioBubble({ side, time, duration, transcript }: { side: Side; time: string; duration: string; transcript?: string }) {
  return (
    <Bubble side={side} time={time}>
      <div className="flex items-center gap-1.5 w-[132px] max-w-full">
        <span className="h-6 w-6 rounded-full bg-[#53bdeb] flex items-center justify-center shrink-0">
          <Play className="h-3 w-3 text-white fill-white ml-px" />
        </span>
        <div className="flex items-center justify-between h-6 flex-1 min-w-0 overflow-hidden">
          {WAVE.map((h, i) => (
            <span
              key={i}
              className={`w-[2px] shrink-0 rounded-full ${i < 4 ? "bg-[#53bdeb]" : "bg-[#8696a0]/70"}`}
              style={{ height: Math.max(3, h * 0.85) }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 text-[8.5px] text-[#667781] mt-0.5 pl-[30px]">
        <Mic className="h-2.5 w-2.5 text-[#53bdeb]" /> {duration}
      </div>
      {transcript && (
        <div className="mt-1 pt-1 border-t border-black/[0.06] text-[10.5px] italic text-[#3b4a54]">“{transcript}”</div>
      )}
    </Bubble>
  );
}

export function Typing() {
  return (
    <motion.div
      layout="position"
      className="flex justify-start"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white rounded-lg rounded-tl-none px-3 py-2.5 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot h-1.5 w-1.5 rounded-full bg-[#8696a0]" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </motion.div>
  );
}

// Botões de resposta rápida presos embaixo do balão.
export function ReplyButtons({ options, pressed }: { options: string[]; pressed?: number }) {
  return (
    <div className="border-t border-black/[0.06] grid divide-x divide-black/[0.06]" style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((o, i) => (
        <motion.div
          key={o}
          className="py-1.5 text-center text-[10.5px] font-semibold text-wa-dark"
          animate={pressed === i ? { backgroundColor: ["rgba(7,94,84,0)", "rgba(7,94,84,0.14)", "rgba(7,94,84,0.06)"] } : { backgroundColor: "rgba(7,94,84,0)" }}
          transition={{ duration: 0.5 }}
        >
          {o}
        </motion.div>
      ))}
    </div>
  );
}

export function WaComposer() {
  return (
    <div className="bg-[#f0f2f5] px-2 py-1.5 flex items-center gap-1.5 shrink-0">
      <div className="flex-1 rounded-full bg-white px-2.5 py-1.5 text-[10.5px] text-[#8696a0] flex items-center gap-1.5">
        <Smile className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1">Mensagem</span>
        <Paperclip className="h-3.5 w-3.5 shrink-0" />
        <Camera className="h-3.5 w-3.5 shrink-0" />
      </div>
      <div className="h-8 w-8 rounded-full bg-wa flex items-center justify-center shrink-0">
        <Mic className="h-4 w-4 text-white" />
      </div>
    </div>
  );
}
