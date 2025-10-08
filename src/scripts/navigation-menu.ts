const toggleButton = document.querySelector<HTMLButtonElement>('[data-mobile-toggle]');
const mobileMenu = document.querySelector<HTMLElement>('[data-mobile-menu]');
const closeTargets = mobileMenu?.querySelectorAll<HTMLElement>('[data-mobile-close]') ?? [];

if (toggleButton && mobileMenu) {
  const openIcon = toggleButton.querySelector<SVGElement>('[data-icon="open"]');
  const closeIcon = toggleButton.querySelector<SVGElement>('[data-icon="close"]');

  const lockScroll = (shouldLock: boolean) => {
    document.documentElement.classList.toggle('overflow-hidden', shouldLock);
  };

  const openMenu = () => {
    mobileMenu.classList.remove('hidden');
    requestAnimationFrame(() => {
      mobileMenu.classList.remove('opacity-0', 'translate-y-6');
      mobileMenu.classList.add('opacity-100', 'translate-y-0');
    });
    toggleButton.setAttribute('aria-expanded', 'true');
    lockScroll(true);
    openIcon?.classList.add('hidden');
    closeIcon?.classList.remove('hidden');
  };

  const closeMenu = () => {
    mobileMenu.classList.add('opacity-0', 'translate-y-6');
    mobileMenu.classList.remove('opacity-100', 'translate-y-0');
    toggleButton.setAttribute('aria-expanded', 'false');
    lockScroll(false);
    openIcon?.classList.remove('hidden');
    closeIcon?.classList.add('hidden');
    mobileMenu.addEventListener(
      'transitionend',
      () => mobileMenu.classList.add('hidden'),
      { once: true }
    );
  };

  toggleButton.addEventListener('click', () => {
    const isOpen = toggleButton.getAttribute('aria-expanded') === 'true';
    (isOpen ? closeMenu : openMenu)();
  });

  closeTargets.forEach((el) => el.addEventListener('click', closeMenu));

  window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}
