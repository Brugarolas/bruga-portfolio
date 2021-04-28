const puppeteer = require('puppeteer-core')
const { extendDefaultPlugins, optimize } = require('svgo')
const { getIconFileDataFromURL } = require('./download-icon-utils.js')
const fs = require('fs')
const chalk = require('chalk')
const log = console.log // eslint-disable-line no-console
const logError = console.error // eslint-disable-line no-console

/**
 * Method that uses Puppeteer to download element from remote page
 *
 * @param {String} url URL
 * @param {String} selector HTML selector
 * @returns {String} Selector outer HTML content
 */
const downloadElementFromPage = async (url, selector) => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' // From chrome://version/ - only works in Mac right now
  })

  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'networkidle2'
  })

  await page.waitForSelector(selector, {
    visible: true
  })

  const selectedElement = await page.$(selector)
  const elementHtml = await page.evaluate((element) => element.outerHTML, selectedElement)
  await selectedElement.dispose()

  await browser.close()

  return elementHtml
}

/**
 * Method that uses SVGO to optimize a SVG, removing redundant and useless information
 *
 * @param {String} svgString SVG to optimize
 * @returns {String} Optimized SVG
 */
const optimizeSvg = (svgString) => {
  const result = optimize(svgString, {
    multipass: true,
    plugins: extendDefaultPlugins([
      {
        name: 'removeViewBox',
        active: false
      },
      {
        name: 'removeAttrs',
        active: true,
        params: {
          attrs: '(class|focusable|aria-hidden|data-prefix|data-icon)'
        }
      },
      {
        name: 'removeDimensions',
        active: true
      }
    ])
  })

  return result.data
}

/**
 * Method that writes string content into a specified file path, overriding file it it already exists
 *
 * @param {String} filePath Path of the file
 * @param {String} stringContent Content of the file
 * @returns {Promise} Promise what will be resolved when file is written, or will throw an error if it could not
 */
const saveFile = (filePath, stringContent) => {
  return new Promise((resolve) => {
    fs.writeFile(filePath, stringContent, { encoding: 'utf8', flag: 'w' }, (error) => {
      if (error) throw error

      resolve({ filePath, stringContent })
    })
  })
}

/**
 * All the magic happens here!
 * Download SVG from Font Awesome URL, optimizes it, and saves it in our project
 *
 * @param {String} faURL Font Awesome icon URL
 * @returns {Promise} Promise what will be resolved when file is written
 */
const addIconToProject = async (faURL) => {
  // Guess icon file name from URL
  const iconData = getIconFileDataFromURL(faURL)

  return downloadElementFromPage(faURL, iconData.selector).then(
    svgString => optimizeSvg(svgString)
  ).then(
    svgString => saveFile(iconData.path, svgString)
  ).then(() => {
    log(`${chalk.bold('Successfully added')} ${chalk.bold.green(iconData.name)} ${chalk.bold('icon to project!')}\n`)
  }).catch(error => {
    logError(error)
  })
}

// Check args are valid
const scriptName = process.argv[1] // Second process argument is script name
const isRunningAddIconScript = scriptName.includes('scripts/download-fa-icon')

// If we are running this script, add icon to project
// Otherwise, export method
if (isRunningAddIconScript) {
  const args = process.argv.slice(2)
  const faURL = args[0] // First parameter is the URL of Font Awesome icon

  if (!faURL) {
    throw new Error('Font Awesome icon URL is missing')
  }

  addIconToProject(faURL)
}

module.exports = {
  addIconToProject
}
