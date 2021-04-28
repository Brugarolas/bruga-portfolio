const puppeteer = require('puppeteer-core')
const { extendDefaultPlugins, optimize } = require('svgo')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const log = console.log // eslint-disable-line no-console
const logError = console.error // eslint-disable-line no-console

const FONT_SVGS_PATH = '../src/svgs/'

// Check args are valid
const args = process.argv.slice(2)
const faUrl = args[0] // First parameter is the URL of Font Awesome icon

if (!faUrl) throw new Error('Font Awesome icon URL is missing')

// Guess icon file name from URL
const splitUrl = faUrl.split('/')
const iconModel = splitUrl[splitUrl.length - 1]

const [iconName, iconStyle] = iconModel.split('?style=')
const fileName = `${iconName}-${iconStyle}`

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
    fs.writeFile(path.resolve(__dirname, filePath), stringContent, { encoding: 'utf8', flag: 'w' }, (error) => {
      if (error) throw error

      resolve({ filePath, stringContent })
    })
  })
}

// All the magic happens here!
// Download SVG from Font Awesome URL, optimizes it, and saves it in our project
downloadElementFromPage(faUrl, `.svg-inline--fa.fa-2x.fa-${iconName}`).then(
  svgString => optimizeSvg(svgString)
).then(
  svgString => saveFile(`${FONT_SVGS_PATH}${fileName}.svg`, svgString)
).then(() => {
  log(`${chalk.bold('Successfully added')} ${chalk.bold.green(fileName)} ${chalk.bold('icon to project!')}\n`)
}).catch(error => {
  logError(error)
})
