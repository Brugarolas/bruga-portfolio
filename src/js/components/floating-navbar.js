import addEventListener from '../utils/event-listener.js';
import requestAnimationFrame from '../utils/raf.js';
import subscriptions from '../utils/subscription.js';
import onResize from '../utils/on-resize.js';
import { autobind, memoize } from 'useful-decorators';

const ACTIVE_MENU_CLASS = 'floating-navbar--open';
const OPEN_CLOSE_MENU_DURATION = 800;

/* Aux functions */
class ExpandableElement {
  constructor (element) {
    this.element = element;
  }

  @autobind()
  @memoize()
  getBoundingClientRectWithCache () {
    return this.element.getBoundingClientRect();
  };

  @autobind()
  calcElementScale () {
    const elementInfo = this.getBoundingClientRectWithCache();
    const height = window.innerHeight;
    const width = window.innerWidth;

    const necessaryWidth = width - (elementInfo.top + elementInfo.width / 2);
    const necessaryHeight = height - (elementInfo.top + elementInfo.width / 2);

    const hypotenuse = Math.sqrt(necessaryWidth * necessaryWidth + necessaryHeight * necessaryHeight);

    return Math.ceil(2 * hypotenuse / elementInfo.width);
  };
}

/* Init floating menu function */
const initFloatingNavbar = (selector = '.floating-navbar') => {
  const navbar = document.querySelector(selector);
  const navbarButton = navbar.querySelector(`${selector}__button`);
  const navbarBackground = navbar.querySelector(`${selector}__background`);

  // On click open and close
  addEventListener(navbarButton, 'click', () => {
    const menuIsOpen = navbar.classList.contains(ACTIVE_MENU_CLASS);
    const element = new ExpandableElement(navbarBackground);
    const elementScale = menuIsOpen ? 1 : element.calcElementScale();

    requestAnimationFrame(() => {
      navbar.classList.toggle(ACTIVE_MENU_CLASS);
      navbarBackground.style.transform = `scale3d(${elementScale}, ${elementScale}, 1)`;
    });
  });

  // Close when page transition start (if menu is open)
  subscriptions.on('page-transition-start', () => {
    if (!navbar.classList.contains(ACTIVE_MENU_CLASS)) {
      return false;
    }

    return new Promise((resolve, reject) => {
      requestAnimationFrame(() => {
        navbar.classList.remove(ACTIVE_MENU_CLASS);
        navbarBackground.style.transform = `scale3d(1, 1, 1)`;

        setTimeout(() => {
          resolve(true);
        }, OPEN_CLOSE_MENU_DURATION / 2);
      });
    });
  });

  // Change background size on resize
  onResize(() => {
    if (navbar.classList.contains(ACTIVE_MENU_CLASS)) {
      requestAnimationFrame(() => {
        const elementScale = calcElementScale(navbarBackground);

        navbarBackground.style.transform = `scale3d(${elementScale}, ${elementScale}, 1)`;
      });
    }
  });
};

export default initFloatingNavbar;
