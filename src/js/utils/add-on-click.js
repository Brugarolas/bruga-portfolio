const addOnClick = (element, onClick) => {
  if (element.addEventListener) {
    element.addEventListener('click', onClick, false);
  } else if (element.attachEvent) {
    element.attachEvent('click', onClick);
  }
};

export default addOnClick;
