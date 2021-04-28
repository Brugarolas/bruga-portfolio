const fs = require('fs')
const puppeteer = require('puppeteer-core')
const PromisePool = require('@supercharge/promise-pool')
const { getIconFileDataFromURL } = require('./download-icon-utils.js')
const includedIcons = require('./included-icons.json')
const { addIconToProject } = require('./download-fa-icon.js')
const chalk = require('chalk')
const log = console.log // eslint-disable-line no-console

// Probably can get a lot higher before it starts to fail, but it's better to be conservative
const MAX_CONCURRENCY = 12

// Loop over an array of icon URLs and check if they exists in our project
const iconsToDownload = includedIcons.filter(iconUrl => {
  // Guess icon file name from URL
  const iconData = getIconFileDataFromURL(iconUrl)

  return !fs.existsSync(iconData.path)
})

// Download icons that don't exist
const downloadIcons = async (icons) => {
  // Create reusable browser instance
  const browser = await puppeteer.launch({
    // From chrome://version/ - only works in Mac right now
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true
  })

  // Run in parallel using a promise pool and the same browser instance,
  // to avoid memory leaks and too many Puppeteer/Chrome threads
  await PromisePool
    .withConcurrency(MAX_CONCURRENCY)
    .for(icons)
    .process(async icon =>
      addIconToProject(icon, browser)
    )

  // Close browser on end
  await browser.close()

  log(chalk.bold.green('Included icons have been updated!\n'))
}

if (!iconsToDownload.length) {
  log(chalk.bold('Now new icons to add!\n'))
} else {
  downloadIcons(iconsToDownload)
}
