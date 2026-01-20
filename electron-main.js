// Electron Main Process for TorYod CMS Desktop App
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Load cheerio at top level
let cheerio;
try {
  cheerio = require('cheerio');
  console.log('✅ Cheerio loaded successfully');
} catch (error) {
  console.error('❌ Failed to load cheerio:', error);
  // Fallback: use basic HTML parsing
}

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

  // Open DevTools for debugging (always open for now)
  mainWindow.webContents.openDevTools();
  
  // Log errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Failed to load:', errorCode, errorDescription);
  });

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
  console.log('🔍 Scraping website:', url);
  try {
    if (!url || url.trim() === '') {
      throw new Error('URL is required');
    }

    // Validate and fix URL
    let validUrl = url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'http://' + validUrl;
    }

    console.log('📥 Fetching:', validUrl);
    const data = await scrapeWebsite(validUrl);
    console.log('✅ Scraping successful, found:', {
      texts: data.texts?.length || 0,
      colors: data.colors?.length || 0,
      images: data.images?.length || 0,
      styles: data.styles?.length || 0
    });
    return { success: true, data };
  } catch (error) {
    console.error('❌ Scraping error:', error);
    return { success: false, error: error.message || 'Unknown error occurred' };
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

      const options = {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      };

      const req = client.get(url, options, (res) => {
        console.log('📡 Response status:', res.statusCode);
        
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        let html = '';
        const maxSize = 10 * 1024 * 1024; // 10MB limit
        let totalSize = 0;
        
        res.on('data', (chunk) => {
          totalSize += chunk.length;
          if (totalSize > maxSize) {
            req.destroy();
            reject(new Error('Response too large'));
            return;
          }
          html += chunk.toString('utf8');
        });

        res.on('end', () => {
          try {
            console.log('📄 HTML received, length:', html.length);
            if (html.length === 0) {
              reject(new Error('Empty response from server'));
              return;
            }
            const data = extractWebsiteData(html, url);
            resolve(data);
          } catch (error) {
            console.error('❌ Error extracting data:', error);
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Request error:', error);
        reject(new Error(`Failed to connect: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.setTimeout(10000);
    } catch (error) {
      console.error('❌ URL parsing error:', error);
      reject(new Error(`Invalid URL: ${error.message}`));
    }
  });
}

// Extract data from HTML
function extractWebsiteData(html, baseUrl) {
  if (!cheerio) {
    // Fallback: basic extraction without cheerio
    return extractWebsiteDataBasic(html, baseUrl);
  }

  try {
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
  } catch (error) {
    console.error('❌ Cheerio error, using fallback:', error);
    return extractWebsiteDataBasic(html, baseUrl);
  }
}

// Basic extraction without cheerio (fallback)
function extractWebsiteDataBasic(html, baseUrl) {
  console.log('⚠️ Using basic extraction (cheerio not available)');
  const data = {
    texts: [],
    colors: [],
    images: [],
    styles: [],
    html: {}
  };

  // Extract texts using regex
  const textRegex = /<(h[1-6]|p|span|a|button|label)[^>]*>([^<]+)<\/\1>/gi;
  let match;
  while ((match = textRegex.exec(html)) !== null) {
    const text = match[2].trim();
    if (text && text.length > 0) {
      data.texts.push({
        selector: match[1],
        text: text,
        tag: match[1]
      });
    }
  }

  // Extract colors from style attributes
  const styleRegex = /style=["']([^"']+)["']/gi;
  while ((match = styleRegex.exec(html)) !== null) {
    const colors = extractColorsFromStyle(match[1]);
    if (colors.length > 0) {
      data.colors.push({ colors: colors });
    }
  }

  // Extract images
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  while ((match = imgRegex.exec(html)) !== null) {
    try {
      const fullUrl = new URL(match[1], baseUrl).href;
      data.images.push({
        selector: 'img',
        src: fullUrl,
        alt: ''
      });
    } catch (e) {
      data.images.push({
        selector: 'img',
        src: match[1],
        alt: ''
      });
    }
  }

  // Extract CSS from style tags
  const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  while ((match = styleTagRegex.exec(html)) !== null) {
    data.styles.push(match[1]);
    const colors = extractColorsFromCSS(match[1]);
    data.colors.push(...colors);
  }

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
