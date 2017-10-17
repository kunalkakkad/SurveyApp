angular.module('MyApp')
    .factory('VCLData', function($rootScope,$http,$q,$log) {

        var PRT = this;
        var storageService = {};
                
        storageService.dummy = function(msg) {
            console.log(msg);
        };

        var vehicles = $q.defer();

        storageService.vehicleRetriever = function(){
            // console.info('Vehicle Retrieval');
            // return $http.get('http://192.168.0.5:8081/api/vehicles/')
            return $http.get($rootScope.APIPath+'/api/vehicles/')
            // 23.08.17 #2 Changed to return the above, masterDataLoader will handle the rest. Same change has been done to other
            // factories like this one, without comments. COMMENT, CODE EXPLANATION

            // .then(function(response) {
                
                // 23.08.17 #1 No longer adding to rootScope here, this is sent to masterDataLoader where the data is assigned to 
                // rootScope
                // Adding this to rootScope as this is used as is for dropdowns by whatever tabs need it and also used as is for the 
                // vehicle master
                // $rootScope.vehiclesList = response.data.result;
                
            //     console.log("Got vehicles list",response);

            //     vehicles.resolve({data:response.data.result});        
            // }, 
            // function (err){
            //     console.log('errors', err);
            //     vehicles.reject(err);
            // }); 
            // return vehicles.promise;                               
        };

        var vehicleUpdate = $q.defer();
        storageService.vehicleUpdater = function(vehicle){
            $http({
                    method : "PUT",
                    url : $rootScope.APIPath+"/api/vehicles/",
                    data : vehicle
                })
                .then(function(response){                        
                    console.log('Success', response);                                                                  
                    swal("Done!", "The Vehicle's information has been updated!", "success");
                    vehicleUpdate.resolve();
                },
                function (response){
                    console.log('errors', response);
                    vehicleUpdate.reject();
            });
            return vehicleUpdate.promise;            
        };
        
        var vehicleCreate  = $q.defer();
        storageService.vehicleCreator = function(vehicle){
            $http({
                    method : "POST",
                    url : $rootScope.APIPath+"/api/vehicles/",
                    data : vehicle 
                })
                .then(function(response){                        
                    console.log('Success', response);                                                                  
                    swal("Done!", "The Vehicle has been Created!", "success");
                    vehicleCreate.resolve();
                },
                function (response){
                    console.log('errors', response);
                    vehicleCreate.reject();
            });
            return vehicleCreate.promise;
        };

        var vehicleDelete = $q.defer();
        storageService.vehicleDelete = function(id){
            $http.delete($rootScope.APIPath+'/api/vehicles/'+id)
                .then(function(response) {
                    vehicleDelete.resolve();
                    swal("Done!", "The Vehicle has been deleted!", "success");
                },
                function (response) {
                    vehicleDelete.reject();
                    console.log('errors', response);
            });
            return vehicleDelete.promise;
        };        

        storageService.vehiclePartsRetriever = function(id){
            return $http.get($rootScope.APIPath+'/api/vehicle_parts?vehicleId='+id)                 
        };

        var partUpdate = $q.defer();
        storageService.vehiclePartUpdater = function(part){
            $http({
                    method : "PUT",
                    url : $rootScope.APIPath+"/api/vehicle_parts/",
                    data : part 
                })
                .then(function(response){                        
                    console.log('The part has been updated', response);                                                                                      
                    partUpdate.resolve();
                },
                function (response){
                    console.log('errors', response);
                    partUpdate.reject();
            });
            return partUpdate.promise;            
        };

        var partStore = $q.defer();
        storageService.vehiclePartStorer = function(part){
                $http({
                        method : "POST",
                        url : $rootScope.APIPath+"/api/vehicle_parts/",
                        data : part 
                    })
                    .then(function(response) {                        
                        console.log('Success', response);                                                                  
                        swal("Done!", "The part has been added!", "success");
                        partStore.resolve();
                    },
                    function (response) {
                        console.log('errors', response);
                        partStore.resolve();
            });   
            return partStore.promise;                                     
        }; 

        storageService.vehiclePartDeleter = function(part){
            return $http.delete($rootScope.APIPath+'/api/vehicle_parts?vehicleId='+part._id)
        };

        
        
        return storageService;
});
