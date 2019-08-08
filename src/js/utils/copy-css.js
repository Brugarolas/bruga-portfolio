/* Aux functions */
const getComputedStyle = (element, property) => {
  if (window.getComputedStyle) {
    return window.getComputedStyle(element).getPropertyValue(property);
  }
};

const getComputedStyleWithCache = (element, property) => {
  element.computedStyle = element.computedStyle || {};
  let style = element.computedStyle[property];

  if (!style) {
    style = getComputedStyle(element, property);
    element.computedStyle[property] = style;
  }

  return style;
};

/* Main function */
const copyCss = (from, to, property, cache = true) => {
  const style = cache ? getComputedStyleWithCache(from, property) : getComputedStyle(from, property);

  if (style) {
    to.style[property] = style;
  }
};

export default copyCss;
