import LogoLoop from '../react-bits/LogoLoop/LogoLoop';

type Logo = { src: string; alt: string };

// Faixa infinita de logos de clientes (LogoLoop do React Bits), cada logo num cartão branco.
export default function ClientLogos({ logos }: { logos: Logo[] }) {
  return (
    <LogoLoop
      logos={logos.map((logo) => ({
        node: (
          <span className="dt-logo-chip">
            <img src={logo.src} alt={logo.alt} loading="lazy" decoding="async" />
          </span>
        ),
        ariaLabel: logo.alt,
      }))}
      speed={60}
      direction="left"
      logoHeight={96}
      gap={20}
      pauseOnHover
      fadeOut
      fadeOutColor="#050f22"
      ariaLabel="Clientes da DataTransp"
    />
  );
}
