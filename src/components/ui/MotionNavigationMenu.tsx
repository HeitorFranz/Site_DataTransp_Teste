// Menu de navegação com painel animado: ao passar de um item para outro, o painel muda de
// tamanho e o conteúdo desliza na direção do movimento; um destaque segue o mouse.
// Adaptado do "Motion Navigation Menu" (unlumen-ui / 21st.dev) para o site: sem Tailwind,
// shadcn, cva ou lucide; o destaque (Highlight) foi reescrito aqui; estilos em motion-navigation-menu.css.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './motion-navigation-menu.css';

type Spring = { type: 'spring'; stiffness: number; damping: number; bounce: number };

type MenuContextValue = {
  activeValue: string;
  direction: number;
  spring: Spring;
  viewportX: number | null;
  openValue: (value: string) => void;
  closeMenu: () => void;
  registerContent: (value: string, content: ReactNode) => () => void;
};

const MenuContext = createContext<MenuContextValue | null>(null);
const ItemContext = createContext<{ value?: string }>({});

const contentVariants = {
  initial: (direction: number) => ({ x: `${30 * direction}%`, opacity: 0 }),
  active: { x: '0%', opacity: 1 },
  exit: (direction: number) => ({ x: `${-30 * direction}%`, opacity: 0 }),
};

const cx = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

/* ---------- destaque que segue o mouse (substitui o Highlight do unlumen-ui) ---------- */
function useHoverHighlight<T extends HTMLElement>(selector: string) {
  const containerRef = useRef<T>(null);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const onPointerOver = useCallback(
    (event: React.PointerEvent) => {
      const container = containerRef.current;
      const target = (event.target as HTMLElement).closest<HTMLElement>(selector);
      if (!container || !target || !container.contains(target)) return;
      const c = container.getBoundingClientRect();
      const r = target.getBoundingClientRect();
      setBox({ x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height });
    },
    [selector],
  );

  return { containerRef, box, onPointerOver, clear: () => setBox(null) };
}

function HighlightBox({ box, className }: { box: { x: number; y: number; w: number; h: number } | null; className: string }) {
  return (
    <AnimatePresence>
      {box && (
        <motion.span
          className={className}
          aria-hidden="true"
          initial={{ opacity: 0, x: box.x, y: box.y, width: box.w, height: box.h }}
          animate={{ opacity: 1, x: box.x, y: box.y, width: box.w, height: box.h }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 36 }}
        />
      )}
    </AnimatePresence>
  );
}

/* ---------- raiz ---------- */
type MenuProps = ComponentPropsWithoutRef<'nav'> & {
  springBounce?: number;
  springStiffness?: number;
  springDamping?: number;
};

export function MotionNavigationMenu({ className, children, springBounce = 0, springStiffness = 350, springDamping = 32, ...props }: MenuProps) {
  const rootRef = useRef<HTMLElement>(null);
  const lastValue = useRef('');
  const [activeValue, setActiveValue] = useState('');
  const [direction, setDirection] = useState(1);
  const [viewportX, setViewportX] = useState<number | null>(null);
  const [contents, setContents] = useState<Record<string, ReactNode>>({});
  const spring = useMemo<Spring>(() => ({ type: 'spring', bounce: springBounce, stiffness: springStiffness, damping: springDamping }), [springBounce, springStiffness, springDamping]);

  const itemValues = () =>
    Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-slot="nav-item"][data-value]') ?? [], (el) => el.dataset.value ?? '');

  const updateViewportX = useCallback(() => {
    requestAnimationFrame(() => {
      const root = rootRef.current;
      const trigger = root?.querySelector<HTMLElement>('[data-slot="nav-trigger"][data-state="open"]');
      if (!root || !trigger) return;
      const rr = root.getBoundingClientRect();
      const tr = trigger.getBoundingClientRect();
      setViewportX(tr.left - rr.left + tr.width / 2);
    });
  }, []);

  const openValue = useCallback(
    (next: string) => {
      if (!next || next === lastValue.current) return;
      const values = itemValues();
      const a = values.indexOf(lastValue.current), b = values.indexOf(next);
      if (a !== -1 && b !== -1) setDirection(b > a ? 1 : -1);
      lastValue.current = next;
      setActiveValue(next);
      updateViewportX();
    },
    [updateViewportX],
  );

  const closeMenu = useCallback(() => {
    lastValue.current = '';
    setActiveValue('');
  }, []);

  const registerContent = useCallback((value: string, content: ReactNode) => {
    setContents((current) => (current[value] === content ? current : { ...current, [value]: content }));
    return () => setContents(({ [value]: _removed, ...rest }) => rest);
  }, []);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && e.target instanceof Node && !rootRef.current.contains(e.target)) closeMenu();
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [closeMenu]);

  const value = useMemo(
    () => ({ activeValue, direction, spring, viewportX, openValue, closeMenu, registerContent }),
    [activeValue, direction, spring, viewportX, openValue, closeMenu, registerContent],
  );

  return (
    <MenuContext.Provider value={value}>
      <nav
        ref={rootRef}
        className={cx('mnm', className)}
        onPointerLeave={closeMenu}
        onKeyDown={(e) => { if (e.key === 'Escape') closeMenu(); }}
        {...props}
      >
        {children}
        <Viewport contents={contents} />
      </nav>
    </MenuContext.Provider>
  );
}

export function MotionNavigationMenuList({ className, children, ...props }: ComponentPropsWithoutRef<'ul'>) {
  const { containerRef, box, onPointerOver, clear } = useHoverHighlight<HTMLDivElement>('[data-slot="nav-trigger"], [data-slot="nav-link"]');
  return (
    <div className="mnm__list-wrap" ref={containerRef} onPointerOver={onPointerOver} onPointerLeave={clear}>
      <HighlightBox box={box} className="mnm__highlight" />
      <ul className={cx('mnm__list', className)} {...props}>{children}</ul>
    </div>
  );
}

export function MotionNavigationMenuItem({ value, className, ...props }: ComponentPropsWithoutRef<'li'> & { value?: string }) {
  const ctx = useMemo(() => ({ value }), [value]);
  return (
    <ItemContext.Provider value={ctx}>
      <li data-slot="nav-item" data-value={value} className={cx('mnm__item', className)} {...props} />
    </ItemContext.Provider>
  );
}

export function MotionNavigationMenuTrigger({ className, children, ...props }: ComponentPropsWithoutRef<'button'>) {
  const menu = useContext(MenuContext);
  const { value } = useContext(ItemContext);
  const isOpen = !!value && menu?.activeValue === value;
  const open = () => value && menu?.openValue(value);
  return (
    <button
      type="button"
      data-slot="nav-trigger"
      data-state={isOpen ? 'open' : 'closed'}
      aria-expanded={isOpen}
      className={cx('mnm__trigger', className)}
      onPointerEnter={open}
      onFocus={open}
      onClick={open}
      {...props}
    >
      {children}
      <motion.svg
        className="mnm__chevron"
        viewBox="0 0 24 24"
        width="14"
        height="14"
        aria-hidden="true"
        animate={{ rotate: isOpen ? 180 : 0, y: isOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      >
        <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </button>
  );
}

/** Conteúdo do painel de um item; é renderizado dentro do painel animado (viewport). */
export function MotionNavigationMenuContent({ children }: { children: ReactNode }) {
  const menu = useContext(MenuContext);
  const { value } = useContext(ItemContext);
  useLayoutEffect(() => {
    if (!menu || !value) return;
    return menu.registerContent(value, children);
  }, [children, menu?.registerContent, value]);
  return null;
}

export function MotionNavigationMenuLink({ className, active, ...props }: ComponentPropsWithoutRef<'a'> & { active?: boolean }) {
  return <a data-slot="nav-link" data-active={active || undefined} aria-current={active ? 'page' : undefined} className={cx('mnm__link', className)} {...props} />;
}

/* ---------- painel animado ---------- */
function Viewport({ contents }: { contents: Record<string, ReactNode> }) {
  const menu = useContext(MenuContext);
  const reduce = useReducedMotion();
  const measureRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const active = menu?.activeValue ? contents[menu.activeValue] : undefined;
  const { containerRef, box, onPointerOver, clear } = useHoverHighlight<HTMLDivElement>('[data-slot="nav-link"]');

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node || !active) return;
    const update = () => {
      const r = node.getBoundingClientRect();
      if (r.width && r.height) setSize({ width: r.width, height: r.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  // mantém o painel dentro da tela (12px de margem) mesmo quando o item fica perto da borda
  const [left, setLeft] = useState<number | null>(null);
  useLayoutEffect(() => {
    const root = measureRef.current?.closest('.mnm');
    if (!root || menu?.viewportX == null) return;
    const rr = root.getBoundingClientRect();
    const half = size.width / 2;
    const min = 12 - rr.left + half;
    const max = window.innerWidth - 12 - rr.left - half;
    setLeft(Math.min(Math.max(menu.viewportX, min), Math.max(min, max)));
  }, [menu?.viewportX, size.width]);

  const spring = reduce ? { duration: 0 } : menu?.spring;

  return (
    <motion.div className="mnm__viewport-pos" initial={false} animate={{ left: left ?? menu?.viewportX ?? '50%' }} transition={spring}>
      <motion.div
        className="mnm__viewport"
        initial={false}
        animate={{ width: active ? size.width : 0, height: active ? size.height : 0, opacity: active ? 1 : 0, scale: active ? 1 : 0.96 }}
        transition={spring}
        style={{ pointerEvents: active ? 'auto' : 'none' }}
      >
        <div ref={containerRef} className="mnm__viewport-inner" onPointerOver={onPointerOver} onPointerLeave={clear}>
          <HighlightBox box={box} className="mnm__highlight mnm__highlight--panel" />
          <AnimatePresence mode="popLayout" initial={false} custom={menu?.direction ?? 1}>
            {active && menu?.activeValue && (
              <motion.div
                key={menu.activeValue}
                className="mnm__content"
                custom={menu.direction}
                variants={contentVariants}
                initial="initial"
                animate="active"
                exit="exit"
                transition={spring}
              >
                {active}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      {/* cópia invisível para medir o tamanho do conteúdo ativo */}
      <div ref={measureRef} className="mnm__measure" aria-hidden="true">
        {active && <div className="mnm__content">{active}</div>}
      </div>
    </motion.div>
  );
}

export default MotionNavigationMenu;
