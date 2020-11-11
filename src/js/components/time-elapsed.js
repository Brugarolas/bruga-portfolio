import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import requestAnimationFrame from '../utils/raf.js';

const BASE_SELECTOR = '.time-elapsed';
const DEFAULT_UNITS = 'years';

const attributeExists = (attribute) => {
  return attribute !== null && attribute !== undefined;
};

const transformTimeElapsed = (element) => {
  const since = element.getAttribute('data-since');
  const units = element.getAttribute('data-since-units') || DEFAULT_UNITS;
  const useSuffix = attributeExists(element.getAttribute('data-since-use-suffix'));

  if (!since) {
    return;
  }

  const date = dayjs(since, 'DD-MM-YYYY');

  if (!date.isValid()) {
    return;
  }

  const now = dayjs();
  const diff = Math.round(now.diff(date, units, useSuffix));

  if (!useSuffix) {
    element.textContent = diff;
    return;
  }

  if (units === 'months') {
    const years = Math.floor(diff / 12);
    const months = diff % 12;
    let text = `${years} years and ${months} months`;

    if (months < 2) {
      text = `${years} years`;
    }
    if (months > 9) {
      text = `${years + 1} years`;
    }

    element.textContent = text;
    return;
  }

  element.textContent = `${diff} ${units}`;
};

const initTimeElapsed = (selector = BASE_SELECTOR) => {
  dayjs.extend(customParseFormat);

  document.querySelectorAll(selector).forEach(transformTimeElapsed);
};

export default initTimeElapsed;
