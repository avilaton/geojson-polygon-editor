var angular = require('angular')
var MapModule = require('../map')

var ngModule = angular.module('EditorModule', [
    MapModule
])

function EditorController ($http, $scope) {
    var ctrl = this
    this.save = function () {
        // $http.put('/api/layers/obrasprivadas.geojson', {})
    }

    this.onFeatureSelected = function (event) {
        console.log(event.feature.attributes)
        ctrl.feature = event.feature
        $scope.$apply()
    }
}

EditorController.$inject = ['$http', '$scope']

ngModule.component('editor', {
    template: `
<div class="row-fluid">
    <div class="span3">
      <div class="control-group">
        <label class="control-label"></label>
        <div class="controls">
          <button class="btn btn-primary" ng-click="$ctrl.save()">Save</button>
        </div>
      </div>  
      <div>
        <legend>Polygon Data</legend>
        <tags></tags>
        <dl class="dl">
            <div ng-repeat="(key, value) in $ctrl.feature.attributes">
                <dt>
                    <a href="#" class="remove-tag" data-id="{{id}}">
                        <i class="icon-trash"></i>
                    </a>
                    <div class="editable key" data-id="{{id}}" contenteditable="true">{{key}}</div>
                </dt>
                <dd>
                    <div class="editable value" data-id="{{id}}" contenteditable="true">{{value}}</div>
                </dd>
            </div>
        </dl>

        <pre>{{$ctrl.feature}}</pre>
    </div>
  </div>
  
    <div class="span9">
        <map on-select="$ctrl.onFeatureSelected({feature: feature})"></map>
    </div>
</div>
`,
    controller: EditorController
});

module.exports = ngModule.name
