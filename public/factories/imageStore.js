angular.module('MyApp')
    .factory('IMGData', function($rootScope,$http) {

        var IMGD = this;
        var storageService = {};
                
        storageService.dummy = function() {
            console.log('Hello world from IMGData factory/service!');
        };

        storageService.vehiclePartDeleter = function(id){
            $http.delete('http://125.99.24.66:8081/api/vehicle_parts/'+id)
                    .then(function(response) {
                        $rootScope.vPDS = true;      
                        swal("Done!", "The part has been deleted!", "success");
                    },
                    function (response) {
                        console.log('errors', response);
            });                
        };

        storageService.albumImgStorer = function(pic){
                $http({
                        method : "POST",
                        url : "http://125.99.24.66:8081/api/survey_album_photos/",
                        data : pic 
                    })
                    .then(function(response) {                        
                        // $rootScope.vNPAS = true;      
                        console.log('Success', response);                                                                  
                        swal("Done!", "Your image has been stored!", "success");
                    },
                    function (response) {
                        console.log('errors', response);
            });                
        };
    
        return storageService;
});
