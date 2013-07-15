var polygons = polygons || {};


polygons.map = (function () {
    var my = {}, 
        map = {},
        config = {
            INIT_LON: -64.1857371,
            INIT_LAT: -31.4128832,
            INIT_ZOOM: 12,
            localOsm: true
        };

    my.init = function (){
        map = new OpenLayers.Map('map', {controls : [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar(),
                new OpenLayers.Control.LayerSwitcher({'ascending':false}),
                new OpenLayers.Control.ScaleLine(),
                new OpenLayers.Control.MousePosition({displayProjection: 
                new OpenLayers.Projection("EPSG:4326")}),
                new OpenLayers.Control.Attribution()
                ]
            });
        if (config.localOsm) {
            baselayer = new OpenLayers.Layer.OSM('Mosaico Local',
                'http://localhost:8005/${z}/${x}/${y}.png',
                {numZoomLevels: 22, alpha: true, isBaseLayer: true});
        } else {
            baselayer = new OpenLayers.Layer.OSM('OSM Map');
        }
        map.addLayer(baselayer);

        if (typeof(google) === 'object') {
            gmap = new OpenLayers.Layer.Google("Google Streets",{
                numZoomLevels: 20,animationEnabled:false
                });
            map.addLayer(gmap);
            gsat = new OpenLayers.Layer.Google("Google Satellite",{
                type: google.maps.MapTypeId.SATELLITE,
                numZoomLevels: 22,animationEnabled:false
                });
            map.addLayer(gsat);
        };
    
        map.setCenter(
            new OpenLayers.LonLat(config.INIT_LON, config.INIT_LAT).transform(
                new OpenLayers.Projection("EPSG:4326"),
                map.getProjectionObject()
            ), config.INIT_ZOOM
        );

        my.vectorFormat = new OpenLayers.Format.GeoJSON({
            'internalProjection': map.baseLayer.projection,
            'externalProjection': new OpenLayers.Projection("EPSG:4326")
        });

        my.map = map;
    };

    my.addLayers = function () {
        var barriosLayer,
            distritosLayer,
            cpcLayer;

        barriosLayer = new OpenLayers.Layer.GML("Barrios", "data/barriosTitle.osm", {
                        format: OpenLayers.Format.OSM,
                        styleMap: polygons.styles.overStyleMap,
                        visibility: false
                    });
        barriosLayer.id = 'barriosLayer';
        map.addLayer(barriosLayer);

        distritosLayer = new OpenLayers.Layer.GML("Distritos", "data/distritos.osm", {
                        format: OpenLayers.Format.OSM,
                        styleMap: polygons.styles.overStyleMap,
                        visibility: false
                    });
        distritosLayer.id = 'distritosLayer';
        map.addLayer(distritosLayer);

        cpcLayer = new OpenLayers.Layer.GML("Zonas CPC", "data/cpc.osm", {
                        format: OpenLayers.Format.OSM,
                        styleMap: polygons.styles.overStyleMap,
                        visibility: false
                    });
        cpcLayer.id = 'cpcLayer';
        map.addLayer(cpcLayer);

        vectorLayer = new OpenLayers.Layer.Vector("Vector Layer", {
            styleMap : polygons.styles.vectorStyleMap,
            projection: new OpenLayers.Projection("EPSG:4326"),
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                        url: polygons.core.config.cgiDirectory+"editor.py?action=getShapes&database="+polygons.core.config.database,
                format: new OpenLayers.Format.GeoJSON()
            })
        });
        vectorLayer.id = 'vector';
        map.addLayer(vectorLayer);

        vectorLayer.events.on({
            "featureselected": polygons.controls.renderer,
            "featureunselected": polygons.controls.renderer
        });

        controls = {
            select: new OpenLayers.Control.SelectFeature(
                vectorLayer,
                {
                    clickout: true, toggle: true,
                    multiple: false, hover: false
                }
            )
        };
        controls.select.handlers['feature'].stopDown = false;
        controls.select.handlers['feature'].stopUp = false;
        map.addControl(controls['select']);
        controls.select.activate();
        vectorLayer.events.fallThrough = true;
    };

    my.saveVectorLayer = function () {
        featuresString = vectorFormat.write(vectorLayer.features,true);
        $('input#guardarMapa')
            .attr("disabled",'disabled')
            .attr("value",'Guardando Mapa...');
        $.ajax( {
            type: 'POST',
            dataType: 'json',
            data: {'action':'saveShapes','database':polygons.core.config.database,
                'features': featuresString
                },
            url:  polygons.core.config.cgiDirectory+'editor.py',
            success: function( result ) {
                setTimeout(function() {
                    $('input#guardarMapa')
                        .removeAttr("disabled")
                        .attr("value","Guardar Polígonos");
                },1000);
                vectorLayer.refresh();
            }
        });
        return false;        
    };

    my.toggleLayer = function (layer,visibility) {
        map.getLayer(layer).setVisibility(visibility);
    };

    return my;
})();