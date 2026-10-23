// Faixa infinita de cards de depoimentos.
// Adaptado do "Infinite Moving Cards" (Aceternity UI / 21st.dev) para o site:
// sem Tailwind nem `cn`, com o CSS em infinite-moving-cards.css e o card no visual da DataTransp.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { Depoimento } from '../../data/depoimentos';
import './infinite-moving-cards.css';

type Props = {
  items: Depoimento[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
};

const durations = { fast: '45s', normal: '65s', slow: '85s' } as const;

const initials = (name: string) =>
  name.split(/\s+/).filter((w) => w.length > 2).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export function InfiniteMovingCards({ items, direction = 'left', speed = 'normal', pauseOnHover = true, className }: Props) {
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.dataset.cloned) return;
    // duplica os cards para o loop não ter emenda; as cópias ficam ocultas para leitores de tela
    Array.from(scroller.children).forEach((item) => {
      const copy = item.cloneNode(true) as HTMLElement;
      copy.setAttribute('aria-hidden', 'true');
      scroller.appendChild(copy);
    });
    scroller.dataset.cloned = 'true';
    setStart(true);
  }, []);

  const style = {
    '--imc-duration': durations[speed],
    '--imc-direction': direction === 'left' ? 'forwards' : 'reverse',
  } as CSSProperties;

  return (
    <div className={['imc', pauseOnHover && 'imc--pause', className].filter(Boolean).join(' ')} style={style}>
      <ul ref={scrollerRef} className={['imc__track', start && 'imc__track--run'].filter(Boolean).join(' ')}>
        {items.map((item) => (
          <li className="imc__card" key={item.empresa} style={{ '--brand': item.cor } as CSSProperties}>
            <figure>
              <div className="imc__head">
                {item.logo ? (
                  <span className="imc__logos">
                    {[item.logo, item.logoExtra].filter(Boolean).map((src, i) => (
                      <span className={item.logoExtra ? 'imc__logo imc__logo--half' : 'imc__logo'} key={src}>
                        <img src={src} alt={i === 0 ? item.empresa : ''} loading="lazy" decoding="async" />
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="imc__logo imc__logo--initials" aria-hidden="true">{initials(item.empresa)}</span>
                )}
                <span className="imc__stars" aria-label={`Avaliação: ${item.nota}`}>★★★★★</span>
              </div>
              <blockquote className="imc__quote">“{item.texto}”</blockquote>
              <figcaption className="imc__who">
                <strong>{item.nome ?? item.empresa}</strong>
                <span>
                  {[item.cargo, item.nome ? item.empresa : null].filter(Boolean).join(' · ') || `Cliente há ${item.clienteHa}`}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InfiniteMovingCards;
