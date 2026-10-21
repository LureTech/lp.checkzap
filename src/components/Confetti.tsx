import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
}

const colors = [
  "#00a862", // verde CheckZap
  "#00bc6e", // verde claro
  "#25d366", // verde WhatsApp
  "#061c2e", // azul-marinho
  "#f59e0b", // destaque
];

export function Confetti({ active }: { active: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 60,
      y: 40 + (Math.random() - 0.5) * 30,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 6,
      rotation: Math.random() * 360,
      duration: 1.2 + Math.random() * 0.8,
      delay: Math.random() * 0.3,
    }));

    setParticles(newParticles);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 50 }}>
          {particles.map((p) => {
            const destX = p.x + (Math.random() - 0.5) * 120;
            const destY = p.y + 80 + Math.random() * 60;

            return (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                }}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: 0,
                  y: 0,
                  rotate: 0,
                }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1.2, 0.6],
                  x: (destX - p.x) * 4,
                  y: (destY - p.y) * 4,
                  rotate: p.rotation + 180,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
