import requestAnimationFrame from '../raf.js'

const TRANSITION_DURATION = 705;
const ACTIVE_CLASS = 'page--current';
const ONTOP_CLASS = 'page--ontop';

const calcPageTransition = (from, to) => {
  if (from < to) {
    return { fromClass: 'page--moveToTop', toClass: 'page--moveFromBottom' }
  } else {
    return { fromClass: 'page--moveFromTop', toClass: 'page--moveToBottom' }
  }
}

const addOnClick = (element, onClick) => {
  if (element.addEventListener) {
    element.addEventListener('click', onClick, false);
  } else if (element.attachEvent) {
    element.attachEvent('click', onClick);
  }
};

const doPageTransition = (actualPage, nextPage, pageTransition) => {
  requestAnimationFrame(() => {
    actualPage.classList.add(pageTransition.fromClass);
    nextPage.classList.add(pageTransition.toClass);
    nextPage.classList.add(ACTIVE_CLASS);
    nextPage.classList.add(ONTOP_CLASS);

    setTimeout(() => {
      requestAnimationFrame(() => {
        actualPage.classList.remove(pageTransition.fromClass);
        actualPage.classList.remove(ACTIVE_CLASS);
        nextPage.classList.remove(pageTransition.toClass);
        nextPage.classList.remove(ONTOP_CLASS);
      });
    }, TRANSITION_DURATION);
  });
};

const initPageTransitionButtons = (selector = '[data-transition-to]') => {
  const getActualPage = () => {
    return document.querySelector('.page.page--current');
  };

  document.querySelectorAll(selector).forEach(element => {
    const nextPageId = element.getAttribute('data-transition-to');
    const nextPage = nextPageId && document.querySelector(`[data-page="${nextPageId}"]`);

    if (!nextPageId || !nextPage) {
      return;
    }

    addOnClick(element, function() {
      const actualPage = getActualPage();
      const actualPageId = actualPage && actualPage.getAttribute('data-page');

      if (!actualPage || !actualPageId || nextPageId === actualPageId) {
        return;
      }

      const pageTransition = calcPageTransition(actualPageId, nextPageId);

      doPageTransition(actualPage, nextPage, pageTransition);
    });
  });
};

export default initPageTransitionButtons;
