(() => {
  const deck = document.querySelector('deck-stage');
  const prevButton = document.getElementById('prev-slide');
  const nextButton = document.getElementById('next-slide');
  const fullscreenButton = document.getElementById('fullscreen-toggle');
  const pageIndicator = document.getElementById('page-indicator');
  const progressBar = document.getElementById('progress-bar');
  const total = deck.children.length;

  const updateControls = (index) => {
    pageIndicator.textContent = `${index + 1} / ${total}`;
    progressBar.style.width = `${((index + 1) / total) * 100}%`;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === total - 1;
    const url = `${window.location.pathname}${window.location.search}#${index + 1}`;
    window.history.replaceState(null, '', url);
  };

  deck.addEventListener('slidechange', (event) => {
    updateControls(event.detail.index);
  });

  prevButton.addEventListener('click', () => deck.prev());
  nextButton.addEventListener('click', () => deck.next());

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      fullscreenButton.title = '当前浏览器未允许全屏，请使用浏览器全屏功能';
    }
  };

  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    fullscreenButton.setAttribute('aria-label', active ? '退出全屏' : '进入全屏');
    fullscreenButton.title = active ? '退出全屏（F）' : '进入全屏（F）';
  });

  document.addEventListener('keydown', (event) => {
    const target = event.target;
    const editing = target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));
    if (!editing && event.key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleFullscreen();
    }
  });

  const requestedPage = Number.parseInt(window.location.hash.replace('#', ''), 10);
  if (Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= total) {
    window.requestAnimationFrame(() => deck.goTo(requestedPage - 1));
  } else {
    updateControls(0);
  }

  if (!document.documentElement.requestFullscreen) {
    fullscreenButton.hidden = true;
  }
})();
