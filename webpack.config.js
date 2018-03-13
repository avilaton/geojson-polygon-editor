'use strict'

const path = require('path')
const webpack = require('webpack')
const BASE = './geojson_editor/static'

module.exports = {
  'context': path.join(__dirname, BASE, 'js'),
  'resolve': {
    'modules': [path.join(__dirname, BASE, 'js'), 'node_modules'],
    'alias': {
      'OpenLayers': path.join(__dirname, 'static/js/lib/OpenLayers/OpenLayers.js'),
    }
  },
  'entry': {
    editor: './editor.js'
  },
  'output': {
    'path': path.join(__dirname, BASE, 'dist'),
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
