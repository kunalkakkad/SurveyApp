angular.module('MyApp')
    .factory('INSData', function($rootScope,$http, $q) {

        var INS = this;
        var storageService = {};

        storageService.dummy = function() {
            console.log('Hello world from INSData factory/service!');
        };

        storageService.insurerRetriever = function(){
            return $http.get('http://125.99.24.66:8081/api/insurers/')                       
        };

        storageService.insurerUpdater = function(insurer){
            var insurerUpdate = $q.defer();
            $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/insurers/"+insurer._id,
                    data : insurer 
                })
                .then(function(response){                        
                    console.log('Success', response);                                                                  
                    insurerUpdate.resolve();
                },
                function (response){
                    insurerUpdate.reject();
                    console.log('errors', response);
            });
            return insurerUpdate.promise;            
        };

        storageService.insurerDelete = function(id){
            var insurerDelete = $q.defer();
            $http.delete('http://125.99.24.66:8081/api/insurers/'+id)
                .then(function(response) {
                    swal("Done!", "The Insurer has been deleted!", "success");
                    insurerDelete.resolve();
                },
                function (response) {
                    console.log('errors', response);
                    insurerDelete.reject();
            });
            return insurerDelete.promise;
        };

        storageService.insurerCreator = function(insurer){
            var insurerCreate  = $q.defer();
            $http({
                    method : "POST",
                    url : "http://125.99.24.66:8081/api/insurers/",
                    data : insurer 
                })
                .then(function(response){                        
                    console.log('Success', response);                                                                  
                    swal("Done!", "The Insurer has been Created!", "success");
                    insurerCreate.resolve();
                },
                function (response){
                    console.log('errors', response);
                    insurerCreate.reject();
            });
            return insurerCreate.promise;
        };

        storageService.insurerFeeRetriever = function(id){
            return $http.get('http://125.99.24.66:8081/api/insurer_fees?insurerId='+id)                
        };

        storageService.insurerFeeUpdater = function(fee){
            var feeUpdate = $q.defer();
            $http({
                    method : "PUT",
                    url : "http://125.99.24.66:8081/api/insurer_fees/",
                    data : fee 
                })
                .then(function(response){                        
                    feeUpdate.resolve();
                    console.log('Success', response);                                                                                      
                },
                function (response){
                    feeUpdate.reject();
                    console.log('errors', response);
            });
            return feeUpdate.promise;            
        };

        storageService.insurerFeeDeleter = function(id){
            var feeDelete = $q.defer();
            $http.delete('http://125.99.24.66:8081/api/insurer_fees/'+id)
                .then(function(response) {
                    feeDelete.resolve();
                },
                function (response) {
                    console.log('errors', response);
                    feeDelete.reject();
            });
            return feeDelete.promise;
        };

        storageService.insurerFeeCreator = function(fee){
            var feeCreate  = $q.defer();
            $http({
                    method : "POST",
                    url : "http://125.99.24.66:8081/api/insurer_fees/",
                    data : fee 
                })
                .then(function(response){                        
                    console.log('Success', response);                                                                  
                    feeCreate.resolve();
                },
                function (response){
                    console.log('errors', response);
                    feeCreate.reject();
            });
            return feeCreate.promise;
        };

        return storageService;
});
