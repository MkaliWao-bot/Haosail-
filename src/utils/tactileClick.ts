export function initTactileButtonPing(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const handleClick = (event: MouseEvent) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rawTarget = event.target as HTMLElement | null;
    if (!rawTarget) return;

    const button = rawTarget.closest('button, a[role="button"]') as HTMLElement | null;
    if (!button) return;

    if (
      (button as HTMLButtonElement).disabled ||
      button.getAttribute('aria-disabled') === 'true' ||
      button.hasAttribute('data-no-ping')
    ) {
      return;
    }

    const computed = window.getComputedStyle(button);
    const isUnboxedLink =
      (computed.backgroundColor === 'rgba(0, 0, 0, 0)' ||
        computed.backgroundColor === 'transparent') &&
      parseFloat(computed.borderTopWidth || '0') === 0 &&
      parseFloat(computed.paddingLeft || '0') <= 4;

    if (isUnboxedLink) {
      return;
    }

    const rect = button.getBoundingClientRect();
    if (rect.width < 12 || rect.height < 12 || rect.width > window.innerWidth) {
      return;
    }

    const sx = (rect.width + 12) / rect.width;
    const sy = (rect.height + 12) / rect.height;

    const isDark = document.documentElement.classList.contains('dark');
    const customColor = button.getAttribute('data-ping-color');
    const isEmeraldBg =
      computed.backgroundColor === 'rgb(0, 168, 89)' ||
      button.className.includes('bg-[#00a859]');

    const pingColor = customColor
      ? customColor
      : isEmeraldBg
      ? '#00a859'
      : isDark
      ? 'rgba(56, 189, 248, 0.85)'
      : 'rgba(0, 75, 151, 0.78)';

    const ring = document.createElement('span');
    ring.className = 'haosail-ping-ring';
    ring.setAttribute('aria-hidden', 'true');
    ring.style.top = `${rect.top}px`;
    ring.style.left = `${rect.left}px`;
    ring.style.width = `${rect.width}px`;
    ring.style.height = `${rect.height}px`;
    ring.style.borderRadius = computed.borderRadius || '6px';
    ring.style.setProperty('--ping-sx', sx.toFixed(4));
    ring.style.setProperty('--ping-sy', sy.toFixed(4));
    ring.style.setProperty('--ping-color', pingColor);

    document.body.appendChild(ring);

    const cleanup = () => {
      if (ring.parentNode) {
        ring.parentNode.removeChild(ring);
      }
    };

    ring.addEventListener('animationend', cleanup, { once: true });
    window.setTimeout(cleanup, 340);
  };

  document.addEventListener('click', handleClick, { passive: true, capture: true });

  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
  };
}
