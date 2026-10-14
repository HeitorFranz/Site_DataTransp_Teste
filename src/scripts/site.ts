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
    status.classList.remove('is-error');
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

const chatLauncher = document.querySelector<HTMLButtonElement>('.chat-launcher');
const chatPanel = document.querySelector<HTMLElement>('#chatPanel');
const chatClose = document.querySelector<HTMLButtonElement>('.chat-close');
const chatMessages = document.querySelector<HTMLElement>('.chat-messages');
if (chatLauncher && chatPanel && chatClose && chatMessages) {
  const setChatOpen = (open: boolean) => {
    chatPanel.hidden = !open;
    chatLauncher.setAttribute('aria-expanded', String(open));
    if (open) chatClose.focus();
    else chatLauncher.focus();
  };
  chatLauncher.addEventListener('click', () => setChatOpen(chatPanel.hidden !== false));
  chatClose.addEventListener('click', () => setChatOpen(false));
  chatPanel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setChatOpen(false);
  });
  document.querySelectorAll<HTMLButtonElement>('[data-chat-topic]').forEach((button) => {
    button.addEventListener('click', () => {
      const topic = button.dataset.chatTopic;
      const answer = document.createElement('p');
      answer.className = 'chat-message chat-message-bot';

      if (topic === 'modules') {
        answer.textContent = 'Veja os módulos confirmados na página de funcionalidades. Para informações específicas da sua operação, nossa equipe pode ajudar.';
        const link = document.createElement('a');
        link.href = '/funcionalidades';
        link.textContent = 'Ver funcionalidades';
        chatMessages.append(answer, link);
      } else if (topic === 'demo') {
        answer.textContent = 'Preencha o pedido de demonstração ou fale diretamente com a equipe.';
        const link = document.createElement('a');
        link.href = '/contato#agendar-demonstracao';
        link.textContent = 'Solicitar demonstração';
        chatMessages.append(answer, link);
      } else {
        answer.textContent = 'Você pode falar conosco por telefone, WhatsApp ou e-mail.';
        const link = document.createElement('a');
        link.href = '/contato#canais-diretos';
        link.textContent = 'Ver canais de contato';
        chatMessages.append(answer, link);
      }
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  });
}
