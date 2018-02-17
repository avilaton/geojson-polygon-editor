// require('OpenLayers')

define([],
  function () {
    var Styles = {};
console.log(OpenLayers)
    Styles.overStyle = new OpenLayers.Style(
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

    Styles.overlay = new OpenLayers.StyleMap({'default':Styles.overStyle});

    Styles.select = new OpenLayers.StyleMap({
      'default': new OpenLayers.Style({strokeColor: "green", 
        strokeWidth: 2, strokeOpacity: 1, pointRadius: 6, 
        fillColor:"green", fill:true, fillOpacity:0.1}),
      'select': new OpenLayers.Style({strokeColor: "green", 
        strokeWidth: 5, strokeOpacity: 0.6, pointRadius: 6, 
        fillColor:"yellow", fill:true, fillOpacity:0.3}),
      'temporary': new OpenLayers.Style({strokeColor: "green", 
        strokeWidth: 5, strokeOpacity: 0.6, pointRadius: 8, 
        fillColor:"yellow", fill:true, fillOpacity:0.5})
    });

    return Styles;
});


