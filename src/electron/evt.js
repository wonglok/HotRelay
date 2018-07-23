const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

let ev = module.exports = new MyEmitter();
