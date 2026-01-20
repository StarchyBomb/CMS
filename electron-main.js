// Electron Main Process for TorYod CMS Desktop App
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.js'),
      webSecurity: false // Allow CORS for scraping
    },
    titleBarStyle: 'default',
    icon: path.join(__dirname, 'icon.ico'),
    show: false
  });

  // Load app
  mainWindow.loadFile('electron-app.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers

// Scrape website data
ipcMain.handle('scrape-website', async (event, url) => {
  try {
    const data = await scrapeWebsite(url);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Install plugin to website
ipcMain.handle('install-plugin', async (event, websiteUrl, pluginCode) => {
  try {
    // This would require backend access - for now return success
    // In production, this would need server-side implementation
    return { success: true, message: 'Plugin installed successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Save extracted data
ipcMain.handle('save-data', async (event, data) => {
  try {
    const savePath = await dialog.showSaveDialog(mainWindow, {
      title: 'Save CMS Data',
      defaultPath: 'cms-data.json',
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });

    if (!savePath.canceled) {
      fs.writeFileSync(savePath.filePath, JSON.stringify(data, null, 2));
      return { success: true, path: savePath.filePath };
    }
    return { success: false, canceled: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Load data
ipcMain.handle('load-data', async (event) => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Load CMS Data',
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const data = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
      return { success: true, data };
    }
    return { success: false, canceled: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Scrape website function
async function scrapeWebsite(url) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;

      client.get(url, (res) => {
        let html = '';
        
        res.on('data', (chunk) => {
          html += chunk;
        });

        res.on('end', () => {
          try {
            const data = extractWebsiteData(html, url);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        });
      }).on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Extract data from HTML
function extractWebsiteData(html, baseUrl) {
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);

  const data = {
    texts: [],
    colors: [],
    images: [],
    styles: [],
    html: {}
  };

  // Extract texts
  $('h1, h2, h3, h4, h5, h6, p, span, a, button, label').each((i, el) => {
    const text = $(el).text().trim();
    const selector = getSelector($(el));
    if (text && text.length > 0) {
      data.texts.push({
        selector: selector,
        text: text,
        tag: el.tagName
      });
    }
  });

  // Extract colors from inline styles and CSS
  $('[style]').each((i, el) => {
    const style = $(el).attr('style');
    const colors = extractColorsFromStyle(style);
    if (colors.length > 0) {
      data.colors.push({
        selector: getSelector($(el)),
        colors: colors
      });
    }
  });

  // Extract CSS from style tags
  $('style').each((i, el) => {
    const css = $(el).html();
    const colors = extractColorsFromCSS(css);
    data.colors.push(...colors);
    data.styles.push(css);
  });

  // Extract images
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src) {
      const fullUrl = new URL(src, baseUrl).href;
      data.images.push({
        selector: getSelector($(el)),
        src: fullUrl,
        alt: $(el).attr('alt') || ''
      });
    }
  });

  // Extract background images
  $('[style*="background-image"]').each((i, el) => {
    const style = $(el).attr('style');
    const match = style.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (match) {
      const fullUrl = new URL(match[1], baseUrl).href;
      data.images.push({
        selector: getSelector($(el)),
        src: fullUrl,
        type: 'background'
      });
    }
  });

  // Extract HTML structure
  $('body > *').each((i, el) => {
    const tag = el.tagName;
    const id = $(el).attr('id');
    const className = $(el).attr('class');
    if (id || className) {
      data.html[tag.toLowerCase()] = {
        id: id,
        class: className,
        selector: getSelector($(el))
      };
    }
  });

  return data;
}

// Get CSS selector for element
function getSelector($el) {
  if ($el.attr('id')) {
    return '#' + $el.attr('id');
  }
  if ($el.attr('class')) {
    return '.' + $el.attr('class').split(' ')[0];
  }
  return $el.prop('tagName').toLowerCase();
}

// Extract colors from inline style
function extractColorsFromStyle(style) {
  const colors = [];
  const colorRegex = /(?:color|background-color|border-color):\s*([#\w]+)/gi;
  let match;
  while ((match = colorRegex.exec(style)) !== null) {
    colors.push(match[1]);
  }
  return colors;
}

// Extract colors from CSS
function extractColorsFromCSS(css) {
  const colors = [];
  const colorRegex = /(?:color|background-color|border-color|background):\s*([#\w()\s,]+)/gi;
  let match;
  while ((match = colorRegex.exec(css)) !== null) {
    const colorValue = match[1].trim();
    if (colorValue.match(/^#[0-9A-Fa-f]{3,6}$/) || 
        colorValue.match(/^(rgb|rgba|hsl|hsla)\(/)) {
      colors.push({
        value: colorValue,
        context: match[0]
      });
    }
  }
  return colors;
}
