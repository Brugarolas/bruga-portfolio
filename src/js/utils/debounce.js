/* Debounce function (without context binding, be careful!) */
const debounce = (callback, wait = 50, immediate = false) => {
	let timeout;

	return function() {
    const callNow = immediate && !timeout;
    const next = () => callback.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(next, wait);

    if (callNow) next();
	};
};

export default debounce;
