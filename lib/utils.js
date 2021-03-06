/* 
 * MIT License (MIT)
 * Copyright (c) 2014 Johann Troendle
 * 
 * This file is part of <grunt-dock>.
 */
var moment = require('moment');

// Exports.
var utils = {};

/**
 * Format value depending on name.
 * Name properties are :
 *  - repotag: parse <repository:tag>
 *  - id: 12 chars max
 *  - command: 16 chars max
 *  - date: time elapsed form now: moment(date).fromNow()
 *  - size: Mb size
 *  - ports: IP:port -> privPort/type (127.0.0.1:80 -> 8080/tcp)
 *  - names: line (\n) separated names
 * 
 * @param  {String}           name   The name to format.
 * @param  {String|Int|Array} value  The value to format.
 * @return {String|Object}           The formatted value.
 */
utils.format = function(name, value) {

  var format = "";

  switch(name) {
    case 'repotag':
      var split = value.split(':');
      format = {
        'repository': split[0],
        'tag': split[1]
      };
      break;
    case 'id':
      format = value.substring(0,12);
      break;
    case 'command':
      format = value.substring(0,16);
      break;
    case 'date':
      format = moment.unix(value).fromNow();
      break;
    case 'size':
      format = (value/1000000).toFixed(1) + ' MB';
      break;
    case 'ports':
      var ports = [];
      for (var p = 0; p < value.length; p++) {
        if (value[p].IP && value[p].PublicPort) {
          ports.push(value[p].IP + ':' + value[p].PublicPort + '->' + value[p].PrivatePort + '/' + value[p].Type);
        }
        else {
          ports.push(value[p].PrivatePort + '/' + value[p].Type);
        }
      }
      format = ports.join(',');
      break;
    case 'names':
      var names = [];
      for (p = 0; p < value.length; p++) {
        names.push(value[p].replace('/', ''));
      }
      format = names.join(',');
      break;
  }
  
  return format;

};

/**
 * Merge 2 objects into a new one.
 * 
 * @param  {Object} o1 First object
 * @param  {Object} o2 Second object
 * @return {Object}    o1 + o2 merged
 */
utils.merge = function(o1, o2) {
  var o3 = {}, attr;
  for (attr in o1) { if (o1.hasOwnProperty(attr)) { o3[attr] = o1[attr]; }}
  for (attr in o2) { if (o2.hasOwnProperty(attr)) { o3[attr] = o2[attr]; }}
  return o3;
};

/**
 * Get the current user directory.
 * Should work on all platforms.
 * 
 * @return {String} The current platform user directory.
 */
utils.getUserHome = function() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
};

/**
 * Check if filename is a tar archive by checking the extension.
 * @return {Boolean} True if yes, else false.
 */
utils.isTarFile = function(filename) {
  var exts = ['.tar', '.tar.gz', '.tar.bz2', '.tar.xz', '.tgz', '.tbz2', '.txz'],
      endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      }

  for (var i = 0; i < exts.length; i++) {
    if (endsWith(filename, exts[i])) {
      return true;
    }
  }

  return false;
};

module.exports = utils;
