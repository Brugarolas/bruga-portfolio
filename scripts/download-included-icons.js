const fs = require('fs')
const { getIconFileDataFromURL } = require('./download-icon-utils.js')
const includedIcons = require('./included-icons.json')
const { addIconToProject } = require('./download-fa-icon.js')
const chalk = require('chalk')
const log = console.log // eslint-disable-line no-console

// Loop over an array of icon URLs and check if they exists in our project
const iconsToDownload = includedIcons.filter(iconUrl => {
  // Guess icon file name from URL
  const iconData = getIconFileDataFromURL(iconUrl)

  return !fs.existsSync(iconData.path)
})

// Download icons that don't exist
// (Not in parallel, it is still not ready and can fail because it opens a bunch of Puppeteers and Chromes in the same thread)
const downloadIcons = async (icons) => {
  for (const icon in icons) {
    await addIconToProject(icons[icon])
  }

  log(chalk.bold.green('\nScript have finished!\n'))
}

downloadIcons(iconsToDownload)
