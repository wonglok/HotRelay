var srv = require('./srv.js');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const fileExists = require('file-exists');
const moveFile = require('move-file');
const save = require('save-file')
var mkdirp = require('mkdirp');

const notifier = require('node-notifier');
const electron = require('electron');
const app = electron.app;
const path = require('path');

// consttants
const CURRENT_FILE = 'state.json';
const CURRENT_FOLDER = './Hot_Relay_Current';
const BACKUP_FOLDER = './Hot_Relay_Backups';
function formatDate(date) {
  var monthNames = [
    '1', '2', '3',
    '4', '5', '6', '7',
    '8', '9', '10',
    '11', '12'
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return `${year}-${monthNames[monthIndex]}-${day}`
}
function toTime (date) {
  function pad(number) {
    if (number < 10) {
      return '0' + number;
    }
    return number;
  }
  return 'Time' + pad(date.getHours()) +
  '.' + pad(date.getMinutes()) +
  '.' + pad(date.getSeconds()) +
  '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5)
}

// get latest time backup name
const getBackupName = () => {
  var date = new Date()
  var backup = 'backup-' + formatDate(date) + '@' + toTime(date) + '.json'
  return backup
}

const getBackupFolderRoot = () => {
  return path.join(memory.folder, BACKUP_FOLDER)
}

const getBackupFolder = () => {
  var date = new Date()
  return path.join(memory.folder, BACKUP_FOLDER, './' + formatDate(date))
}

const Dialog = electron.dialog;

var state = require('./state.js');
var memory = require('./memory.js');

var loadFolder = () => {
  Dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files && files[0]) {
      let folder = files[0]
      memory.folder = folder
      srv.emit('folder-selected')
    }
  })
  app.focus()
}

srv.on('load-folder' , () => {
  loadFolder()
})

srv.on('shall-backup-later', () => {
  memory.saved = false
  srv.emit('state-saved')
  clearTimeout(memory.timer || 0)
  memory.timer = setTimeout(() => {
    srv.emit('commit-to-disk')
    memory.saved = true
    srv.emit('state-saved')
  }, 1000 * 60)
})

async function provideBackupFolder () {
  if (memory.folder) {
    let rootFolder = getBackupFolderRoot()
    if (!await fileExists(rootFolder)) {
      mkdirp.sync(rootFolder)
    }

    let folder = getBackupFolder()
    if (!await fileExists(folder)) {
      mkdirp.sync(folder)
    }
  } else {
    throw new Error('no folder set')
  }
}

async function provideCurrentFolder () {
  let folder = path.join(memory.folder, CURRENT_FOLDER)
  if (!await fileExists(folder)) {
    mkdirp.sync(folder)
  }
}

srv.on('folder-selected', async () => {
  await provideCurrentFolder()
  await provideBackupFolder()
  let currentFile = path.join(memory.folder, CURRENT_FOLDER, CURRENT_FILE);
  if (await fileExists(currentFile)) {
    let str = await readFile(currentFile)
    let obj = JSON.parse(str)
    Object.keys(obj).forEach((aKey) => {
      state[aKey] = obj[aKey]
    })
    memory.saved = true
    srv.emit('state-saved')
    //if there is no state file then save a state file
  } else {
    srv.emit('commit-to-disk')
  }

  srv.emit('update-all-client-state', state)

  memory.ready = true
  srv.emit('root-ready', memory.ready)
})

srv.on('commit-to-disk', async () => {
  if (memory.folder) {
    let currentFile = path.join(memory.folder, CURRENT_FOLDER, CURRENT_FILE);
    if (await fileExists(currentFile)) {
      let newPath = path.join(getBackupFolder(), getBackupName())
      provideBackupFolder()
      await moveFile(currentFile, newPath)
    }

    provideCurrentFolder()

    state.time = new Date()
    srv.emit('update-all-client-state', state)

    memory.saved = true
    srv.emit('state-saved')

    let newFileData = JSON.stringify(state, null, '\t')
    await save(newFileData, currentFile)

    notifier.notify({
      sound: true,
      title: 'Saved.',
      message: 'State JSON is saved successfully saved.',
      icon: path.join(__dirname, './img/logo.png')
    });
  } else {
    notifier.notify({
      sound: 'Glass',
      title: 'Please select a folder',
      message: 'Please select a folder',
      icon: path.join(__dirname, './img/logo.png'),
      // actions: 'Load Folder',
      // closeLabel: 'Cancel',
      // wait: true
    });
  }
})

