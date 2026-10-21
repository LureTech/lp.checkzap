// Marca oficial do CheckZap (arquivos em public/marca, os mesmos do painel).
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return <img src="/marca/simbolo.webp" alt="" width={512} height={512} className={`object-contain ${className}`} />;
}

export function Logo({ className = "h-7", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <img
      src={dark ? "/marca/logo-fundo-escuro.webp" : "/marca/logo.webp"}
      alt="CheckZap"
      width={1200}
      height={261}
      className={`w-auto ${className}`}
    />
  );
}
