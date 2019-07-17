import requestAnimationFrame from '../utils/raf.js';
import addOnClick from '../utils/add-on-click.js'

const TRANSITION_DURATION = 705;
const ACTIVE_CLASS = 'page--current';
const ONTOP_CLASS = 'page--ontop';
const ACTIVE_LINK_CLASS = 'link-local--selected';

const ACTIVE_MENU_CLASS = 'floating-navbar--open';
const CLOSE_MENU_BUTTON = 'floating-navbar__button';
const CLOSE_MENU_DURATION = 800;

const closeFloatingMenu = () => {
  if (!document.querySelector(`.${ACTIVE_MENU_CLASS}`)) {
    return true;
  }

  return new Promise((resolve, reject) => {
    document.querySelector(`.${CLOSE_MENU_BUTTON}`).click();

    setTimeout(() => {
      resolve(true);
    }, CLOSE_MENU_DURATION / 2);
  });
};

const calcPageTransition = (from, to) => {
  const prevLinks = document.querySelectorAll(`.${ACTIVE_LINK_CLASS}`);
  const nextLinks = document.querySelectorAll(`.link-local[data-transition-to="${to}"]`)

  if (from < to) {
    return { prevLinks, nextLinks, fromClass: 'page--moveToTop', toClass: 'page--moveFromBottom' }
  } else {
    return { prevLinks, nextLinks, fromClass: 'page--moveToBottom', toClass: 'page--moveFromTop' }
  }
}

const doPageTransition = async (actualPage, nextPage, pageTransition) => {
  await closeFloatingMenu();

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
