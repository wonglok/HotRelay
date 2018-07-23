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

// get latest time backup name
const getBackupName = () => {
  var date = new Date()
  var time = date.getTime()
  var backup = 'backup-' + time + '.json'
  return backup
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

srv.on('shall-backup-later', ({ io }) => {
  io.emit('not-yet-saved-to-disk')
  clearTimeout(memory.timer || 0)
  memory.timer = setTimeout(() => {
    srv.emit('commit-to-disk')
    io.emit('saved-to-disk')
  }, 1000 * 60)
})

srv.on('folder-selected', async () => {
  async function provideBackupFolder () {
    let folder = path.join(memory.folder, BACKUP_FOLDER)
    if (!await fileExists(folder)) {
      mkdirp.sync(folder)
    }
  }

  async function provideCurrentFolder () {
    let folder = path.join(memory.folder, CURRENT_FOLDER)
    if (!await fileExists(folder)) {
      mkdirp.sync(folder)
      srv.emit('commit-to-disk')
    }
  }

  provideCurrentFolder()
  provideBackupFolder()
  let currentFile = path.join(memory.folder, CURRENT_FOLDER, CURRENT_FILE);
  if (await fileExists(currentFile)) {
    let str = await readFile(currentFile)
    let obj = JSON.parse(str)
    Object.keys(obj).forEach((aKey) => {
      state[aKey] = obj[aKey]
    })
  }
  srv.emit('update-all-client-state', state)
})

srv.on('commit-to-disk', async () => {
  if (memory.folder) {
    async function provideBackupFolder () {
      let folder = path.join(memory.folder, BACKUP_FOLDER)
      if (!await fileExists(folder)) {
        mkdirp.sync(folder)
      }
    }

    async function provideCurrentFolder () {
      let folder = path.join(memory.folder, CURRENT_FOLDER)
      if (!await fileExists(folder)) {
        mkdirp.sync(folder)
      }
    }

    let currentFile = path.join(memory.folder, CURRENT_FOLDER, CURRENT_FILE);
    if (await fileExists(currentFile)) {
      let newPath = path.join(memory.folder, BACKUP_FOLDER, getBackupName())
      provideBackupFolder()
      await moveFile(currentFile, newPath)
    }

    provideCurrentFolder()

    state.time = new Date()
    srv.emit('update-all-client-state', state)

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

