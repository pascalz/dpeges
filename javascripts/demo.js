(function(module) {
	
	module.controller('dpeCtrl', [
		"$scope", '$sce', function($scope, $sce) {
			$scope.value = 200;
			$scope.width = 250;
			$scope.height = 200;
			$scope.shadow = true;

			$scope.drawDPE = function() {
				$scope.code = prettyPrintOne($scope.getCode());
				var d = new DPE({
					domID: 'dpe',
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
				return "var dpe = new DPE({\r\n    domID: 'dpe',\r\n    width: " +
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
				var g = new GES({
					domID: 'ges',
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
				return "var ges = new GES({\r\n    domID: 'ges',\r\n    width: " +
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

}(angular.module("app")));
