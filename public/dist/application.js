'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'simple';
	var applicationModuleVendorDependencies = [
		// Dependencias de angular
		'ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',
		// Dependencias de ui
		'ui.router', 'ui.bootstrap', 'ui.utils',
		// Dependencias de terceros usadas por mi
		'angularFileUpload','jsonFormatter',
		'ngAria','ngMaterial'
	];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('dashboards');
'use strict';

// Use application configuration module to register a new module
ApplicationConfiguration.registerModule('subirarchivo');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('dashboards').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Dashboards', 'dashboards/list');

	}
]);

'use strict';

//Setting up route
angular.module('dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Dashboards state routing
		$stateProvider.
		state('listDashboards', {
			url: '/dashboards/list',
			templateUrl: 'modules/dashboards/views/list-dashboards.client.view.html'
		}).
		state('createDashboard', {
			url: '/dashboards/create',
			templateUrl: 'modules/dashboards/views/create-dashboard.client.view.html'
		}).
		state('viewDashboard', {
			url: '/dashboards/:dashboardId',
			templateUrl: 'modules/dashboards/views/view-dashboard.client.view.html'
		}).
		state('editDashboard', {
			url: '/dashboards/:dashboardId/edit',
			templateUrl: 'modules/dashboards/views/edit-dashboard.client.view.html'
		})
		;

	}
]);

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

'use strict';

//Dashboards service used to communicate Dashboards REST endpoints
angular.module('dashboards').factory('Dashboards', ['$resource',
	function($resource) {
		return $resource('dashboards/:dashboardId', { dashboardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
angular.module('dashboards').factory('NameFile', ['$resource',
	function($resource) {
		return $resource('nameFile/:fileId', { fileId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

// Configuring the Articles module
angular.module('subirarchivo').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar','Interpretar archivo','subirarchivo');

    }
]);

'use strict';

//Setting up route
angular.module('subirarchivo').config(['$stateProvider',
	function($stateProvider) {
		// Subirarchivo state routing
		$stateProvider.
		state('subirarchivo', {
			url: '/subirarchivo',
			templateUrl: 'modules/subirarchivo/views/subirarchivo.client.view.html'
		});
	}
]);

'use strict';
/**
 *
 */
angular.module('subirarchivo')
	.controller('SubirarchivoController', ['$scope', 'FileUploader','$modal','$log','Authentication','Filestgd','$location',
		function($scope,FileUploader,$modal,$log,Authentication,Filestgd,$location,$stateParams) {


			//graba fichero en base de datos
			$scope.crear = function(filename,item){
				item.progress=0;
				var itemsave=new Object();
				$scope.itemsave=itemsave;
				//$scope.itemsave.mensaje="Grabando en bbdd";
				item.mensaje="Grabando en bbdd ......";
				item.progressbar="indeterminate";
				item.isSuccess=false;
				var filestgd=new Filestgd($scope.tgd[filename]);
				filestgd.$save(function(response) {
					item.save=true;
					item.progressbar="determinate";
					item.progress=100;
					item.mensaje=" Archivo grabado en bbdd";
					item.isSuccess=true;
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
					item.isError=true;
					item.isSuccess=false;
					if (errorResponse.status==304)
					item.mensaje=" Ya existe en bbdd";
					item.progress=100;
					item.progressbar="determinate";
				});
			};

		$scope.authentication = Authentication;
		// oculta o muestra el boton salvar que guarda los archivos interpretados en la bbdd
			if($scope.authentication.user==""){
				$scope.authentication.botonsave=false;
			}else{
				$scope.authentication.botonsave=true;
			};



		// array que recoge los ficheros interpretados en json:{nombre_fichero,lista_bloques}
		$scope.tgd=[];

		// url REST del server configurado en subirarchivo.server.routes
		var uploader = $scope.uploader = new FileUploader({
			url: '/file'
		});

		// FILTERS
		uploader.filters.push({
			name: 'customFilter',
			progressbar:"determinate",
			mensaje:"",
			save:false,
			fn: function (item /*{File|FileLikeObject}*/, options) {
				return this.queue.length < 10;
			}
		});
		uploader.filters.push({ name: 'size',
			fn: function(item) {
			return item.size < 500000;
		}});

		// CALLBACKS

		uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
			console.info('onWhenAddingFileFailed', item, filter, options);
		};
		uploader.onAfterAddingFile = function (fileItem) {
			//console.info('onAfterAddingFile', fileItem);
			fileItem.upload();
		};
		uploader.onAfterAddingAll = function (addedFileItems) {
			//console.info('onAfterAddingAll', addedFileItems);
		};
		uploader.onBeforeUploadItem = function (item) {
			item.mensaje="Interpretando archivo...."
			//console.info('onBeforeUploadItem', item);
		};
		uploader.onProgressItem = function (fileItem, progress) {
			//console.info('onProgressItem', fileItem, progress);
		};
		uploader.onProgressAll = function (progress) {
			//console.info('onProgressAll', progress);
		};
		uploader.onSuccessItem = function (fileItem, response, status, headers) {
			fileItem.mensaje="Archivo Interpretado"
			fileItem.save=false;
			console.info('onSuccessItem', fileItem.save);
		};
		uploader.onErrorItem = function (fileItem, response, status, headers) {
			fileItem.mensaje=response;
			console.info(status);
			fileItem.mensaje=response;
			//console.info('onErrorItem', fileItem, response, status, headers);
		};
		uploader.onCancelItem = function (fileItem, response, status, headers) {
			//console.info('onCancelItem', fileItem, response, status, headers);
		};
		uploader.onCompleteItem = function (fileItem, response, status, headers) {
			//console.info('onCompleteItem', fileItem, response, status, headers);
			console.info(status);
			if (status==200)
			//$scope.tgd[fileItem.file.name]=angular.fromJson(response);
			$scope.tgd[fileItem.file.name]=response;
			if (status==415)
				fileItem.mensaje=" fichero sin bloques de datos";
		};
		uploader.onCompleteAll = function () {
			console.info('onCompleteAll');
		};

		console.info('uploader', uploader);

		// Apertura de ventana modal
		$scope.open = function (size,namefile) {

			var modalInstance = $modal.open({
				templateUrl: '/modules/subirarchivo/views/popup.archivo.html',
				controller: 'ModalInstanceCtrl',
				size: size,
				resolve: {
					tgd: function () {
						return $scope.tgd[namefile];
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

	}]);

angular.module('subirarchivo')
	.controller('ModalInstanceCtrl',["$scope", "$modalInstance", "tgd", function ($scope, $modalInstance, tgd) {
		var key=[];
		var values=[];
		var lista=[];
		var tabs=[];
		var objeto=angular.fromJson(tgd);
		var nameFile=objeto.nameFile;

		angular.forEach(tgd.lista_bloque,function(value,key){this.push(key);},key);
		angular.forEach(tgd.lista_bloque,function(value,key){this.push(angular.toJson(value));},values);
		angular.forEach(objeto.lista_bloque,function(value,key){this.push(key);},tabs);
		for(var i=0;i<key.length;i++){lista[key[i]]=JSON.parse(values[i]);}

		$scope.name_blocks=key;
		$scope.value_blocks=values;
		$scope.lista_blocks=lista;
		$scope.tabs=tabs;
		$scope.tgd=objeto;
		$scope.nameFile=nameFile;
		$scope.ok = function () {
			$modalInstance.close();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
	}]);

// Please note that $modalInstance represents a modal window (instance) dependency.;

'use strict';

//Filetgd service used for communicating with the fileTgd REST endpoints
angular.module('subirarchivo').
	factory('Filestgd', ['$resource',
	function($resource) {
		return $resource('file/save/', {filetgd: '@_id'}, {update: {method: 'PUT'}});
	}
]);

'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);