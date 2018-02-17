'use strict'

const path = require('path')
const webpack = require('webpack')



module.exports = {
  'context': path.join(__dirname, 'static/js'),
  'resolve': {
    'modules': ['static/js', 'node_modules'],
    'alias': {
      // 'backbone': '../bower_components/backbone-amd/backbone',
      // 'jquery': '../bower_components/jquery/jquery',
      // 'OpenLayers': './lib/OpenLayers/OpenLayers',
      'OpenLayers': path.join(__dirname, 'static/js/lib/OpenLayers/OpenLayers.js'),
      // 'underscore': '../bower_components/underscore-amd/underscore',
      // 'handlebars': '../bower_components/handlebars/handlebars',
      // 'text': '../bower_components/requirejs-text/text'
    }
  },
  'entry': {
    editor: './editor.js'
  },
  'output': {
    'path': path.join(__dirname, 'undefined'),
    'filename': '[name].js'
  },
  'module': {
    'loaders': [
      // {
      //   'test': /OpenLayers/,
      //   'loader': 'exports?OpenLayers'
      // },
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader"
      }
    ]
  }
}
