import raf from './raf.js';

/**
 * TODO Smooth scroll does not work on Safari
 * Find some working polyfill. Some examples which may work:
 * https://github.com/iamdustan/smoothscroll
 * https://github.com/magic-akari/seamless-scroll-polyfill
 * https://github.com/wessberg/scroll-behavior-polyfill
 * https://github.com/cferdinandi/smooth-scroll
 */
function _getScrollingElement () {
  return document.scrollingElement || document.querySelector('.scrolling-element');
}

export function scrollToElement (selector, parentElement) {
  const parent = parentElement || document;
  const element = parent.querySelector(selector);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', alignToTop: true, block: 'start' });
  }
}

export function scrollTop () {
  raf(() => {
    const element = this._getScrollingElement();

    element.scrollTo({ top: 0, behavior: 'smooth' });
  })
}

export function scrollBottom () {
  raf(() => {
    const scrollElement = this._getScrollingElement();
    const bottom = scrollElement ? scrollElement.scrollHeight : 0;

    scrollElement.scrollTo({ top: bottom, behavior: 'smooth' });
  })
}

export default { scrollToElement, scrollTop, scrollBottom }
