const header = document.querySelector<HTMLElement>('#header');
if (header) {
  const updateHeaderState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });
}

const menuToggle = document.querySelector<HTMLButtonElement>('#menuToggle');
const navMenu = document.querySelector<HTMLUListElement>('#navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu principal' : 'Abrir menu principal');
  });
  navMenu.querySelectorAll<HTMLAnchorElement>('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu principal');
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu principal');
      menuToggle.focus();
    }
  });
}

const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-button[data-filter]');
const newsCards = document.querySelectorAll<HTMLElement>('.news-card[data-type]');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });
    newsCards.forEach((card) => {
      card.classList.toggle('hidden', filter !== 'Todos' && card.dataset.type !== filter);
    });
  });
});

document.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach((form) => {
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (!status || !submit) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const payload: Record<string, string | boolean> = {};
    data.forEach((value, key) => {
      payload[key] = String(value);
    });
    payload.consent = data.get('consent') === 'on';
    status.textContent = 'Enviando sua solicitação…';
    status.classList.remove('is-error', 'is-ok');
    submit.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(result.error || 'Não foi possível enviar o pedido.');
      }
      status.textContent = result.message || 'Pedido enviado.';
      status.classList.add('is-ok');
      form.reset();
    } catch (error) {
      status.textContent = error instanceof Error
        ? error.message
        : 'Ocorreu um erro inesperado. Tente novamente ou use os canais diretos.';
      status.classList.add('is-error');
    } finally {
      submit.disabled = false;
    }
  });
});

