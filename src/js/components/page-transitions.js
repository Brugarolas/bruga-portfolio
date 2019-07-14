import requestAnimationFrame from '../raf.js'

const TRANSITION_DURATION = 705;
const ACTIVE_CLASS = 'page--current';
const ONTOP_CLASS = 'page--ontop';
const ACTIVE_LINK_CLASS = 'header-navbar__link--selected';

const calcPageTransition = (from, to) => {
  const prevLinks = document.querySelectorAll(`.${ACTIVE_LINK_CLASS}`);
  const nextLinks = document.querySelectorAll(`.header-navbar__link[data-transition-to="${to}"]`)

  if (from < to) {
    return { prevLinks, nextLinks, fromClass: 'page--moveToTop', toClass: 'page--moveFromBottom' }
  } else {
    return { prevLinks, nextLinks, fromClass: 'page--moveToBottom', toClass: 'page--moveFromTop' }
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

    pageTransition.prevLinks.forEach(element => {
      element.classList.remove(ACTIVE_LINK_CLASS);
    });
    pageTransition.nextLinks.forEach(element => {
      element.classList.add(ACTIVE_LINK_CLASS);
    });

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
