'use strict';

// Dashboards controller
angular.module('dashboards').controller('DashboardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dashboards','NameFile',
	function($scope, $stateParams, $location, Authentication, Dashboards,NameFile) {
		$scope.authentication = Authentication;

		// Create new Dashboard
		$scope.create = function() {
			// Create new Dashboard object
			var dashboard = new Dashboards ({
				name: this.name
			});

			// Redirect after save
			dashboard.$save(function(response) {
				$location.path('dashboards/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dashboard
		$scope.remove = function(dashboard) {
			if ( dashboard ) { 
				dashboard.$remove();

				for (var i in $scope.dashboards) {
					if ($scope.dashboards [i] === dashboard) {
						$scope.dashboards.splice(i, 1);
					}
				}
			} else {
				$scope.dashboard.$remove(function() {
					$location.path('dashboards');
				});
			}
		};

		// Update existing Dashboard
		$scope.update = function() {
			var dashboard = $scope.dashboard;

			dashboard.$update(function() {
				$location.path('dashboards/' + dashboard._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dashboards
		$scope.find = function() {
			$scope.dashboards = Dashboards.query();
		};

		// Find existing Dashboard
		$scope.findOne = function() {
			$scope.dashboard = Dashboards.get({ 
				dashboardId: $stateParams.dashboardId
			});
		};

		//Find nameFile
		$scope.find_nameFile = function() {
			$scope.nameFiles=NameFile.query();
		};
		// Find existing Dashboard
		$scope.find_listabloque = function(id) {

			$scope.lista = NameFile.get({fileId: id});
			$scope.identification=$scope.lista.EF_IDENTIFICATION;
			console.log($scope.lista);
			//console.log($scope.lista);
			//$scope.lista = NameFile.query();
			//console.log($scope.lista);
			//var tgd=$scope.dashboards;
			/*
			console.log("tgd:",tgd);
			var objeto=angular.fromJson(tgd);
			var key=[];
			var values=[];
			var lista=[];
			var tabs=[];
			angular.forEach(tgd.lista_bloque,function(value,key){this.push(key);},key);
			angular.forEach(tgd.lista_bloque,function(value,key){this.push(angular.toJson(value));},values);
			angular.forEach(objeto.lista_bloque,function(value,key){this.push(key);},tabs);
			for(var i=0;i<key.length;i++){lista[key[i]]=JSON.parse(values[i]);}
			$scope.lista_blocks=lista;
			console.log("tabs:",tabs);
			console.log("namefile:",objeto);
			$scope.tabs=tabs;
			*/

		};
	}
]);
