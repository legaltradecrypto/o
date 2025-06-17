const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

async function downloadFile(url, destFolder) {
  try {
    await fs.ensureDir(destFolder);
    const fileName = path.basename(url.split('?')[0]);
    const filePath = path.join(destFolder, fileName);

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`Downloaded: ${fileName} -> ${filePath}`);
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
  }
}

const [,, url, destFolder] = process.argv;

if (!url || !destFolder) {
  console.log('Usage: node index.js <URL> <destination-folder>');
  process.exit(1);
}

downloadFile(url, destFolder);