import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Avança por etapas de uma demonstração em loop enquanto `active` for true.
// `times` são os instantes (ms) em que cada etapa começa; o loop reinicia em `loopMs`.
// Com movimento reduzido, mostra direto a última etapa.
export function useLoopSteps(times: readonly number[], loopMs: number, active: boolean) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) {
      setStep(times.length);
      return;
    }
    if (!active) {
      setStep(0);
      return;
    }
    let timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      timers = [];
      setStep(0);
      times.forEach((t, i) => timers.push(setTimeout(() => setStep(i + 1), t)));
      timers.push(setTimeout(run, loopMs));
    };
    run();
    return () => timers.forEach(clearTimeout);
  }, [active, reduced, loopMs, times]);

  return step;
}
