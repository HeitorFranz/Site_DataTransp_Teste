document.addEventListener('DOMContentLoaded', () => {
  // 1. Menu Mobile Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isActive);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. FAQ Accordion Interativo
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 3. Animação de Contagem dos Números
  const metricNumbers = document.querySelectorAll('.metric-number');
  let animated = false;

  const animateCounters = () => {
    metricNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const speed = 200;

      const updateCount = () => {
        const count = +counter.innerText;
        const inc = Math.ceil(target / speed);

        if (count < target) {
          counter.innerText = count + inc;
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target.toLocaleString('pt-BR');
        }
      };

      updateCount();
    });
  };

  const metricsSection = document.getElementById('metricas');
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animated) {
        animateCounters();
        animated = true;
      }
    }, { threshold: 0.5 });

    observer.observe(metricsSection);
  }

  // 4. Submissão do Formulário para o WhatsApp
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const empresa = document.getElementById('empresa').value.trim();
      const nome = document.getElementById('nome').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const frota = document.getElementById('frota').value;

      if (!empresa || !nome || !telefone) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
      }

      const mensagem = `Olá, equipe DataTransp! Gostaria de agendar uma demonstração.\n\n` +
                       `*Empresa:* ${empresa}\n` +
                       `*Nome/Cargo:* ${nome}\n` +
                       `*Telefone:* ${telefone}\n` +
                       `*Tamanho da Frota:* ${frota}`;

      const whatsappURL = `https://wa.me/5549989045534?text=${encodeURIComponent(mensagem)}`;

      alert('Obrigado! Você será redirecionado para o WhatsApp da equipe comercial.');
      window.open(whatsappURL, '_blank');
      leadForm.reset();
    });
  }
});