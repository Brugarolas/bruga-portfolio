/**
 * Wraps a function which group multiple sequential calls in a single one
 *
 * @param {function} func - Function to wrap
 * @param {number} delay - Time to wait for next call before executing
 * @return {function} Wrapped function which group calls
 */
export function debounce (func, delay = 50) {
  let debounceTimer

  return function () {
    const context = this
    const args = arguments

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

/**
 * Wraps a function and only allow to execute it once
 *
 * @param {function} func - Function to wrap
 * @return {function} Wrapped function which only allows one execution
*/
export function once (func) {
  let isCalled = false

  return function () {
  if (isCalled) {
    return
  }

    isCalled = true
    const context = this
    const args = arguments

    func.apply(context, args)
  }
}

export default { debonce, once }