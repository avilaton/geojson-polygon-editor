'use strict'

const path = require('path')
const webpack = require('webpack')

module.exports = {
  'context': path.join(__dirname, 'static/js'),
  'resolve': {
    'modules': ['static/js', 'node_modules'],
    'alias': {
      'OpenLayers': path.join(__dirname, 'static/js/lib/OpenLayers/OpenLayers.js'),
    }
  },
  'entry': {
    editor: './editor.js'
  },
  'output': {
    'path': path.join(__dirname, 'static/dist'),
    'filename': '[name].js'
  },
  'module': {
    'loaders': [
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader"
      }
    ]
  }
}
