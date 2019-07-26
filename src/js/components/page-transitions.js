import requestAnimationFrame from '../utils/raf.js';
import addOnClick from '../utils/add-on-click.js'
import subscriptions from '../utils/subscription.js';

const TRANSITION_DURATION = 705;
const ACTIVE_CLASS = 'page--current';
const HIDDEN_CLASS = 'page--hidden';
const ACTIVE_LINK_CLASS = 'link-local--selected';
const KEYS = {
  UP: 38,
  DOWN: 40,
  DELETE: 8,
  ENTER: 13,
  SPACE: 32,
  ESC: 27
};
let pageTransitioning = false;

/* Aux: calc page transition classes */
const calcPageTransition = (from, to) => {
  const prevLinks = document.querySelectorAll(`.${ACTIVE_LINK_CLASS}`);
  const nextLinks = document.querySelectorAll(`.link-local[data-transition-to="${to}"]`)

  if (from < to) {
    return { prevLinks, nextLinks, fromClass: 'page--moveToTop', toClass: 'page--moveFromBottom' }
  } else {
    return { prevLinks, nextLinks, fromClass: 'page--moveToBottom', toClass: 'page--moveFromTop' }
  }
}

/* Aux: actually do page transition */
const doPageTransition = async (actualPage, nextPage, pageTransition) => {
  pageTransitioning = true;

  const endTransition = () => {
    requestAnimationFrame(() => {
      actualPage.classList.remove(pageTransition.fromClass);
      actualPage.classList.remove(ACTIVE_CLASS);
      nextPage.classList.remove(pageTransition.toClass);

      actualPage.classList.add(HIDDEN_CLASS);

      subscriptions.emit('page-transition-end', { prev: actualPage, actual: nextPage });
      pageTransitioning = false;
    });
  };

  const startTransition = () => {
    actualPage.classList.add(pageTransition.fromClass);
    nextPage.classList.add(pageTransition.toClass);
    nextPage.classList.add(ACTIVE_CLASS);

    pageTransition.prevLinks.forEach(element => {
      element.classList.remove(ACTIVE_LINK_CLASS);
    });
    pageTransition.nextLinks.forEach(element => {
      element.classList.add(ACTIVE_LINK_CLASS);
    });

    setTimeout(endTransition, TRANSITION_DURATION);
  };

  await subscriptions.emit('page-transition-start', { actual: actualPage, next: nextPage });

  nextPage.classList.remove(HIDDEN_CLASS);

  requestAnimationFrame(startTransition);
};

/* Init bindings */
const initPageTransitionButtons = (selector = '[data-transition-to]') => {
  /* Aux functions */
  const getActualPage = () => {
    return document.querySelector('.page.page--current');
  };

  const transition = (actualPage, actualPageId, nextPage, nextPageId) => {
    if (pageTransitioning || !actualPage || !actualPageId || !nextPage || nextPageId === actualPageId) {
      return;
    }

    const pageTransition = calcPageTransition(actualPageId, nextPageId);

    doPageTransition(actualPage, nextPage, pageTransition);
  };

  /* Local links bindings */
  document.querySelectorAll(selector).forEach(element => {
    const nextPageId = element.getAttribute('data-transition-to');
    const nextPage = nextPageId && document.querySelector(`.page[data-page="${nextPageId}"]`);

    if (!nextPageId || !nextPage) {
      return;
    }

    addOnClick(element, function() {
      const actualPage = getActualPage();
      const actualPageId = actualPage && actualPage.getAttribute('data-page');

      transition(actualPage, actualPageId, nextPage, nextPageId);
    });
  });

  /* Key bindings */
  const goPrevPage = (backwards = false) => {
    const actualPage = getActualPage();
    const actualPageId = actualPage.getAttribute('data-page');
    const nextPageId = actualPageId - (backwards ? 1 : -1);
    const nextPage = document.querySelector(`.page[data-page="${nextPageId}"]`);

    transition(actualPage, actualPageId, nextPage, nextPageId);
  };

  window.addEventListener('keydown', function({ keyCode }) {
    if (keyCode === KEYS.DOWN || keyCode === KEYS.ENTER || keyCode === KEYS.SPACE) {
      return goPrevPage(false);
    }
    if (keyCode === KEYS.UP || keyCode === KEYS.DELETE || keyCode === KEYS.ESC) {
      return goPrevPage(true);
    }
  });
};

export default initPageTransitionButtons;
