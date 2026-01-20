// Electron Preload Script
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Scrape website
  scrapeWebsite: (url) => ipcRenderer.invoke('scrape-website', url),
  
  // Install plugin
  installPlugin: (websiteUrl, pluginCode) => ipcRenderer.invoke('install-plugin', websiteUrl, pluginCode),
  
  // Save data
  saveData: (data) => ipcRenderer.invoke('save-data', data),
  
  // Load data
  loadData: () => ipcRenderer.invoke('load-data'),
  
  // App controls
  minimize: () => ipcRenderer.invoke('minimize'),
  maximize: () => ipcRenderer.invoke('maximize'),
  close: () => ipcRenderer.invoke('close')
});
