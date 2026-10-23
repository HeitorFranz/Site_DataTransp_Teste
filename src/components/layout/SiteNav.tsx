// Menu principal (computador) montado com o MotionNavigationMenu.
// Usa as mesmas páginas e textos do site (src/data/empresa.ts); no celular continua o menu sanduíche do Header.
import {
  MotionNavigationMenu,
  MotionNavigationMenuContent,
  MotionNavigationMenuItem,
  MotionNavigationMenuLink,
  MotionNavigationMenuList,
  MotionNavigationMenuTrigger,
} from '../ui/MotionNavigationMenu';
import { iconPaths, type IconName } from '../../data/icones';
import './site-nav.css';

type Modulo = { slug: string; title: string; summary: string };

type Props = {
  currentPath: string;
  modules: Modulo[];
  facebook?: string;
  whatsapp: string;
  phone: string;
};

// descrição de uma linha para o menu (resumo do que cada módulo faz, sem cortar texto)
const short: Record<string, string> = {
  fiscal: 'NF-e, CT-e, MDF-e e NFS-e',
  financeiro: 'Faturamento e contabilidade',
  manutencao: 'Histórico de toda a frota',
  pneus: 'Controle e histórico de pneus',
  combustiveis: 'Consumo e estoque',
  alertas: 'Vencimentos e ocorrências',
  bi: 'Visões prontas e personalizadas',
};

// módulos agrupados pelo tipo de rotina que resolvem
const groups = [
  { label: 'Documentos e financeiro', slugs: ['fiscal', 'financeiro'] },
  { label: 'Frota', slugs: ['manutencao', 'pneus', 'combustiveis'] },
  { label: 'Gestão', slugs: ['alertas', 'bi'] },
];

const Icon = ({ name, size = 18 }: { name: IconName; size?: number }) => (
  <svg className="sn-icon" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" dangerouslySetInnerHTML={{ __html: iconPaths[name] }} />
);

const Arrow = () => (
  <svg className="sn-arrow" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.1 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.6.4.1.1.1.7-.1 1.4Z" />
  </svg>
);

export default function SiteNav({ currentPath, modules, facebook, whatsapp, phone }: Props) {
  const is = (href: string) => currentPath === href || (href !== '/' && currentPath.startsWith(href));
  const bySlug = new Map(modules.map((m) => [m.slug, m]));
  const waUrl = `https://wa.me/55${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Olá, quero conhecer o sistema DataTransp.')}`;

  const ModuleLink = ({ slug }: { slug: string }) => {
    const m = bySlug.get(slug);
    if (!m) return null;
    const href = `/funcionalidades/${m.slug}`;
    return (
      <MotionNavigationMenuLink href={href} className="sn-row" active={currentPath === href}>
        <span className="sn-row__icon"><Icon name={m.slug as IconName} /></span>
        <span className="sn-row__body">
          <strong>{m.title}</strong>
          <small>{short[m.slug] ?? m.summary}</small>
        </span>
      </MotionNavigationMenuLink>
    );
  };

  return (
    <MotionNavigationMenu className="sn" aria-label="Navegação principal">
      <MotionNavigationMenuList>
        <MotionNavigationMenuItem>
          <MotionNavigationMenuLink href="/" active={currentPath === '/'}>Início</MotionNavigationMenuLink>
        </MotionNavigationMenuItem>

        <MotionNavigationMenuItem value="funcionalidades">
          <MotionNavigationMenuTrigger className={is('/funcionalidades') || is('/integracoes') ? 'is-current' : undefined}>Funcionalidades</MotionNavigationMenuTrigger>
          <MotionNavigationMenuContent>
            <div className="sn-panel sn-panel--modules">
              <div className="sn-groups">
                {groups.map((g) => (
                  <div className="sn-group" key={g.label}>
                    <p className="sn-group__label">{g.label}</p>
                    {g.slugs.map((s) => <ModuleLink slug={s} key={s} />)}
                  </div>
                ))}
                <div className="sn-group">
                  <p className="sn-group__label">Conexões</p>
                  <MotionNavigationMenuLink href="/integracoes" className="sn-row" active={is('/integracoes')}>
                    <span className="sn-row__icon">
                      <svg className="sn-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                    </span>
                    <span className="sn-row__body"><strong>Integrações</strong><small>Bancos, EDI, contábil, SPED e CIOT</small></span>
                  </MotionNavigationMenuLink>
                </div>
              </div>

              {/* atendimento: uma pessoa de verdade para ajudar a escolher */}
              <aside className="sn-human">
                <img src="/images/home/atendente-avatar.webp" alt="" width="160" height="160" loading="lazy" decoding="async" />
                <p className="sn-human__title">Não sabe por onde começar?</p>
                <p className="sn-human__text">Nossa equipe mostra o sistema funcionando com a rotina da sua transportadora.</p>
                <MotionNavigationMenuLink href="/contato#agendar-demonstracao" className="sn-human__cta">Agendar demonstração</MotionNavigationMenuLink>
                <MotionNavigationMenuLink href={waUrl} target="_blank" rel="noopener noreferrer" className="sn-human__wa"><WhatsApp /> {whatsapp}</MotionNavigationMenuLink>
              </aside>

              <MotionNavigationMenuLink href="/funcionalidades" className="sn-all">
                Ver todas as funcionalidades <Arrow />
              </MotionNavigationMenuLink>
            </div>
          </MotionNavigationMenuContent>
        </MotionNavigationMenuItem>

        <MotionNavigationMenuItem value="empresa">
          <MotionNavigationMenuTrigger className={is('/empresa') || is('/clientes') ? 'is-current' : undefined}>Empresa</MotionNavigationMenuTrigger>
          <MotionNavigationMenuContent>
            <div className="sn-panel sn-panel--company">
              <div className="sn-group">
                <MotionNavigationMenuLink href="/empresa" className="sn-row" active={is('/empresa')}>
                  <span className="sn-row__icon"><Icon name="clock" /></span>
                  <span className="sn-row__body"><strong>Sobre a DataTransp</strong><small>No transporte desde 1997</small></span>
                </MotionNavigationMenuLink>
                <MotionNavigationMenuLink href="/clientes" className="sn-row" active={is('/clientes')}>
                  <span className="sn-row__icon"><Icon name="shield" /></span>
                  <span className="sn-row__body"><strong>Clientes e depoimentos</strong><small>Quem usa o DataTransp</small></span>
                </MotionNavigationMenuLink>
                <MotionNavigationMenuLink href="/contato" className="sn-row" active={is('/contato')}>
                  <span className="sn-row__icon"><Icon name="headset" /></span>
                  <span className="sn-row__body"><strong>Suporte e atendimento</strong><small>WhatsApp e telefone</small></span>
                </MotionNavigationMenuLink>
                {facebook && (
                  <MotionNavigationMenuLink href={facebook} target="_blank" rel="noopener noreferrer" className="sn-row">
                    <span className="sn-row__icon"><svg className="sn-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></span>
                    <span className="sn-row__body"><strong>Facebook</strong><small>Novidades da DataTransp</small></span>
                  </MotionNavigationMenuLink>
                )}
              </div>
              <div className="sn-hours">
                <p><strong>Atendimento</strong>Segunda a sexta, 08h às 18h</p>
                <p><strong>Telefone</strong>{phone}</p>
              </div>
            </div>
          </MotionNavigationMenuContent>
        </MotionNavigationMenuItem>

        <MotionNavigationMenuItem>
          <MotionNavigationMenuLink href="/novidades" active={is('/novidades')}>Novidades</MotionNavigationMenuLink>
        </MotionNavigationMenuItem>
        <MotionNavigationMenuItem>
          <MotionNavigationMenuLink href="/contato" active={is('/contato')}>Contato</MotionNavigationMenuLink>
        </MotionNavigationMenuItem>
      </MotionNavigationMenuList>
    </MotionNavigationMenu>
  );
}
