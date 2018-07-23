const electron = require('electron');
const Tray = electron.Tray;
const Menu = electron.Menu;
const app = electron.app;
const shell = require('electron').shell;
const srv = require('./srv');


var platform = require('os').platform();
var trayImage;
var imageFolder = __dirname + '/img/';

// Determine appropriate icon for platform
if (platform == 'darwin') {
    trayImage = imageFolder + '/osx/icon.png';
}
else if (platform == 'win32') {
    trayImage = imageFolder + '/win/icon.ico';
}
appIcon = new Tray(trayImage);

if (platform == "darwin") {
    appIcon.setPressedImage(imageFolder + '/osx/icon.png');
}

const contextMenu = Menu.buildFromTemplate([
  {
    label: 'Select Hot Relay Folder',
    click: function () {
      srv.emit('load-folder')
    }
  },
  {
    label: 'Open UI Tools',
    click: function () {
      let localIP = require('my-local-ip')()
      shell.openExternal('http://'+ localIP +':2329')
    }
  },
  {
    label: 'Close',
    click: function () {
      app.quit()
    }
  }
])

appIcon.setToolTip('Hot Relay.')
appIcon.setContextMenu(contextMenu)
// app.dock.hide()

module.exports.appIcon = appIcon