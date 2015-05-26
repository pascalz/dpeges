/* global prettyPrintOne */
/* global angular */
/* global DpeGes */
(function(module, dpeges) {
	
	module.controller('dpeCtrl', [
		"$scope", '$sce', function($scope, $sce) {
			$scope.value = 200;
			$scope.width = 250;
			$scope.height = 200;
			$scope.shadow = true;

			$scope.drawDPE = function() {
				$scope.code = prettyPrintOne($scope.getCode());
				dpeges.dpe({
					domId: 'dpe',
					width: $scope.width,
					height: $scope.height,
					shadow: $scope.shadow,
					value: $scope.value
				});
			};

			$scope.to_trusted = function(htmlCode) {
				return $sce.trustAsHtml(htmlCode);
			};

			$scope.getCode = function() {
				return "var dpeges = new DpeGes();\r\ndpeges.dpe({\r\n    domID: 'dpe',\r\n    width: " +
					$scope.width + ",\r\n    height: " +
					$scope.height + ",\r\n    value: " +
					$scope.value +
					($scope.shadow ? ",\r\n    shadow: true" : "") +
					"\r\n});";
			};

			$scope.code = prettyPrintOne($scope.getCode());

			$scope.$watchCollection("[value, width, height]", function (newVals, oldVals, scope) {
				scope.code = prettyPrintOne(scope.getCode());
				scope.drawDPE();
			});
		}
	]);

	module.controller('gesCtrl', [
		"$scope", '$sce', function($scope, $sce) {
			$scope.value = 30;
			$scope.width = 250;
			$scope.height = 200;
			$scope.shadow = false;

			$scope.drawGES = function() {
				$scope.code = prettyPrintOne($scope.getCode());
				dpeges.ges({
					domId: 'ges',
					width: $scope.width,
					height: $scope.height,
					shadow: $scope.shadow,
					value: $scope.value
				});
			};

			$scope.to_trusted = function(htmlCode) {
				return $sce.trustAsHtml(htmlCode);
			};

			$scope.getCode = function() {
				return "var dpeges = new DpeGes();\r\ndpeges.ges({\r\n    domID: 'ges',\r\n    width: " +
					$scope.width + ",\r\n    height: " +
					$scope.height + ",\r\n    value: " +
					$scope.value +
					($scope.shadow ? ",\r\n    shadow: true" : "") +
					"\r\n});";
			};

			$scope.code = prettyPrintOne($scope.getCode());

			$scope.$watchCollection("[value, width, height]", function (newVals, oldVals, scope) {
				scope.code = prettyPrintOne(scope.getCode());
				scope.drawGES();
			});
		}
	]);

}(angular.module("app"), DpeGes()));
