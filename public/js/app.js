document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.page;

  document.querySelectorAll('[data-page-link]').forEach((link) => {
    if (link.dataset.pageLink === page) link.setAttribute('aria-current', 'page');
  });

  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.mobile-menu-panel');

  const closeMenu = (restoreFocus = false) => {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开导航');
    menu.hidden = true;
    if (restoreFocus) toggle.focus();
  };

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? '打开导航' : '关闭导航');
      menu.hidden = open;
    });

    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
    });
  }

  const skipLink = document.querySelector('.skip-link');
  const main = document.querySelector('#main');
  skipLink?.addEventListener('click', (event) => {
    if (!main) return;
    event.preventDefault();
    main.focus({ preventScroll: true });
    main.scrollIntoView();
    history.replaceState(null, '', '#main');
  });

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const dialog = document.querySelector('.image-dialog');
  const dialogImage = dialog?.querySelector('.dialog-image');
  const dialogCaption = dialog?.querySelector('.dialog-caption');
  const dialogClose = dialog?.querySelector('.dialog-close');
  let opener = null;

  document.querySelectorAll('.photo-button').forEach((button) => {
    button.addEventListener('click', () => {
      const figure = button.closest('.photo-item');
      const image = figure?.querySelector('img');
      if (!dialog || !dialogImage || !image) return;
      opener = button;
      dialogImage.removeAttribute('srcset');
      dialogImage.removeAttribute('sizes');
      dialogImage.src = image.dataset.full || image.currentSrc || image.src;
      dialogImage.alt = image.alt;
      if (dialogCaption) dialogCaption.textContent = image.alt;
      dialog.showModal();
    });
  });

  const closeDialog = () => {
    if (!dialog?.open) return;
    dialog.close();
    opener?.focus();
  };

  dialogClose?.addEventListener('click', closeDialog);
  dialog?.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
});
