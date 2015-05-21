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
	.controller('ModalInstanceCtrl',function ($scope, $modalInstance, tgd) {
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
	});

// Please note that $modalInstance represents a modal window (instance) dependency.;
