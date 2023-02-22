/**
 * Preload an image
 *
 * @param {String} imageUrl Image url
 * @returns {Promise} A promise with the image url, resolved when image is loaded
 */
export default (imageUrl) => {
    return new Promise(resolve => {
    const image = new Image()

    image.onload = () => {
      resolve(imageUrl)
    }

    image.src = imageUrl
  })
}
