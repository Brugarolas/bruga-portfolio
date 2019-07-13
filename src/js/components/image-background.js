const initImageBackground = (selector = '.image-background') => {
  document.querySelectorAll(selector).forEach(element => {
    const image = element.getAttribute('data-image');

    element.style.backgroundImage = `url("${image}")`;
  });
};

export default initImageBackground;
