var evt = require('./evt.js');

const electron = require('electron');
const app = electron.app;
const path = require('path');

const fileExists = require('file-exists');
const moveFile = require('move-file');

var mkdirp = require('mkdirp');

const CURRENT_FILE = 'state.json';
const CURRENT_FOLDER = './current';
const BACKUP_FOLDER = './backups';

const getBackupName = () => {
  var date = new Date()
  var time = date.getTime()
  var backup = 'backup-' + time + '.json'
  return backup
}

const Dialog = electron.dialog;

var state = require('./state.js');

var loadFolder = () => {
  Dialog.showOpenDialog({
    properties: ['openDirectory']
  }, function (files) {
    if (files && files[0]) {
      let folder = files[0]

      state.folder = folder
      evt.emit('folder-selected', state)
    }
  })
  app.focus()
}

evt.on('load-folder' , () => {
  loadFolder()
})

evt.on('commit-to-disk', async () => {
  if (state.folder) {

    function provideBackupFolder () {
      var backupFolder = path.join(state.folder, BACKUP_FOLDER)
      if (!await fileExists(backupFolder)) {
        mkdirp.sync(backupFolder)
      }
    }

    var currentFile = path.join(state.folder, CURRENT_FOLDER, CURRENT_FILE);
    if (await fileExists(currentFile)) {
      let newPath = path.join(state.folder, BACKUP_FOLDER, getBackupName())
      provideBackupFolder()
      await moveFile(currentFile, newPath)
    }


  }
})