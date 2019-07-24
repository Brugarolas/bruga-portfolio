import subscriptions from '../utils/subscription.js';
import requestAnimationFrame from '../utils/raf.js';

const BASE_SELECTOR = '.image-background';
const PAGE_SELECTOR = '.page.page--current'

const initImageBackground = (selector = `${PAGE_SELECTOR} ${BASE_SELECTOR}`) => {
  const transformDataImage = (element) => {
    if (element.style.backgroundImage) {
      return;
    }

    const image = element.getAttribute('data-image');

    element.style.backgroundImage = `url("${image}")`;
  };

  document.querySelectorAll(selector).forEach(transformDataImage);

  subscriptions.on('page-transition-start', ({ next }) => {
    requestAnimationFrame(() => {
      next.querySelectorAll(BASE_SELECTOR).forEach(transformDataImage);
    });
  });
};

export default initImageBackground;
