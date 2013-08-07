require.config({
    baseUrl: 'js',
    shim: {
        OpenLayers: {
            exports: 'OpenLayers'
        },
        handlebars: {
            exports: 'Handlebars'
        }
    },
    paths: {
        "backbone": "../bower_components/backbone-amd/backbone",
        "jquery": "../bower_components/jquery/jquery",
        "OpenLayers": "lib/OpenLayers/OpenLayers",
        "underscore": "../bower_components/underscore-amd/underscore",
        "handlebars": "../bower_components/handlebars/handlebars"
    }
});

require([
    "views/tags",
    "views/map"
], function (TagsView, MapView) {
    'use strict';

    console.log("init");
    var tags_view = new MapView();

    console.log(tags_view);

});