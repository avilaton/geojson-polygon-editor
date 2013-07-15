var polygons = polygons || {};


polygons.core = (function () {
    'use strict';

    var my = {
            config : {
                cgiUrl: '/cgi-bin/transit/editor.py'
            }
        };

    my.init = function (spec) {

        my.config.database = spec.database;
        my.config.cgiDirectory = spec.cgiDirectory;
        my.config.docDirectory = spec.docDirectory;

        $('#'+spec.database+'Menu').addClass('active');

        polygons.controls.mapResize();

        polygons.map.init();
        polygons.map.addLayers();

        return my;
    };

    my.startViewer = function (spec) {
        polygons.controls.viewerControls();
    };

    my.startEditor = function (spec) {
        polygons.controls.editorControls();
    };
    return my;
})();

polygons.styles = (function () {
    var my = {};

    my.overStyle = new OpenLayers.Style(
            {
                strokeColor: "black", strokeWidth: 6, strokeOpacity: 0.3, 
                pointRadius: 7, fillColor:"green", fill:false, 
                fillOpacity:0.3, strokeDashstyle: "solid",
                label : "${name}",
                fontColor: "black", fontSize: "15px", fontOpacity: 0.6,
                fontFamily: "Arial", fontWeight: "bold",
                labelAlign: "cc",labelOutlineColor: "white", labelOutlineWidth: 3
            },
            {
                rules: [
                    new OpenLayers.Rule({
                        minScaleDenominator: 200000000,
                        symbolizer: {
                            strokeOpacity: 0.8,
                            fontSize: "0px"
                        }
                    }),
                    new OpenLayers.Rule({
                        maxScaleDenominator: 200000000,
                        minScaleDenominator: 50000,
                        symbolizer: {
                            strokeOpacity:0.6,
                            fontSize: "8px"
                        }
                    }),
                    new OpenLayers.Rule({
                        maxScaleDenominator: 50000,
                        minScaleDenominator: 20000,
                        symbolizer: {
                            strokeWidth:12,
                            strokeOpacity: 0.4,
                            fontSize: "15px"
                        }
                    }),
                    new OpenLayers.Rule({
                        maxScaleDenominator: 20000,
                        symbolizer: {
                            strokeWidth:18,
                            strokeOpacity: 0.3,
                            fontSize: "30px"
                        }
                    })
                ]
    });
            
    my.overStyleMap = new OpenLayers.StyleMap({'default':my.overStyle});

    my.vectorStyleMap = new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({strokeColor: "green", 
            strokeWidth: 2, strokeOpacity: 1, pointRadius: 2, 
            fillColor:"green", fill:true, fillOpacity:0.1}),
        'select': new OpenLayers.Style({strokeColor: "blue", 
            strokeWidth: 5, strokeOpacity: 0.6, pointRadius: 2, 
            fillColor:"blue", fill:true, fillOpacity:0.3}),
        'temporary': new OpenLayers.Style({strokeColor: "green", 
            strokeWidth: 3, strokeOpacity: 0.6, pointRadius: 8, 
            fillColor:"blue", fill:true, fillOpacity:0.5})
    });

    return my;
})();

polygons.controls = (function () {
    var my = {}, 
        renderTemplate;

    my.renderer = function (evt) {
        var tagsDiv = $('#tags');
        if (evt.type == 'featureunselected') {
            tagsDiv.empty();
        } else {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {'action':'getTags',
                    'database':polygons.core.config.database,
                    'sid': evt.feature.fid},
                url:  polygons.core.config.cgiDirectory+'editor.py',
                success: function( tags ) {
                    tagsDiv.empty();
                    tagsDiv.append(renderTemplate(tags));
                }
            });            
        }
    };

    my.viewerControls = function () {
        Handlebars.registerHelper('ifLink', function(conditional, options) {
          if(this.k.slice(0,4) == 'link') {
            result = "<a href='"+ polygons.core.config.docDirectory + this.v + "' target='_blank'>"+this.v+"</a>";
            return result;
          } else {
            return this.v;
          }
        });

        renderTemplate = Handlebars.compile($('#staticTemplate').html());

    };

    my.editorControls = function () {
        renderTemplate = Handlebars.compile($('#editableTemplate').html());
    };
    


    my.mapResize = function () {
        var bodyheight = $(window).height();
        $("#mapBox").height(bodyheight-110);
        $(window).resize(function() {
            bodyheight = $(window).height();
            $("#mapBox").height(bodyheight-110);
            setTimeout( function() { map.updateSize();}, 500);
        });
    };

    $('#capas :checkbox').click(function() {
        var layer = $(this)[0].value;
        if($(this).is(':checked')){
            polygons.map.toggleLayer(layer,true);
        } else {
            polygons.map.toggleLayer(layer,false);
        }
    });

    return my;
})();


//     function setTags(event) {
//         $.ajax({
//         type: 'POST',
//         dataType: 'json',
//         data: {'action':'getTags',
//             'database':database,
//             'sid': event.feature.fid},
//         url:  cgiDir+'editor.py',
//         success: function( tags ) {
//             for (var key in tags) {
//                 if (key.slice(0,4) == 'link') {
//                     $("#tags").append('<dt>' + key.slice(5) + '</dt>');
//                     $("#tags").append("<dd><a href='"+ docDir + tags[key] + "' target='_blank'>"+tags[key]+"</a></dd>");
//                 } else if (key == 'codigo') {
//                 } else {
//                     $("#tags").append('<dt>' + key + '</dt>');
//                     $("#tags").append('<dd>' + tags[key] + '</dd>');
//                 }
//             };
//             }
//         });
//     }

